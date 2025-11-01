import reviewService from "../services/review.service.js";
import simpleGit from "simple-git";
import fs from "fs";
import path from "path";
import os from "os";

// Funcție recursivă pentru citirea tuturor fișierelor relevante
function readFilesRecursively(dir, extensions = ['.js', '.ts', '.py']) {
    let combinedCode = '';
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(dir, file.name);

        if (file.isDirectory()) {
            combinedCode += readFilesRecursively(fullPath, extensions);
        } else {
            const ext = path.extname(file.name).toLowerCase();
            if (extensions.includes(ext)) {
                const code = fs.readFileSync(fullPath, 'utf8');
                combinedCode += `\n// File: ${path.relative(dir, fullPath)}\n${code}`;
            }
        }
    }
    return combinedCode;
}

const reviewController = async (req, res) => {
    try {
        const { repoUrl } = req.body;

        if (!repoUrl) {
            return res.status(400).json({ error: "Trebuie să trimiți un repoUrl!" });
        }

        console.log("Received repo URL:", repoUrl);

        // Creăm folder temporar
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'repo-'));

        // Clonăm repository-ul
        const git = simpleGit();
        await git.clone(repoUrl, tmpDir);

        // Citim fișierele recursiv (JS, TS, Python)
        const supportedExtensions = ['.js', '.ts', '.py'];
        const combinedCode = readFilesRecursively(tmpDir, supportedExtensions);

        // Log fișiere citite
        if (combinedCode) {
            console.log(`Found code files in repo (${supportedExtensions.join(', ')}).`);
        } else {
            console.warn("No code files found in repo.");
            res.json({ review: `No code files found in repo with extensions: ${supportedExtensions.join(', ')}`, repoUrl });
            fs.rmSync(tmpDir, { recursive: true, force: true });
            return;
        }

        // Trimitem codul la LLM
        const review = await reviewService(combinedCode);

        // Ștergem folderul temporar
        fs.rmSync(tmpDir, { recursive: true, force: true });

        res.json({ review, repoUrl });

    } catch (err) {
        console.error("Error in reviewController:", err);
        res.status(500).json({ error: "Ceva a mers prost..." });
    }
};

export default reviewController;
