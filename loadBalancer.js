const canvas = document.getElementById('loadBalancerCanvas');
const ctx = canvas.getContext('2d');

const loadBalancer = { x: 50, y: 200, width: 100, height: 100 };
const servers = [
  { x: 400, y: 50, width: 100, height: 100 },
  { x: 400, y: 175, width: 100, height: 100 },
  { x: 400, y: 300, width: 100, height: 100 }
];

let currentServer = 0;
let requestX = loadBalancer.x + loadBalancer.width;
let requestY = loadBalancer.y + loadBalancer.height / 2;

function drawLoadBalancer() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(loadBalancer.x, loadBalancer.y, loadBalancer.width, loadBalancer.height);
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText('LB', loadBalancer.x + 35, loadBalancer.y + 60);
}

function drawServers() {
  servers.forEach((server, index) => {
    ctx.fillStyle = 'green';
    ctx.fillRect(server.x, server.y, server.width, server.height);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`S${index + 1}`, server.x + 35, server.y + 60);
  });
}

function drawRequest() {
  ctx.beginPath();
  ctx.arc(requestX, requestY, 10, 0, Math.PI * 2);
  ctx.fillStyle = 'red';
  ctx.fill();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLoadBalancer();
  drawServers();
  drawRequest();

  if (requestX < servers[currentServer].x) {
    requestX += 5;
  } else {
    currentServer = (currentServer + 1) % servers.length;
    requestX = loadBalancer.x + loadBalancer.width;
    requestY = loadBalancer.y + loadBalancer.height / 2;
  }

  requestY += (servers[currentServer].y + servers[currentServer].height / 2 - requestY) * 0.1;

  requestAnimationFrame(animate);
}

animate();
