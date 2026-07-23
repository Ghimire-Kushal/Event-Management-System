import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Register from "./Register";
import Login from "./Login";

function App() {
  const [events, setEvents] = useState([]);
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  // Fetch data
  useEffect(() => {
    // Fetch Events
    axios
      .get("http://127.0.0.1:8000/api/events/list/")
      .then((res) => setEvents(res.data))
      .catch((err) => console.log(err));

    const token = localStorage.getItem("token");

    if (token) {
      // Fetch Logged-in User
      axios
        .get("http://127.0.0.1:8000/api/users/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setUserData(res.data))
        .catch((err) => console.log(err));

      // Fetch Notifications
      axios
        .get("http://127.0.0.1:8000/api/notifications/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setNotifications(res.data))
        .catch((err) => console.log(err));
    }
  }, [isLoggedIn]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserData(null);
    setNotifications([]);
  };

  // Register for Event
  const handleRegisterForEvent = async (eventId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first!");
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/events/register-signup/${eventId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
    } catch (err) {
      const errorMsg = err.response
        ? err.response.data.error || err.response.data.message
        : "Something went wrong";

      alert("Failed: " + errorMsg);
    }
  };

  return (
    <div className="App">
      <header
        className="header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 50px",
        }}
      >
        <h1>Apollo Events</h1>

        {isLoggedIn && (
          <button
            className="btn"
            onClick={handleLogout}
            style={{
              width: "120px",
              backgroundColor: "#cc0000",
            }}
          >
            Logout
          </button>
        )}
      </header>

      <div className="container">
        {!isLoggedIn ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <Login onLoginSuccess={() => setIsLoggedIn(true)} />
            <Register />
          </div>
        ) : (
          <main>
            {/* Dashboard Cards */}
            <div
              style={{
                display: "flex",
                gap: "20px",
                marginBottom: "30px",
              }}
            >
              {/* Points */}
              <div
                className="event-card"
                style={{
                  flex: 1,
                  textAlign: "center",
                  background: "#003366",
                  color: "#fff",
                }}
              >
                <h3>My Total Points</h3>

                <h1
                  style={{
                    fontSize: "3rem",
                    marginTop: "15px",
                  }}
                >
                  {userData?.total_points || 0}
                </h1>
              </div>

              {/* Notifications */}
              <div
                className="event-card"
                style={{
                  flex: 2,
                  maxHeight: "220px",
                  overflowY: "auto",
                }}
              >
                <h3>Recent Notifications</h3>

                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        borderBottom: "1px solid #ddd",
                        padding: "10px 0",
                      }}
                    >
                      <strong>{n.notification_type}</strong>

                      <br />

                      {n.message}
                    </div>
                  ))
                ) : (
                  <p>No notifications available.</p>
                )}
              </div>
            </div>

            {/* Event Section */}
            <h2>Upcoming Events</h2>

            <div className="event-grid">
              {events.map((event) => (
                <div key={event.id} className="event-card">
                  <h3>{event.title}</h3>

                  <p>{event.description}</p>

                  <div
                    style={{
                      display: "inline-block",
                      background: "#28a745",
                      color: "#fff",
                      padding: "8px 15px",
                      borderRadius: "20px",
                      fontWeight: "bold",
                      marginBottom: "15px",
                    }}
                  >
                    {event.points_to_allocate} Points Available
                  </div>

                  <br />

                  <button
                    className="btn"
                    onClick={() => handleRegisterForEvent(event.id)}
                  >
                    Register for Event
                  </button>
                </div>
              ))}
            </div>
          </main>
        )}
      </div>
    </div>
  );
}

export default App;