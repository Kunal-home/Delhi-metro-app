import React, { useState, useEffect } from 'react';
import Style from "../css/fare.module.css";
import RouteFinder from './RouteFinder';

function Fare() {
  const [stations, setStations] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [error, setError] = useState('');
  const [fare, setFare] = useState(null);
  const [fareRates, setFareRates] = useState([]); // Store fare rates
  const [showRoute, setShowRoute] = useState(false);

  // Fetch station data and fare rates
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch("/data.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const allStations = data.lines.flatMap((line) => line.station);
        setStations(allStations.map((station) => station.name));
      } catch (error) {
        console.error("Error fetching stations:", error.message);
        setError('Error loading stations. Please try again.');
      }
    };

    const fetchFareRates = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/fare-rates");
        const data = await response.json();
        console.log('Fetched Fare Rates:', data); // Log fetched fare rates
        setFareRates(data); // Assuming the response is an array of fare rates
      } catch (error) {
        console.error("Error fetching fare rates:", error.message);
        setError('Error loading fare rates. Please try again.');
      }
    };

    fetchStations();
    fetchFareRates();
  }, []);

  // Calculate fare using dynamic rates
  const calculateFare = (distanceInKm) => {
    console.log('Calculating fare for distance:', distanceInKm); // Debug distance
    if (!fareRates.length) {
      console.error('Fare rates are not loaded.');
      return null;
    }

    for (let rate of fareRates) {
      console.log(`Checking rate: ${rate.maxDistance} vs ${distanceInKm}`);
      if (distanceInKm <= rate.maxDistance) {
        return rate.fare;
      }
    }
    console.log('No fare rate matched for this distance.');
    return null; // Return null if no fare is found
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!from || !to) {
      setError('Both origin and destination are required');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/distance?origin=${encodeURIComponent(
          `${from} delhi`
        )}&destination=${encodeURIComponent(`${to} delhi`)}`
      );
      const data = await response.json();

      if (data.status === 'OK') {
        const { distance, duration } = data.rows[0].elements[0];
        const distanceInKm = parseFloat(distance.text.replace(/[^\d.-]/g, ''));
        console.log('Parsed Distance:', distanceInKm); // Debugging parsed distance value
        setDistance(distance.text);
        setDuration(duration.text);
        const calculatedFare = calculateFare(distanceInKm);
        if (calculatedFare !== null) {
          setFare(calculatedFare);
        } else {
          setFare('Not available');
        }
        setError('');
        setShowRoute(true);
      } else {
        setError('Unable to fetch distance. Please try again.');
        setDistance(null);
        setDuration(null);
        setFare(null);
      }
    } catch (err) {
      setError('Error fetching distance');
      console.error(err);
    }
  };

  return (
    <>
      <h1 className={`${Style.h1}`}>Find Distance, Fare, and Route Between Stations</h1>

      <div className={`${Style.container}`}>
        <form onSubmit={handleSubmit} className={`${Style.form}`}>
          <label>
            From:<br />
            <select value={from} onChange={(e) => setFrom(e.target.value)}>
              <option value="">Select a station</option>
              {stations.map((station, index) => (
                <option key={index} value={station}>
                  {station}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            To:<br />
            <select value={to} onChange={(e) => setTo(e.target.value)}>
              <option value="">Select a station</option>
              {stations.map((station, index) => (
                <option key={index} value={station}>
                  {station}
                </option>
              ))}
            </select>
          </label>
          <br />
          <button type="submit" className={`${Style.bt} btn btn-light`}>
            Calculate Fare
          </button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {distance && (
          <div>
            
            <p><strong>Duration:</strong> {duration}</p>
            <p><strong>Fare:</strong> Rs {fare}</p>
            <p><strong>Smart Card Fare:</strong> Rs {fare - (fare / 10)}</p>
          </div>
        )}
      </div>

      {showRoute && from && to && (
        <div className={`${Style.routeshow}`}>
          <RouteFinder from={from} to={to} />
        </div>
      )}
    </>
  );
}

export default Fare;
