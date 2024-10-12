const http = require('http');
const port = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Node.js server 1!');
});

server.listen(port, () => {
  console.log(`Server 1 running on http://localhost:${port}`);
});
