const cities = {
  "New York": 0,
  "London": 1,
  "Paris": 2,
  "Dubai": 3,
  "Tokyo": 4
};

const cityNames = Object.keys(cities);

const flightGraph = [
  // NY   LDN  PAR  DXB  TKY
  [0,    500, 0,   900, 0],     // New York
  [0,    0,   200, 0,   800],   // London
  [0,    0,   0,   300, 400],   // Paris
  [0,    0,   0,   0,   600],   // Dubai
  [0,    0,   0,   0,   0],     // Tokyo
];

const INF = 1e9;

function dijkstra(graph, srcIndex) {
  const n = graph.length;
  const dist = Array(n).fill(INF);
  const visited = Array(n).fill(false);
  const parent = Array(n).fill(-1);
  dist[srcIndex] = 0;

  for (let i = 0; i < n - 1; i++) {
    let u = -1;
    for (let j = 0; j < n; j++) {
      if (!visited[j] && (u === -1 || dist[j] < dist[u])) {
        u = j;
      }
    }

    if (dist[u] === INF) break;
    visited[u] = true;

    for (let v = 0; v < n; v++) {
      if (graph[u][v] && dist[u] + graph[u][v] < dist[v]) {
        dist[v] = dist[u] + graph[u][v];
        parent[v] = u;
      }
    }
  }

  return { dist, parent };
}

function getPath(parent, targetIndex) {
  const path = [];
  while (targetIndex !== -1) {
    path.unshift(targetIndex);
    targetIndex = parent[targetIndex];
  }
  return path;
}

// Execute the algorithm
const source = "New York";
const destination = "Tokyo";
const srcIndex = cities[source];
const destIndex = cities[destination];

const result = dijkstra(flightGraph, srcIndex);
const path = getPath(result.parent, destIndex);

console.log(`Shortest path from ${source} to ${destination}:`);
console.log(path.map(idx => cityNames[idx]).join(" -> "));
console.log(`Cost: ${result.dist[destIndex]}`);
