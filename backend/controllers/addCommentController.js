// routes/prComments.js sau în controller-ul tău
import { Octokit } from "@octokit/rest";

export const addCommentController = async (req, res) => {
    try {
        const { repoUrl, prNumber, githubToken, comment } = req.body;

        if (!repoUrl || !prNumber || !githubToken || !comment) {
            return res.status(400).json({ error: "Lipsesc date obligatorii!" });
        }

        // Extragem owner și repo din URL
        const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)(\.git)?$/);
        if (!match) return res.status(400).json({ error: "URL repo invalid" });
        const owner = match[1];
        const repo = match[2];

        const octokit = new Octokit({ auth: githubToken });

        // Adaugăm comentariu general la PR (PR-urile sunt și issues)
        await octokit.issues.createComment({
            owner,
            repo,
            issue_number: Number(prNumber),
            body: comment
        });

        res.json({ success: true, message: "Comment added to PR successfully!" });
    } catch (err) {
        console.error("❌ Error adding comment to PR:", err);
        res.status(500).json({ error: "A apărut o eroare la adăugarea comentariului pe PR" });
    }
};
