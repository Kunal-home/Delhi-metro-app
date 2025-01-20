const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Load metro data
let metroData;
try {
  metroData = JSON.parse(fs.readFileSync(path.join('../delhimetroapp', 'public', 'data.json'), 'utf8'));
} catch (error) {
  console.error('Error reading JSON file:', error);
  metroData = null;
}

// Normalize station names for consistent lookup
const normalizeStationName = (name) => name.trim().toLowerCase();

// Function to find the shortest route using BFS
const findShortestRoute = (start, end) => {
  if (!metroData || !metroData.lines) {
    return { error: 'Metro data is not loaded or is invalid.' };
  }

  const graph = {};

  // Build the graph from metro data
  metroData.lines.forEach((line) => {
    if (line.station) {
      line.station.forEach((station) => {
        const stationName = normalizeStationName(station.name);
        if (!graph[stationName]) {
          graph[stationName] = {
            line: line.name,
            linecolor: line.linecolor || 'gray',
            connections: [],
          };
        }
        station.connections.forEach((connection) => {
          const connectionName = normalizeStationName(connection);

          // Add bi-directional connections
          if (!graph[stationName].connections.some((conn) => conn.name === connectionName)) {
            graph[stationName].connections.push({
              name: connectionName,
              line: line.name,
              linecolor: line.linecolor || 'gray',
            });
          }

          if (!graph[connectionName]) {
            graph[connectionName] = {
              line: line.name,
              linecolor: line.linecolor || 'gray',
              connections: [],
            };
          }

          if (!graph[connectionName].connections.some((conn) => conn.name === stationName)) {
            graph[connectionName].connections.push({
              name: stationName,
              line: line.name,
              linecolor: line.linecolor || 'gray',
            });
          }
        });
      });
    }
  });

  // BFS implementation for shortest path
  const queue = [{ name: normalizeStationName(start), path: [] }];
  const visited = new Set();

  while (queue.length > 0) {
    const current = queue.shift();  // Get the first station in the queue
    const stationName = current.name;
    const path = current.path;

    if (stationName === normalizeStationName(end)) {
      return { route: path.concat({ name: stationName }) };  // Return the path once we reach the destination
    }

    if (!visited.has(stationName)) {
      visited.add(stationName);

      const neighbors = graph[stationName]?.connections || [];
      for (const neighbor of neighbors) {
        // Add the neighbor station to the queue with the current path
        queue.push({ name: neighbor.name, path: path.concat({ name: stationName, linecolor: neighbor.linecolor }) });
      }
    }
  }

  return { error: `No route found from "${start}" to "${end}".` };
};

// API route endpoint for shortest path
router.get('/route', (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ error: 'Start and end stations are required.' });
  }

  const result = findShortestRoute(start, end);

  if (result.error) {
    return res.status(404).json(result);
  }

  // Return the route as a response
  return res.json({ route: result.route });
});

module.exports = router;
