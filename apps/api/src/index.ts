import * as http from 'http';

// Railway dynamically sets process.env.PORT during deploy
// If running locally, we fallback to 3001
const port = process.env.PORT || 3001;

const server = http.createServer((req, res) => {
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', message: 'BIFFCO API Skeleton is alive for Railway checks!' }));
    return;
  }
  
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint Not found in Phase 0 API' }));
});

server.listen(port, () => {
  console.log(`[BIFFCO] API Skeleton successfully booted on port ${port}`);
});
