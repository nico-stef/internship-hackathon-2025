import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import GitHubReview from "./pages/GitHubReview.jsx";
import GitHubPRReview from "./pages/GitHubPRReview.jsx";
import { useState } from "react";

// Header component cu logout
function Header({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });

      setIsLoggedIn(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };


  return (
    <header
      style={{
        width: "100%",
        padding: "15px 30px",
        boxSizing: "border-box",
        backgroundColor: "#fff",
        color: "#000",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <h2 style={{ margin: 0, fontWeight: "bold" }}>Code Critic</h2>

        <button
          onClick={() => navigate("/")}
          style={{
            padding: "8px 15px",
            fontSize: "14px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#000",
            color: "#fff",
            fontWeight: "bold",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#000")}
        >
          Review whole repo
        </button>

        {/* Buton pentru Review PR */}
        <button
          style={{
            padding: "8px 15px",
            fontSize: "14px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#000",
            color: "#fff",
            fontWeight: "bold",
            transition: "all 0.3s",
          }}
          onClick={() => navigate("/review-pr")}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#000")}
        >
          Review PR
        </button>
      </div>

      <button
        onClick={handleLogout}
        style={{
          padding: "8px 15px",
          fontSize: "14px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          backgroundColor: "#000",
          color: "#fff",
          fontWeight: "bold",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#000")}
      >
        Logout
      </button>
    </header>

  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/" /> : <Login setIsLoggedIn={setIsLoggedIn} />
          }
        />
        <Route
          path="/review-pr"
          element={
            isLoggedIn ? (
              <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <Header setIsLoggedIn={setIsLoggedIn} />
                <div style={{ flex: 1 }}>
                  <GitHubPRReview />
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />


        <Route
          path="/"
          element={
            isLoggedIn ? (
              <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <Header setIsLoggedIn={setIsLoggedIn} />
                <div style={{ flex: 1 }}>
                  <GitHubReview />
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
