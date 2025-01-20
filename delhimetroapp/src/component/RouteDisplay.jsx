import React from "react";

// This component will display the route passed from the RouteFinder
const RouteDisplay = ({ route }) => {
  if (!route || !route.route) {
    return <p>No route found.</p>;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Route Details</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {route.route.map((station, index) => (
          <li
            key={index}
            style={{
              color: station.linecolor || "white", // Use the linecolor or default to white
              fontWeight: "bold",
            }}
          >
            {station.name}
            <br />
            {index !== route.route.length - 1 && <span>⬇</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RouteDisplay;
