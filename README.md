# Load-Balancing-with-NGINX
## A comprehensive guide to setting up and configuring load balancers using NGINX and Node.js servers.

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

```nginx
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

## Least Connections Load Balancing
Least Connections is a dynamic load balancing algorithm that directs traffic to the server with the fewest active connections.
### Configuration

#### Nginx (nginx.conf)

```nginx
upstream nodejs_cluster {
    least_conn;
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}

server {
    listen       8080;
    server_name  localhost;

    location / {
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

##### 1. Server 1 (server1.js):
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

##### 2. Server 2 (server2.js):
```javascript
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
```

Server 3 (server3.js) is similar to server1.js but runs on port 3002.

- Start the node js servers ```node server1.js  ``` ,```node server2.js  1```, ```node server3.js```
- Open your web browser and navigate to http://localhost:8080. Refresh the page multiple times. You should observe that server2 receives fewer 
  requests due to its longer response time, demonstrating the Least Connections load balancing in action.
  
## IP Hash Load Balancing

IP Hash is a load balancing method that uses the client's IP address to determine which server should receive the request. This ensures that requests from the same client always go to the same server, which can be useful for maintaining session consistency.

### Configuration

#### Nginx (nginx.conf)

```nginx
upstream nodejs_cluster {
    hash $http_x_forwarded_for consistent;
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    listen 8080;
    server_name localhost;

    location / {
        proxy_pass http://nodejs_cluster;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $http_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
}
```
#### Node.js Servers
We have three Node.js servers running on ports 3000, 3001, and 3002.

##### 1. Server 1 (server1.js):

```javascript
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
```
Similar configurations exist for server2.js and server3.js, running on ports 3001 and 3002 respectively.

##### 2. Test script
```powershell
$ips = @("192.168.1.1", "192.168.1.2", "192.168.1.3", "192.168.1.4", "192.168.1.5")
foreach ($ip in $ips) {
    $random = Get-Random -Minimum 1 -Maximum 255
    $testIP = "192.168.$random.$random"
    Write-Host "Testing with IP: $testIP"
    curl.exe --resolve localhost:8080:127.0.0.1 -H "X-Forwarded-For: $testIP" http://localhost:8080
    Write-Host "`n"
}
```
- Start the node js servers ```node server1.js  ``` ,```node server2.js  1```, ```node server3.js```
- Ensure Nginx is running with the provided configuration and run the Powershell script ```.\test_ip_hash.ps1```
- You should see and output similar to this

Test Run 1:
-----------
```bash
Testing with IP: 192.168.240.240
Hello from Node.js server on port 3002! X-Forwarded-For: 192.168.240.240, X-Real-IP: 127.0.0.1

Testing with IP: 192.168.142.142
Hello from Node.js server on port 3000! X-Forwarded-For: 192.168.142.142, X-Real-IP: 127.0.0.1

Testing with IP: 192.168.140.140
Hello from Node.js server on port 3000! X-Forwarded-For: 192.168.140.140, X-Real-IP: 127.0.0.1

Testing with IP: 192.168.212.212
Hello from Node.js server on port 3002! X-Forwarded-For: 192.168.212.212, X-Real-IP: 127.0.0.1

Testing with IP: 192.168.17.17
Hello from Node.js server on port 3000! X-Forwarded-For: 192.168.17.17, X-Real-IP: 127.0.0.1
```
Test Run 2:
-----------
```bash
Testing with IP: 192.168.23.23
Hello from Node.js server on port 3001! X-Forwarded-For: 192.168.23.23, X-Real-IP: 127.0.0.1

Testing with IP: 192.168.182.182
Hello from Node.js server on port 3002! X-Forwarded-For: 192.168.182.182, X-Real-IP: 127.0.0.1

Testing with IP: 192.168.100.100
Hello from Node.js server on port 3002! X-Forwarded-For: 192.168.100.100, X-Real-IP: 127.0.0.1

Testing with IP: 192.168.243.243
Hello from Node.js server on port 3001! X-Forwarded-For: 192.168.243.243, X-Real-IP: 127.0.0.1

Testing with IP: 192.168.146.146
Hello from Node.js server on port 3001! X-Forwarded-For: 192.168.146.146, X-Real-IP: 127.0.0.1
```
- This distribution confirms that the IP Hash load balancing is functioning as intended. Each unique IP address is consistently routed to the same server, while different IPs are distributed among the available servers. This approach ensures session persistence while still achieving load distribution across the server pool.

## Weighted Round Robin Load Balancing

Weighted Round Robin is a load balancing algorithm that distributes incoming requests across multiple servers based on their assigned weights. Servers with higher weights receive more requests proportionally.

### Configuration

#### Nginx (nginx.conf)

```nginx
upstream backend {
    server 127.0.0.1:3000 weight=3;
    server 127.0.0.1:3001 weight=2;
    server 127.0.0.1:3002 weight=1;
}

server {
    listen 8080;
    server_name localhost;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
#### Node.js Servers
We have three Node.js servers running on ports 3000, 3001, and 3002.


##### 1. Server 1 (server1.js):
```javascript
const http = require('http');
const port = 3000;

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

```
Similar configurations exist for server2.js and server3.js, running on ports 3001 and 3002 respectively.

##### 2. Test Script (weighted_round_robin.ps1)
```powershell
$totalRequests = 60

for ($i = 1; $i -le $totalRequests; $i++) {
    Write-Host "Request $i"
    curl.exe http://localhost:8080
    Write-Host "`n"
}
```
- Start the node js servers ```node server1.js  ``` ,```node server2.js  1```, ```node server3.js```.
- Ensure Nginx is running with the provided configuration and run the Powershell script ```.\weighted_round_robin.ps1```
#### Analysis
You'll observe that the requests are distributed in this manner 
```powerhell
===========
 OUTPUT
==========
Server 1 (weight 3): 30 requests (50% of total)
Server 2 (weight 2): 20 requests (33.33% of total)
Server 3 (weight 1): 10 requests (16.67% of total)
```
