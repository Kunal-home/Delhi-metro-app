import React, { useEffect, useState } from "react";

const AdminFareManager = () => {
  const [fareRates, setFareRates] = useState([]);
  const [error, setError] = useState(null);

  // Fetch fare rates from the API
  useEffect(() => {
    const fetchFareRates = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/fare-rates");
        if (!response.ok) {
          throw new Error("Failed to fetch fare rates");
        }
        const data = await response.json();
        setFareRates(data.rates || data); // If the response contains `rates` or direct array
      } catch (err) {
        setError(err.message);
        console.error(err);
      }
    };

    fetchFareRates();
  }, []);

  // Handle fare rate change
  const handleFareChange = (id, fare) => {
    setFareRates(prevRates =>
      prevRates.map(rate =>
        rate.id === id ? { ...rate, fare: parseFloat(fare) } : rate
      )
    );
  };

  // Update fare rates in the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/fare-rates", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rates: fareRates }),
      });

      if (!response.ok) {
        throw new Error("Failed to update fare rates");
      }

      const data = await response.json();
      if (data.message) {
        alert("Fare rates updated successfully!");
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  // Render loading, error, or data
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!fareRates.length) {
    return <div>Loading...</div>;
  }

  return (
    <div >
      <h2 style={{textAlign:'center' }}>Fare Rates</h2>
      <div style={{ 
      textAlign:'center',
      width:'50%',
      margin:'auto'
    }}>
      <form onSubmit={handleSubmit}  >
        <table style={{ 
      width:'50%',
      margin:'auto'
    }} >
          <thead>
            <tr>
              <th>ID</th>
              <th>Max Distance</th>
              <th>Fare</th>
            </tr>
          </thead>
          <tbody>
            {fareRates.map((rate) => (
              <tr key={rate.id}>
                <td>{rate.id}</td>
                <td>{rate.maxDistance}</td>
                <td>
                  <input
                    type="number"
                    value={rate.fare}
                    onChange={(e) => handleFareChange(rate.id, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button  style={{ margin:"10px 10px"}}type="submit" className='btn btn-light'>Update Fare Rates</button>
      </form>
      </div>
    </div>
  );
};

export default AdminFareManager;
