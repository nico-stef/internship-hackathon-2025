import { useState } from "react";

export default function GitHubReview() {
    const [repoUrl, setRepoUrl] = useState("");
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!repoUrl) return;

        setLoading(true);
        setReview("");

        try {
            const res = await fetch("http://localhost:3000/review-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ repoUrl }),
            });

            const data = await res.json();

            console.log("Review for repo:", data.repoUrl);
            console.log("Generated review:\n", data.review);

            setReview(data.review);
        } catch (err) {
            console.error(err);
            setReview("Error fetching review.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "50px 20px",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
        >
            <h1
                style={{
                    fontSize: "3rem",
                    fontWeight: "700",
                    marginBottom: "40px",
                    textAlign: "center",
                    textShadow: "1px 1px 3px rgba(0,0,0,0.1)",
                }}
            >
                GitHub repository Critic
            </h1>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    marginBottom: "30px",
                }}
            >
                <input
                    type="text"
                    placeholder="Enter GitHub repo URL"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    style={{
                        width: "400px",
                        maxWidth: "100%",
                        padding: "12px 15px",
                        fontSize: "16px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                        transition: "border-color 0.3s",
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: "12px 25px",
                        fontSize: "16px",
                        backgroundColor: "#000",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        boxShadow: "0 4px 8px rgba(0,123,255,0.2)",
                        transition: "background-color 0.3s, transform 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#000")}
                >
                    Review
                </button>
            </form>

            {loading && (
                <p style={{ fontSize: "16px", color: "#555", marginBottom: "20px" }}>
                    Loading review...
                </p>
            )}

            {review && (
                <div
                    style={{
                        width: "100%",
                        maxWidth: "700px",
                        whiteSpace: "pre-wrap",
                        padding: "25px",
                        borderRadius: "12px",
                        backgroundColor: "#fff",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        border: "1px solid #e0e0e0",
                        animation: "fadeIn 0.5s ease-in-out",
                    }}
                >
                    <h3 style={{ marginBottom: "15px", color: "#333" }}>Code Review:</h3>
                    <p style={{ lineHeight: "1.6" }}>{review}</p>
                </div>
            )}
        </div>
    );
}
