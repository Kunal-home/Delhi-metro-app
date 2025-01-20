import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState('');
  const navigate = useNavigate(); // For programmatic navigation

  // Check if the user is logged in by checking session
  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch('http://localhost:5000/api/check-session', {
        method: 'GET',
        credentials: 'include', // Send cookies to check session
      });

      if (!response.ok) {
        navigate('/admin-login'); // Redirect to login if not authenticated
      } else {
        fetchNotifications(); // Fetch notifications if logged in
      }
    };

    checkSession();
  }, [navigate]);

  // Fetch notifications from the backend
  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notifications', {
        method: 'GET',
        credentials: 'include', // Send cookies to verify session
      });

      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Add a new notification
  const addNotification = async () => {
    if (!newNotification.trim()) {
      alert('Please enter a message');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newNotification }),
        credentials: 'include', // Send cookies to verify session
      });

      if (response.ok) {
        fetchNotifications(); // Reload notifications after adding a new one
        setNewNotification('');
      } else {
        alert('Error adding notification');
      }
    } catch (error) {
      alert('An error occurred while adding the notification');
    }
  };

  // Delete a notification
  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: 'DELETE',
        credentials: 'include', // Send cookies to verify session
      });

      if (response.ok) {
        fetchNotifications(); // Reload notifications after deleting one
      } else {
        alert('Error deleting notification');
      }
    } catch (error) {
      alert('An error occurred while deleting the notification');
    }
  };

  // Handle logout
  const handleLogout = () => {
    fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      credentials: 'include', // Send cookies for logout
    })
      .then(() => {
        navigate('/admin-login'); // Redirect to login page after logging out
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  };

  // Navigate to Update Fare Manager
  const navigateToUpdateFare = () => {
    navigate('/admin-fare-manager');
  };
 const navigateToaddstation=()=>{
  navigate('/addstation')
 }
  return (
    <div
      style={{
        border: '2px solid white',
        borderRadius: '10px',
        padding: '40px 20px',
        width: '50%',
        margin: 'auto',
        textAlign: 'center',
      }}
    >
      <h1>Admin Dashboard</h1>

      {/* Add Notification */}
      <div style={{ textAlign: 'center' }}>
        <input
          type="text"
          value={newNotification}
          onChange={(e) => setNewNotification(e.target.value)}
          placeholder="Add new notification"
        />
        <button
          onClick={addNotification}
          style={{ margin: '10px 10px' }}
          className="btn btn-light"
        >
          Add Notification
        </button>
      </div>

      {/* Notifications List */}
      <ul style={{ listStyleType: 'none' }}>
        {notifications.map((notification) => (
          <li key={notification.id}>
            {notification.message}
            <button
              onClick={() => deleteNotification(notification.id)}
              style={{ margin: '10px 10px' }}
              className="btn btn-light"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>


      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{ marginBottom: '20px' }}
        className="btn btn-light"
      >
        Logout
      </button>
      <br></br>
      {/* Update Fare Button */}
      <button
        onClick={navigateToUpdateFare}
        style={{ margin: '20px 10px' }}
        className="btn btn-light"
      >
        Update Fare
      </button>
      <br></br>
      <button
        onClick={navigateToaddstation}
        style={{ margin: '20px 10px' }}
        className="btn btn-light"
      >
        Add Station
      </button>
    </div>
  );
}

export default AdminDashboard;
