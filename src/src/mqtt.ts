import mqtt from "mqtt";

const client = mqtt.connect("wss://h4fd6666.ala.asia-southeast1.emqxsl.com:8084/mqtt", {
  username: "esp32",
  password: "esp32",
  clientId: "web_" + Math.random().toString(16).substr(2, 8),
});

client.on("connect", () => {
  console.log("MQTT connected");

  client.subscribe("esp32/data");
});

client.on("message", (topic, message) => {
  const data = JSON.parse(message.toString());
  console.log("收到数据:", data);

  // 👉 这里你可以后面接 UI 更新
});

export default client;
