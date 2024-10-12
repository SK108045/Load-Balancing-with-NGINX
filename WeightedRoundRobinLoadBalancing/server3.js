const http = require('http');
const port = 3002;

let requestCount = 0;

const server = http.createServer((req, res) => {
  requestCount++;
  console.log(`Server on port ${port} received request #${requestCount}`);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`Hello from Node.js server on port ${port}! Request #${requestCount}`);
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
