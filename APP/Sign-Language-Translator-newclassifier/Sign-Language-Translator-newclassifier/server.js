const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public folder

const DATA_FILE = path.join(__dirname, 'data', 'gestures.json');

// Read gestures from the JSON file
function readGestures() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify({ gestures: [] })); // Create file if it doesn't exist
    }
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
}

// Save gestures to the JSON file
function saveGestures(gestures) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ gestures: gestures }));
}

// Get all gestures
app.get('/gestures', (req, res) => {
    const gesturesData = readGestures();
    res.json(gesturesData);
});

// Add a new gesture
app.post('/add-gesture', (req, res) => {
    const newGesture = req.body.gesture;
    const gesturesData = readGestures();
    gesturesData.gestures.push({ gesture: newGesture });
    saveGestures(gesturesData);
    res.json({ gesture: newGesture });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
