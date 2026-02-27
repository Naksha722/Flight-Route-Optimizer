// Graph data structure for flight routes
class FlightGraph {
    constructor() {
        this.nodes = new Map();
        this.edges = new Map();
    }

    addNode(city) {
        if (!this.nodes.has(city)) {
            this.nodes.set(city, []);
        }
    }

    addEdge(from, to, cost) {
        this.addNode(from);
        this.addNode(to);
        
        if (!this.edges.has(from)) {
            this.edges.set(from, []);
        }
        
        this.edges.get(from).push({ city: to, cost: cost });
    }

    findCheapestRoute(start, end) {
        const distances = new Map();
        const previous = new Map();
        const unvisited = new Set();
        
        // Initialize distances
        for (const city of this.nodes.keys()) {
            distances.set(city, city === start ? 0 : Infinity);
            unvisited.add(city);
        }
        
        while (unvisited.size > 0) {
            // Find unvisited node with minimum distance
            let current = null;
            let minDistance = Infinity;
            
            for (const city of unvisited) {
                if (distances.get(city) < minDistance) {
                    current = city;
                    minDistance = distances.get(city);
                }
            }
            
            if (current === null || current === end) break;
            
            unvisited.delete(current);
            
            // Update distances to neighbors
            const neighbors = this.edges.get(current) || [];
            for (const neighbor of neighbors) {
                const altDistance = distances.get(current) + neighbor.cost;
                if (altDistance < distances.get(neighbor.city)) {
                    distances.set(neighbor.city, altDistance);
                    previous.set(neighbor.city, current);
                }
            }
        }
        
        // Reconstruct path
        if (distances.get(end) === Infinity) {
            return { path: [], cost: Infinity };
        }
        
        const path = [];
        let current = end;
        while (current !== undefined) {
            path.unshift(current);
            current = previous.get(current);
        }
        
        return { path, cost: distances.get(end) };
    }
}

// Sample flight data
const flightData = {
    'New York': [
        { city: 'London', cost: 400 },
        { city: 'Paris', cost: 450 },
        { city: 'Chicago', cost: 200 }
    ],
    'London': [
        { city: 'Paris', cost: 100 },
        { city: 'Dubai', cost: 300 },
        { city: 'Tokyo', cost: 500 }
    ],
    'Paris': [
        { city: 'Dubai', cost: 350 },
        { city: 'Tokyo', cost: 550 },
        { city: 'Rome', cost: 150 }
    ],
    'Dubai': [
        { city: 'Tokyo', cost: 400 },
        { city: 'Singapore', cost: 250 },
        { city: 'Mumbai', cost: 200 }
    ],
    'Tokyo': [
        { city: 'Singapore', cost: 300 },
        { city: 'Sydney', cost: 450 }
    ],
    'Chicago': [
        { city: 'Los Angeles', cost: 250 },
        { city: 'Denver', cost: 150 }
    ],
    'Los Angeles': [
        { city: 'San Francisco', cost: 100 },
        { city: 'Tokyo', cost: 600 }
    ],
    'Singapore': [
        { city: 'Sydney', cost: 350 },
        { city: 'Mumbai', cost: 280 }
    ],
    'Rome': [
        { city: 'Athens', cost: 120 },
        { city: 'Barcelona', cost: 180 }
    ]
};

// Initialize graph with flight data
function initializeGraph() {
    const graph = new FlightGraph();
    
    for (const [from, destinations] of Object.entries(flightData)) {
        for (const destination of destinations) {
            graph.addEdge(from, destination.city, destination.cost);
        }
    }
    
    return graph;
}
