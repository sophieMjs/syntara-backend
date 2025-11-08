// discovery-broker.js
// Usage: node discovery-broker.js --port 4000 --secret "syntara"
// discovery-broker.js
// Usage: node discovery-broker.js --port 4000 --secret "miclave"

const dgram = require('dgram');
const http = require('http');
const WebSocket = require('ws');
const argv = require('minimist')(process.argv.slice(2));

const UDP_PORT = 41234;
const HTTP_PORT = Number(argv.port || 4000);
const PEER_TTL = 15000;
const SECRET = argv.secret || 'local-secret';

const peers = new Map();

function peerId(obj) {
    return `${obj.name}|${(obj.ipCandidates && obj.ipCandidates[0]) || 'unknown'}|${obj.port}`;

}

const udp = dgram.createSocket('udp4');
udp.on('error', (err) => console.error('UDP error', err));
udp.on('message', (msg, rinfo) => {
    try {
        const payload = JSON.parse(msg.toString());
        if (payload.secret !== SECRET) return; // reject unauthorized
        const ip = (payload.ipCandidates && payload.ipCandidates[0]) || rinfo.address;
        const obj = {
            name: payload.name || 'node',
            ipCandidates: payload.ipCandidates || [rinfo.address],
            port: payload.port || 3000,
            ts: Date.now()
        };
        const id = peerId(obj);
        peers.set(id, obj);
        broadcastWs({ type: 'peers_update', peers: listPeers() });
    } catch (e) {
        console.error('UDP parse error', e.message);
    }
});
udp.bind(UDP_PORT, () => console.log(`Broker UDP listening ${UDP_PORT}`));

// CORS básico (para permitir que Angular consulte /register y /peers)
const { createServer } = require('http');

function sendCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

const server = http.createServer((req, res) => {
    // --- Registrar peers via HTTP (para navegadores o scripts) ---
    if (req.method === 'POST' && req.url === '/register') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const payload = JSON.parse(body);
                if (payload.secret !== SECRET) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'unauthorized' }));
                }
                const ip = (payload.ipCandidates && payload.ipCandidates[0]) || req.socket.remoteAddress.replace('::ffff:', '');
                const obj = {
                    name: payload.name || 'unknown',
                    ipCandidates: payload.ipCandidates || [ip],
                    port: payload.port || 0,
                    ts: Date.now()
                };
                const id = peerId(obj);
                peers.set(id, obj);
                broadcastWs({ type: 'peers_update', peers: listPeers() });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: true, peer: obj }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'bad request', message: e.message }));
            }
        });
        return;
    }
    if (req.method === 'OPTIONS') {
        sendCors(res);
        res.writeHead(204);
        return res.end();
    }
    sendCors(res);
    if (req.method === 'GET' && req.url.startsWith('/peers')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(listPeers()));
        return;
    }
    // optional: small health
    if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
        return;
    }
    res.writeHead(404); res.end('Not found');
});

const wss = new WebSocket.Server({ noServer: true });
function broadcastWs(message) {
    const data = JSON.stringify(message);
    wss.clients.forEach((c) => { if (c.readyState === WebSocket.OPEN) c.send(data); });
}

server.on('upgrade', (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => { wss.emit('connection', ws, req); });
});

wss.on('connection', (ws) => ws.send(JSON.stringify({ type: 'peers_init', peers: listPeers() })));

server.listen(HTTP_PORT, () => console.log(`Broker HTTP/WebSocket en :${HTTP_PORT}`));

setInterval(() => {
    const now = Date.now();
    let changed = false;
    for (const [id, obj] of peers) {
        if (now - obj.ts > PEER_TTL) { peers.delete(id); changed = true; }
    }
    if (changed) broadcastWs({ type: 'peers_update', peers: listPeers() });
}, 5000);

function listPeers() {
    const arr = [];
    for (const obj of peers.values()) {
        arr.push({
            name: obj.name,
            ip: obj.ipCandidates && obj.ipCandidates[0] ? obj.ipCandidates[0] : 'unknown',
            port: obj.port,
            ts: obj.ts
        });
    }
    return arr;
}