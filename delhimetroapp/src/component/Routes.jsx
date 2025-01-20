import React, { useState ,useEffect} from "react";
import RouteFinder from "./RouteFinder"; // Import RouteFinder
import Style from "../css/Routes.module.css";

// Dropdown for selecting stations
const Dropdown = ({ stations, selectedValue, onChange }) => (
  <select value={selectedValue} onChange={onChange}>
    <option value="">Select a station</option>
    {stations.map((station, index) => (
      <option key={index} value={station.name}>
        {station.name}
      </option>
    ))}
  </select>
);

function Routes() {
  const [stations, setStations] = useState([]); // For dropdown station names
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fstations, setFStations] = useState([]); // Parsed station data

  // Fetch station data
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch("/data.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Aggregate stations from all lines
        const allStations = data.lines.flatMap((line) => line.station);
        setStations(allStations.map((station) => station.name));
        setFStations(allStations);
      } catch (error) {
        console.error("Error fetching stations:", error.message);
      }
    };

    fetchStations();
  }, []);

  return (
    <div className={`${Style.container}`}>
      <h1 className={`${Style.h1}`}>Find the Routes</h1>
      <form className={`${Style.form}`}>
        <label htmlFor="from">From:</label><br />
        <Dropdown
          stations={fstations}
          selectedValue={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <br />
        <label htmlFor="to">To:</label><br />
        <Dropdown
          stations={fstations}
          selectedValue={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <br />
      </form>

      {/* Pass 'from' and 'to' stations as props to RouteFinder */}
      <RouteFinder from={from} to={to} />
    </div>
  );
}

export default Routes;
