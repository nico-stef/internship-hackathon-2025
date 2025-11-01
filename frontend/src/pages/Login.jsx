import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include"
            });

            const data = await res.json();

            if (res.ok) {
                setIsLoggedIn(true);
                navigate("/");
            } else {
                setMessage(data.message || "Invalid credentials.");
            }
        } catch (err) {
            console.error(err);
            setMessage("Error logging in.");
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                padding: "20px",
            }}
        >
            <form
                onSubmit={handleLogin}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    width: "350px",
                    padding: "30px",
                    borderRadius: "12px",
                    backgroundColor: "#fff",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                    textAlign: "center",
                }}
            >
                <h1 style={{ marginBottom: "20px" }}>Login</h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        padding: "12px",
                        fontSize: "16px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
                        transition: "border 0.3s",
                    }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        padding: "12px",
                        fontSize: "16px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
                        transition: "border 0.3s",
                    }}
                />

                <button
                    type="submit"
                    style={{
                        padding: "12px",
                        fontSize: "16px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        boxShadow: "0 4px 8px rgba(0,123,255,0.2)",
                        transition: "background-color 0.3s, transform 0.2s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#0056b3";
                        e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#007bff";
                        e.currentTarget.style.transform = "translateY(0)";
                    }}
                >
                    Login
                </button>

                {message && (
                    <p style={{ color: "red", fontWeight: "500", marginTop: "10px" }}>{message}</p>
                )}
            </form>
        </div>
    );
}
