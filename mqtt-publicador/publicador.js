import mqtt from "mqtt";
import axios from "axios";

// 🔹 Configuración
const BROKER_URL = "mqtt://broker.hivemq.com:1883"; // Broker público gratuito
const TOPIC = "fundamentos/ip";
const TOPIC_CONEXIONES = `${TOPIC}/conexiones`;
const INTERVALO = 10000; // 10 segundos

// 🔹 Conexión al broker
const client = mqtt.connect(BROKER_URL, {
    clientId: "publicador-" + Math.random().toString(16).substr(2, 8),
    clean: true,
});

// 🔹 Cuando se conecta al broker
client.on("connect", () => {
    console.log("✅ Conectado al broker MQTT");
    console.log(`📡 Publicando IP cada ${INTERVALO / 1000}s en el tópico "${TOPIC}"`);

    client.subscribe(TOPIC_CONEXIONES, () => {
        console.log(`👀 Escuchando conexiones en: "${TOPIC_CONEXIONES}"`);
    });

    publicarIP();
    setInterval(publicarIP, INTERVALO);
});

// 🔹 Cuando otro cliente se conecta
client.on("message", (topic, message) => {
    if (topic === TOPIC_CONEXIONES) {
        console.log(`👋 Nuevo cliente conectado: ${message.toString()}`);
    }
});

// 🔹 Función para publicar la IP
async function publicarIP() {
    try {
        const response = await axios.get("https://api.ipify.org?format=json");
        const ipPublica = response.data.ip;
        client.publish(TOPIC, ipPublica, { qos: 1 }, () => {
            console.log(`🌐 IP publicada: ${ipPublica}`);
        });
    } catch (error) {
        console.error("❌ Error al obtener la IP:", error.message);
    }
}

