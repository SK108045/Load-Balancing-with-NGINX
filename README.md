# Load-Balancing-with-NGINX
## A comprehensive guide to setting up and configuring load balancers using NGINX.

This project demonstrates various load balancing techniques using Nginx and Node.js servers.
## Table of Contents

1. [Round Robin Load Balancing](#round-robin-load-balancing)
2. [Least Connections Load Balancing](#least-connections-load-balancing)
3. [IP Hash Load Balancing](#ip-hash-load-balancing)
4. [Weighted Round Robin Load Balancing](#weighted-round-robin-load-balancing)

## Round Robin Load Balancing

Round Robin is a simple and effective load balancing technique that distributes incoming requests equally among a group of servers in a circular order.


### Configuration

#### Nginx (nginx.conf)

```nginx:RoundRobbinLoadBalancing\nginx.conf
upstream nodejs_cluster {
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}

server {
    listen       8080;
    server_name  localhost;

    location / {
        proxy_pass http://nodejs_cluster;
        proxy_pass http://nodejs_cluster;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
#### Node.js Servers
We have three Node.js servers running on ports 3000, 3001, and 3002.

Server 1 (server1.js):
```javascript

const http = require('http');
const port = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Node.js server 1!');
});

server.listen(port, () => {
  console.log(`Server 1 running on http://localhost:${port}`);
});
```
- Similar configurations exist for server2.js and server3.js, running on ports 3001 and 3002 respectively.
- Start the node js servers ```node server1.js  ``` ,```node server2.js  1```, ```node server3.js```
- Open your web browser and navigate to http://localhost:8080. Refresh the page multiple times. You should see the response cycling through the 
  three server messages, demonstrating the Round Robin load balancing in action.
