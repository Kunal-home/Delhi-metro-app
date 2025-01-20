import React, { useState, useEffect } from 'react';

const NewRoute = () => {
  const [metroData, setMetroData] = useState(null);
  const [startStation, setStartStation] = useState('');
  const [endStation, setEndStation] = useState('');
  const [route, setRoute] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mapping for line colors (example)
  const lineColors = {
    'Red Line': '#E4002B',   // Red Line
    'Yellow Line': '#FFBC00', // Yellow Line
    'Blue Line': '#003B73',   // Blue Line
    'Orange Line': '#FF6A00', // Orange Line
    'Magenta Line': '#9B4F96' // Magenta Line
  };

  // Normalize station names for consistent graph lookup
  const normalizeStationName = (name) => name.trim().toLowerCase();

  useEffect(() => {
    // Fetch the metro data from the JSON file
    fetch('/data.json')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched metro data:', data); // Debugging log
        setMetroData(data);
        setLoading(false); // Data loaded
      })
      .catch((error) => {
        console.error('Error fetching metro data:', error);
        setLoading(false);
      });
  }, []);

  // Function to find the shortest route using BFS
  const findShortestRoute = (start, end) => {
    if (!metroData || !metroData.lines) {
      console.error('Metro data is not loaded or is missing "lines".');
      return [];
    }

    const graph = {};

    // Build the graph
    metroData.lines.forEach((line) => {
      if (line.station) {
        line.station.forEach((station) => {
          const stationName = normalizeStationName(station.name);
          if (!graph[stationName]) {
            graph[stationName] = { line: line.name, connections: [] };
          }
          station.connections.forEach((connection) => {
            graph[stationName].connections.push(normalizeStationName(connection));
          });
        });
      }
    });

    console.log('Graph:', graph); // Debugging graph structure

    // BFS implementation for shortest path
    const queue = [[normalizeStationName(start)]];
    const visited = new Set();

    while (queue.length > 0) {
      const path = queue.shift();
      const station = path[path.length - 1];

      console.log(`Current path: ${path}`); // Log current path

      if (station === normalizeStationName(end)) {
        return path;
      }

      if (!visited.has(station)) {
        visited.add(station);
        const neighbors = graph[station]?.connections || [];
        for (const neighbor of neighbors) {
          queue.push([...path, neighbor]);
        }
      }
    }

    console.warn(`No route found from "${start}" to "${end}".`); // Log if no route is found
    return [];
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!metroData) {
      console.error('Metro data is not loaded');
      return;
    }

    const start = normalizeStationName(startStation);
    const end = normalizeStationName(endStation);

    // Check if stations are valid
    const isStartValid = metroData.lines.some((line) =>
      line.station.some((station) => normalizeStationName(station.name) === start)
    );

    const isEndValid = metroData.lines.some((line) =>
      line.station.some((station) => normalizeStationName(station.name) === end)
    );

    if (!isStartValid) {
      alert(`Invalid Start Station: "${startStation}"`);
      return;
    }

    if (!isEndValid) {
      alert(`Invalid End Station: "${endStation}"`);
      return;
    }

    // Find and set the route
    const foundRoute = findShortestRoute(start, end); // Use normalized names
    if (foundRoute.length === 0) {
      alert(`No route found from "${startStation}" to "${endStation}".`);
    } else {
      setRoute(foundRoute);
    }
  };

  // Function to get the color of the line based on the station's line
  const getLineColor = (stationName) => {
    let lineColor = '#000'; // Default color (black)
    metroData.lines.forEach((line) => {
      line.station.forEach((station) => {
        if (normalizeStationName(station.name) === normalizeStationName(stationName)) {
          lineColor = lineColors[line.name] || '#000'; // Get the line color or default
        }
      });
    });
    return lineColor;
  };

  return (
    <div>
      <h1>Metro Route Finder</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Start Station:
            <input
              type="text"
              value={startStation}
              onChange={(e) => setStartStation(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            End Station:
            <input
              type="text"
              value={endStation}
              onChange={(e) => setEndStation(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Find Route</button>
      </form>

      {route.length > 0 && (
        <div>
          <h2>Shortest Route:</h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {route.map((station, index) => (
              <li
                key={index}
                style={{
                  color: getLineColor(station), // Apply line color
                  fontWeight: 'bold',
                  margin: '5px 0',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {station.charAt(0).toUpperCase() + station.slice(1)}
                {index < route.length - 1 && (
                  <span
                    style={{
                      marginLeft: '5px',
                      color: '#000',
                      fontSize: '18px', // Make the arrow size bigger
                    }}
                  >
                    ↓
                  </span> // Down arrow
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NewRoute;
