// discovery-announcer.js
// Usage: node discovery-announcer.js --name backend --port 3000 --interval 5000 --secret "syntara"
const dgram = require('dgram');
const os = require('os');
const argv = require('minimist')(process.argv.slice(2));

const NAME = argv.name || os.hostname();
const PORT = Number(argv.port || 3000);
const INTERVAL = Number(argv.interval || 5000);
const SECRET = argv.secret || 'local-secret';
const UDP_PORT = 41234;
const BROADCAST_ADDR = '255.255.255.255';

function getLocalIPs() {
    const nets = os.networkInterfaces();
    const results = [];
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) results.push(net.address);
        }
    }
    return results;
}

const socket = dgram.createSocket('udp4');
socket.bind(() => socket.setBroadcast(true));

function announce() {
    const payload = {
        name: NAME,
        ipCandidates: getLocalIPs(),
        port: PORT,
        ts: Date.now(),
        secret: SECRET
    };
    const msg = Buffer.from(JSON.stringify(payload));
    socket.send(msg, 0, msg.length, UDP_PORT, BROADCAST_ADDR, (err) => {
        if (err) console.error('Broadcast error', err.message);
    });
}

announce();
const timer = setInterval(announce, INTERVAL);

process.on('SIGINT', () => {
    clearInterval(timer);
    socket.close();
    process.exit(0);
});