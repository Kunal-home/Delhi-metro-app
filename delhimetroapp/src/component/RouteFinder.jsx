import React, { useState, useEffect } from "react";
import RouteDisplay from "./RouteDisplay"; // Import RouteDisplay

// This component will fetch the route based on two station names
const RouteFinder = ({ from, to }) => {
  const [route, setRoute] = useState(null);
  const [fstations, setFStations] = useState([]); // Parsed station data
  const [loading, setLoading] = useState(false); // To track loading state
  const [error, setError] = useState(''); // Error message state

  // Fetch stations data
  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/data.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Aggregate stations from all lines
        const allStations = data.lines.flatMap((line) => line.station);
        setFStations(allStations);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stations:", error.message);
        setError('Failed to load station data');
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  // Fetch the route from the API
  useEffect(() => {
    if (from && to && fstations.length > 0) {
      const stationFrom = fstations.find((station) => station.name === from);
      const stationTo = fstations.find((station) => station.name === to);

      if (stationFrom && stationTo) {
        const fetchRoute = async () => {
          try {
            setLoading(true);
            const response = await fetch(
              `http://localhost:5000/api/route?start=${from}&end=${to}`
            );
            const routeData = await response.json();
            setRoute(routeData);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching route:", error);
            setError('Failed to fetch route data');
            setLoading(false);
          }
        };
        fetchRoute();
      } else {
        setError("Invalid stations selected.");
      }
    }
  }, [from, to, fstations]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Pass the route to the RouteDisplay component */}
      {route && <RouteDisplay route={route} />}
    </div>
  );
};

export default RouteFinder;
