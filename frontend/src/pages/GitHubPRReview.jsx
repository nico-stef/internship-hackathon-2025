import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function GitHubPRReview() {
    const [repoUrl, setRepoUrl] = useState("");
    const [prNumber, setPrNumber] = useState("");
    const [githubToken, setGithubToken] = useState("");
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!repoUrl || !prNumber || !githubToken) return;

        setLoading(true);
        setReview("");

        try {
            const res = await fetch("http://localhost:3000/review-pending", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ repoUrl, prNumber, githubToken }),
            });

            const data = await res.json();

            console.log("Full response from backend:", data);

            // Folosește reviewFeedback dacă backend-ul îl returnează
            setReview(data.reviewFeedback || "No review returned.");
        } catch (err) {
            console.error(err);
            setReview("Error fetching PR review.");
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
                }}
            >
                GitHub Pull Request Critic
            </h1>
            <p
                style={{
                    fontSize: "1rem",
                    color: "#555",
                    marginBottom: "40px",
                    textAlign: "center",
                }}
            >
                Let's see what your teammates have been working on!
            </p>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                    width: "100%",
                    maxWidth: "500px",
                    marginBottom: "30px",
                }}
            >
                <input
                    type="text"
                    placeholder="Enter GitHub repo URL"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    style={inputStyle}
                />
                <input
                    type="number"
                    placeholder="Enter PR number"
                    value={prNumber}
                    onChange={(e) => setPrNumber(e.target.value)}
                    style={inputStyle}
                />
                <input
                    type="password"
                    placeholder="Enter GitHub token"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    style={inputStyle}
                />

                <button
                    type="submit" // ← important!
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
                    Review PR
                </button>


            </form>

            {loading && <p>Loading review...</p>}

            {review && (
                <div style={reviewBoxStyle}>
                    <h3>PR Review:</h3>
                    <ReactMarkdown
                        children={review}
                        components={{
                            code: ({ node, inline, className, children, ...props }) => (
                                <pre style={{ backgroundColor: "#f5f5f5", padding: "10px", borderRadius: "6px", overflowX: "auto" }}>
                                    <code>{children}</code>
                                </pre>
                            )
                        }}
                    />
                </div>
            )}

        </div>
    );
}

// Styling
const inputStyle = {
    padding: "12px 15px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
};

const buttonStyle = {
    padding: "12px 25px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "#fff",
    fontWeight: "bold",
};

const reviewBoxStyle = {
    width: "100%",
    maxWidth: "700px",
    padding: "25px",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    border: "1px solid #e0e0e0",
};
