import React, { useState } from 'react';
import axios from 'axios';

const AddStationForm = () => {
  const [lineName, setLineName] = useState('');
  const [stationName, setStationName] = useState('');
  const [connections, setConnections] = useState('');
  const [index, setIndex] = useState('');
  const [interchange, setInterchange] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim inputs to remove any leading/trailing spaces
    const trimmedLineName = lineName.trim();
    const trimmedStationName = stationName.trim();
    const trimmedConnections = connections.trim();
    const trimmedInterchange = interchange.trim();

    // Validate input fields
    if (!trimmedLineName || !trimmedStationName || !trimmedConnections || !index) {
      return setError('All fields are required.');
    }

    // Ensure index is a valid number
    if (isNaN(index) || parseInt(index) <= 0) {
      return setError('Please enter a valid index number.');
    }

    // Prepare the request body
    const stationData = {
      lineName: trimmedLineName,
      stationName: trimmedStationName,
      connections: trimmedConnections.split(',').map(conn => conn.trim()),
      index: parseInt(index),
      interchange: trimmedInterchange ? trimmedInterchange.split(',').map(line => line.trim()) : [],
    };

    setLoading(true); // Show loading state
    setError(''); // Reset error before submission

    try {
      const response = await axios.post('http://localhost:5000/api/add-station', stationData);
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while adding the station.');
      setMessage('');
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="container" style={{padding:'20px 20px', textAlign:'center',width:'50%',margin:'auto',}}>
      <div>
      <h2>Add New Station</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Line Name</label>
          <input
            type="text"
            value={lineName}
            onChange={(e) => setLineName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Station Name</label>
          <input
            type="text"
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Connections (comma separated)</label>
          <input
            type="text"
            value={connections}
            onChange={(e) => setConnections(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Index</label>
          <input
            type="number"
            value={index}
            onChange={(e) => setIndex(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Interchange Lines (comma separated, optional)</label>
          <input
            type="text"
            value={interchange}
            onChange={(e) => setInterchange(e.target.value)}
          />
        </div>
        <button style={{ border:'2px solid red',textAlign:'center',}} className="btn btn-light" type="submit" disabled={loading}>
          {loading ? 'Adding Station...' : 'Add Station'}
        </button>
      </form>
      </div>
      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}
    </div>
  );
};

export default AddStationForm;
