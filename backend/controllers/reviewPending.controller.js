import simpleGit from "simple-git";
import fs from "fs";
import path from "path";
import os from "os";
import fetch from "node-fetch"; // doar dacă vrei să chemi LLM după
import { Octokit } from "@octokit/rest"; // npm i @octokit/rest

const reviewPRController = async (req, res) => {
    try {
        const { repoUrl, prNumber, githubToken } = req.body;

        if (!repoUrl) {
            return res.status(400).json({ error: "Trebuie să trimiți un repoUrl!" });
        }
        if (!prNumber) {
            return res.status(400).json({ error: "Trebuie să trimiți prNumber!" });
        }
        if (!githubToken) {
            return res.status(400).json({ error: "Trebuie să trimiți githubToken!" });
        }

        console.log(`\n🔍 Fetching PR #${prNumber} from repo: ${repoUrl}`);

        // Extragem owner și repo din URL
        const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)(\.git)?$/);
        if (!match) throw new Error("URL repo invalid");

        const owner = match[1];
        const repoName = match[2];


        // GitHub API client
        const octokit = new Octokit({ auth: githubToken });

        // Obținem PR-ul
        const { data: pr } = await octokit.pulls.get({
            owner,
            repo: repoName,
            pull_number: prNumber
        });

        const sourceBranch = pr.head.ref;
        const targetBranch = pr.base.ref;

        console.log(`PR #${prNumber}: ${sourceBranch} → ${targetBranch}`);

        // Creăm folder temporar
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'repo-'));
        const git = simpleGit();

        // Clonăm repo
        await git.clone(repoUrl, tmpDir);
        const repoGit = simpleGit(tmpDir);

        await repoGit.fetch(['--all']);
        await repoGit.checkout(targetBranch);

        // Creează branch local pentru sourceBranch din remote dacă nu există
        const localBranches = await repoGit.branchLocal();
        if (!localBranches.all.includes(sourceBranch)) {
            await repoGit.checkout(['-b', sourceBranch, `origin/${sourceBranch}`]);
        } else {
            await repoGit.checkout(sourceBranch);
        }

        // Obținem lista fișierelor modificate
        const diffSummary = await repoGit.diffSummary([`${targetBranch}...${sourceBranch}`]);
        const changedFiles = diffSummary.files.map(f => f.file);

        if (changedFiles.length === 0) {
            console.warn("⚠️  No files changed in this PR.");
            fs.rmSync(tmpDir, { recursive: true, force: true });
            return res.json({ review: "No code differences found for review." });
        }

        console.log("📝 Modified files:");
        changedFiles.forEach(f => console.log("  -", f));

        // Citește și afișează codul modificat
        console.log("\n=== CODE CHANGES EXTRACTED ===");
        let combinedDiff = "";
        for (const file of changedFiles) {
            const fullPath = path.join(tmpDir, file);
            if (fs.existsSync(fullPath)) {
                const code = fs.readFileSync(fullPath, "utf8");
                console.log(`\n// File: ${file}\n`);
                console.log(code);
                combinedDiff += `\n// File: ${file}\n${code}`;
            }
        }
        console.log("\n=== END CODE CHANGES ===");

        fs.rmSync(tmpDir, { recursive: true, force: true });

        // Returnăm JSON
        res.json({
            repoUrl,
            prNumber,
            sourceBranch,
            targetBranch,
            changedFiles,
            totalFiles: changedFiles.length
        });

    } catch (err) {
        console.error("❌ Error in reviewPRController:", err);
        res.status(500).json({ error: "Ceva a mers prost la analizarea PR-ului..." });
    }
};

export default reviewPRController;
