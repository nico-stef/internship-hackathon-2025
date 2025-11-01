import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function GitHubPRReview() {
    const [repoUrl, setRepoUrl] = useState("");
    const [prNumber, setPrNumber] = useState("");
    const [githubToken, setGithubToken] = useState("");
    const [review, setReview] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!repoUrl || !prNumber || !githubToken) return;

        setLoading(true);
        setReview([]);

        try {
            const res = await fetch("http://localhost:3000/review-pending", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ repoUrl, prNumber, githubToken }),
            });

            const data = await res.json();
            // Split review pe linii sau fișiere
            const feedbackLines = data.reviewFeedback.split("\n\n");
            setReview(feedbackLines);
        } catch (err) {
            console.error(err);
            setReview(["Error fetching PR review."]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (comment) => {
        try {
            await fetch("http://localhost:3000/add-comment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ repoUrl, prNumber, githubToken, comment }),
            });
            alert("Comment added to PR!");
        } catch (err) {
            console.error(err);
            alert("Failed to add comment.");
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "50px 20px" }}>
            <h1>GitHub Pull Request Critic</h1>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%", maxWidth: "500px" }}>
                <input type="text" placeholder="Repo URL" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} style={inputStyle} />
                <input type="number" placeholder="PR number" value={prNumber} onChange={(e) => setPrNumber(e.target.value)} style={inputStyle} />
                <input type="password" placeholder="GitHub token" value={githubToken} onChange={(e) => setGithubToken(e.target.value)} style={inputStyle} />
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

            {review.length > 0 && (
                <div style={reviewBoxStyle}>
                    <h3>PR Review:</h3>
                    {review.map((item, idx) => (
                        <div key={idx} style={{ marginBottom: "15px" }}>
                            <ReactMarkdown
                                children={item}
                                components={{
                                    code: ({ node, inline, className, children, ...props }) => (
                                        <pre style={{ backgroundColor: "#f5f5f5", padding: "10px", borderRadius: "6px", overflowX: "auto" }}>
                                            <code>{children}</code>
                                        </pre>
                                    )
                                }}
                            />
                            <button onClick={() => handleAddComment(item)} style={{ marginTop: "5px" }}>
                                Add Comment to PR
                            </button>

                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}

// Styling
const inputStyle = { padding: "12px", fontSize: "16px", borderRadius: "6px", border: "1px solid #ccc" };
const reviewBoxStyle = { width: "100%", maxWidth: "700px", padding: "20px", marginTop: "15px", borderRadius: "8px", backgroundColor: "#f9f9f9", border: "1px solid #ddd" };
