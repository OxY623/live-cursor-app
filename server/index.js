const http = require("http");
const WebSocketServer = require("ws");
const url = require("url");
const uuidv4 = require("uuid").v4;

const server = http.createServer();
const PORT = 8000;
const wss = new WebSocketServer.Server({ server });
const connections = {};
const users = {};

const broadcast = () => {
  Object.keys(connections).forEach((uuid) => {
    const connection = connections[uuid];
    const message = JSON.stringify(users);
    connection.send(message);
  });
};

const handleMessage = (bytes, uuid) => {
  const message = JSON.parse(bytes);
  const user = users[uuid];
  user.state = message;

  broadcast();
};

wss.on("connection", (connection, request) => {
  // wss://localhost:8000?username=JohnDoe
  const { username } = url.parse(request.url, true).query;
  const uuid = uuidv4();
  console.log(username);
  console.log(uuid);
  connections[uuid] = connection;
  users[uuid] = {
    username: username,
    id: uuid,
    state: {
      //   x: 0,
      //   y: 0,
    },
  };

  connection.on("message", (data) => handleMessage(data, uuid));

  connection.on("close", () => {
    delete connections[uuid];
    delete users[uuid];
    broadcast();
  });
});

server.listen(PORT, () => {
  console.log(`WS Server is running on http://localhost:${PORT}`);
});
