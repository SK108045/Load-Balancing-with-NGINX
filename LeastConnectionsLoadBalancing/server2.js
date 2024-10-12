const http = require('http');
const port = 3001;

const server = http.createServer((req, res) => {
  setTimeout(() => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello from Node.js server 2 (with delay)!');
  }, 2000); // 2-second delay
});

server.listen(port, () => {
  console.log(`Server 2 running on http://localhost:${port}`);
});
