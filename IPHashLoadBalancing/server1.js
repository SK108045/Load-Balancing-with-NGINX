const http = require('http');
const port = 3000; 

const server = http.createServer((req, res) => {
  const forwardedFor = req.headers['x-forwarded-for'] || 'Not set';
  const realIP = req.headers['x-real-ip'] || 'Not set';
  console.log(`Server ${port}: X-Forwarded-For: ${forwardedFor}, X-Real-IP: ${realIP}`);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`Hello from Node.js server on port ${port}! X-Forwarded-For: ${forwardedFor}, X-Real-IP: ${realIP}`);
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
