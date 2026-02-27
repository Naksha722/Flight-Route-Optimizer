class Graph {
  constructor() {
    this.edges = new Map();
  }

  addVertex(vertex) {
    if (!this.edges.has(vertex)) {
      this.edges.set(vertex, []);
    }
  }

  addEdge(source, destination, cost) {
    this.addVertex(source);
    this.addVertex(destination);
    this.edges.get(source).push({ city: destination, cost: cost });
  }
}

function initializeGraph() {
  const graph = new Graph();

  // Flight data: Source, Destination, Cost
  const flights = [
    ["New York", "London", 300],
    ["New York", "Paris", 500],
    ["New York", "Tokyo", 900],
    ["London", "Paris", 150],
    ["London", "Dubai", 400],
    ["Paris", "Dubai", 450],
    ["Paris", "Rome", 100],
    ["Tokyo", "Singapore", 300],
    ["Tokyo", "Sydney", 700],
    ["Dubai", "Singapore", 350],
    ["Singapore", "Sydney", 400],
    ["Rome", "Dubai", 300],
    ["New York", "Chicago", 100],
    ["Chicago", "London", 400],
    ["Chicago", "Los Angeles", 200],
    ["Los Angeles", "Tokyo", 600],
    ["Los Angeles", "Sydney", 800],
    ["Sydney", "Auckland", 150],
    ["Auckland", "Tokyo", 500],
    ["Rome", "London", 120],
    ["Paris", "New York", 480]
  ];

  flights.forEach(flight => {
    graph.addEdge(flight[0], flight[1], flight[2]);
  });

  return graph;
}

function showError(message) {
  const output = document.getElementById("output");
  if (!output) return;
  output.innerHTML = `<div class="text-red-600 font-semibold">${message}</div>`;
}

window.onerror = function (_message, _source, _lineno, _colno, error) {
  showError(`Error: ${error?.message || _message}`);
};

window.onunhandledrejection = function (event) {
  const reason = event?.reason;
  showError(`Error: ${reason?.message || reason}`);
};

function findRoute() {
  const output = document.getElementById("output");
  try {
    const source = normalizeCityName(document.getElementById("source").value.trim());
    const destination = normalizeCityName(document.getElementById("destination").value.trim());

    if (!source || !destination) {
      output.innerHTML = `<div class="text-red-600 font-semibold">Please enter both source and destination cities.</div>`;
      return;
    }

    const graph = initializeGraph();
    const routes = findAllRoutes(graph, source, destination, 3);

    if (routes.length === 0) {
      output.innerHTML = `<div class="text-yellow-600 font-semibold">No route found from ${source} to ${destination}.</div>`;
      return;
    }

    displayRoutes(routes, source, destination);
  } catch (err) {
    output.innerHTML = `<div class="text-red-600 font-semibold">Error: ${err?.message || err}</div>`;
    throw err;
  }
}

function normalizeCityName(name) {
  return name
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function findAllRoutes(graph, start, end, maxRoutes) {
  const routes = [];
  const visited = new Set();
  
  function dfs(current, path, cost, depth) {
    if (depth > 4) return; // Limit layovers to avoid infinite loops
    
    if (current === end) {
      routes.push({
        path: [...path],
        cost: cost,
        layovers: path.length - 2
      });
      return;
    }
    
    if (visited.has(current)) return;
    visited.add(current);
    
    const neighbors = graph.edges.get(current) || [];
    for (const neighbor of neighbors) {
      dfs(neighbor.city, [...path, neighbor.city], cost + neighbor.cost, depth + 1);
      if (routes.length >= maxRoutes) break;
    }
    
    visited.delete(current);
  }
  
  dfs(start, [start], 0, 0);
  
  // Sort by cost and then by number of layovers
  routes.sort((a, b) => {
    if (a.cost !== b.cost) return a.cost - b.cost;
    return a.layovers - b.layovers;
  });
  
  return routes.slice(0, maxRoutes);
}

function displayRoutes(routes, source, destination) {
  const output = document.getElementById("output");
  
  let html = `
    <div class="text-2xl font-bold text-blue-700 text-center mb-6">
      Available Routes from ${source} to ${destination}
    </div>
  `;
  
  routes.forEach((route, index) => {
    const layoverText = route.layovers === 0 ? "Direct Flight" : 
                       route.layovers === 1 ? "1 Layover" : 
                       `${route.layovers} Layovers`;
    
    const routeSteps = route.path.map((city, idx) => {
      if (idx === 0) return `<div class="text-center font-semibold">${city}</div>`;
      if (idx === route.path.length - 1) return `<div class="text-center font-semibold">${city}</div>`;
      return `<div class="text-center text-gray-600">${city}</div>`;
    }).join(`<div class="text-center text-gray-400">✈️</div>`);
    
    html += `
      <div class="bg-white p-6 rounded-xl shadow-lg mb-4 border-l-4 ${index === 0 ? 'border-green-500' : 'border-blue-300'}">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold ${index === 0 ? 'text-green-600' : 'text-blue-600'}">
            ${index === 0 ? '⭐ Best Option' : `Option ${index + 1}`}
          </h3>
          <span class="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
            ${layoverText}
          </span>
        </div>
        
        <div class="flex flex-col items-center mb-4">
          ${routeSteps}
        </div>
        
        <div class="flex justify-between items-center">
          <div class="text-xl font-bold text-green-600">
            Total Cost: $${route.cost}
          </div>
          <div class="text-sm text-gray-500">
            ${route.path.length - 1} ${route.path.length - 1 === 1 ? 'flight' : 'flights'}
            (${route.path.join(' \u2192 ')})
          </div>
        </div>
      </div>
    `;
  });
  
  output.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("findRouteBtn");
  if (btn) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      findRoute();
    });
  }

  const sourceInput = document.getElementById("source");
  const destInput = document.getElementById("destination");
  [sourceInput, destInput].forEach((el) => {
    if (!el) return;
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        findRoute();
      }
    });
  });
});

