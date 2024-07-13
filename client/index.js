import http from "http";

export class MessageQueueClient {
  constructor(hostname, port) {
    this.options = {
      hostname: hostname,
      port: port,
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  // Enqueue a message to a specific channel
  enqueueMessage(channel, message) {
    const options = {
      ...this.options,
      path: `/enqueue/${channel}`,
      method: "POST",
    };

    const req = http.request(options, (res) => {
      console.log(`Status Code: ${res.statusCode}`);
      res.setEncoding("utf8");
      res.on("data", (data) => {
        console.log(`Response: ${data}`);
      });
    });

    req.on("error", (error) => {
      console.error(`Error: ${error.message}`);
    });

    req.write(JSON.stringify(message));
    req.end();
  }

  // Dequeue a message from a specific channel using async/await
  async dequeueMessage(channel, autoAck = true) {
    const options = {
      ...this.options,
      path: `/dequeue/${channel}?autoAck=${autoAck}`,
      method: "GET",
    };

    try {
      const data = await new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
          let rawData = "";
          res.setEncoding("utf8");
          res.on("data", (chunk) => {
            rawData += chunk;
          });

          res.on("end", () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(rawData);
            } else {
              reject(
                new Error(`Request failed with status code ${res.statusCode}`)
              );
            }
          });
        });

        req.on("error", (error) => {
          reject(error);
        });

        req.end();
      });

      console.log(`Message consume: ${data}`);
      return data;
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }

  ackMessage(channel, messageID) {
    const options = {
      ...this.options,
      path: `/ack/${channel}/${messageID}`,
      method: "POST",
    };

    const req = http.request(options, (res) => {
      console.log(`Status Code:${res.statusCode}`);
      res.setEncoding("utf-8");
      res.on("data", (data) => {
        console.log(`Response:${data}`);
      });
    });

    req.on("error", (error) => {
      console.error(`Error:${error.message}`);
    });
    req.end();
  }
  setNodes(nodes, backupNodes) {
    const options = {
      ...this.options,
      path: `/set-nodes`,
      method: "POST",
    };

    const req = http.request(options, (res) => {
      console.log(`Status Code : ${res.statusCode}`);
      res.setEncoding("utf-8");
      res.on("data", (data) => {
        console.log(`Response: ${data}`);
      });
    });
    req.on("error", (error) => {
      console.error(`Error: ${error.message}`);
    });
    req.write(JSON.stringify({ nodes, backupNodes }));
    req.end();
  }
}
