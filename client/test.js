import { MessageQueueClient } from "lionmq-clientside";
const host = "52.62.184.240";

const client = new MessageQueueClient(host, "80");

setInterval(() => {
  client.enqueueMessage("channel1", {
    messageType: "text",
    payload: `Message:${Math.random() + 10}`,
  });
}, 1000);
setInterval(() => {
  client.enqueueMessage("channel3", {
    messageType: "text",
    payload: `Message:${Math.random() + 10}`,
  });
}, 1000);

// client.setNodes(
//   ["http://localhost:3002", "http://localhost:3003"],
//   ["http://localhost:3005", "http://localhost:3006"]
// );
// client.setNodes(["http://localhost:3002"], []);
// client.setNodes([`http://${host}:3002`, `http://${host}:3003`], []);

// client.setNodes(
//   ["http://localhost:3002", "http://localhost:3003", "http://localhost:3004"],
//   ["http://localhost:3005", "http://localhost:3006", "http://localhost:3007"]
// );
