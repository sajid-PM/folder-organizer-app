// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

// Create an Express application
const app = express();
const PORT = 3000;

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Handle POST requests to /organize
app.post('/organize', (req, res) => {
    const folderPath = req.body.folder_path;

    // Check if the folder path is provided and exists
    if (!folderPath || !fs.existsSync(folderPath)) {
        return res.json({ success: false, message: 'Invalid folder path.' });
    }

    try {
        // Organize the files in the folder
        organizeFiles(folderPath);
        res.json({ success: true, message: 'Files organized successfully.' });
    } catch (error) {
        res.json({ success: false, message: 'Error organizing files: ' + error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Function to organize files based on creation date and type
function organizeFiles(folderPath) {
    // Read all files in the folder
    fs.readdirSync(folderPath).forEach(file => {
        const fullPath = path.join(folderPath, file);

        // Skip directories
        if (fs.lstatSync(fullPath).isDirectory()) return;

        // Get file stats
        const stats = fs.statSync(fullPath);
        const creationTime = new Date(stats.birthtime);
        const monthYear = `${creationTime.toLocaleString('default', { month: 'long' })} ${creationTime.getFullYear()}`;

        // Get file extension or use "no_extension" if none
        const ext = path.extname(file).slice(1) || 'no_extension';
        const destinationFolder = path.join(folderPath, monthYear, ext);

        // Create the destination folder if it doesn't exist
        if (!fs.existsSync(destinationFolder)) {
            fs.mkdirSync(destinationFolder, { recursive: true });
        }

        // Move the file to the destination folder
        fs.renameSync(fullPath, path.join(destinationFolder, file));
    });
}
