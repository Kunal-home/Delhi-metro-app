import React, { useState, useEffect, useRef } from 'react';
import Style from "../css/noti.module.css";
function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null); // To hold any error messages
  const scrollRef = useRef(null); // Reference for scroll container

  // Fetch notifications when component mounts
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/notifications', {
          method: 'GET',
          credentials: 'include',  // Ensure credentials (cookies) are included
        });

        // If response is not OK (401 Unauthorized or other errors)
        if (!response.ok) {
          if (response.status === 401) {
            setError('You are not authorized. Please log in.');
          } else {
            setError('Failed to fetch notifications.');
          }
          return;
        }

        // Parse the response JSON if successful
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('Error fetching notifications.');
      }
    };

    fetchNotifications();
  }, []);

  // Auto-scroll to the bottom of the notifications list
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [notifications]);

  return (
    <div>
      {error && <p>{error}</p>} {/* Display error message if any */}
      <div className={`${Style.container}`} >
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id}>
              {notification.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Notification;
