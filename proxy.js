const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Team code to name mapping
const teamMapping = {
    'CSK': 'Chennai Super Kings',
    'MI': 'Mumbai Indians',
    'RCB': 'Royal Challengers Bangalore',
    'KKR': 'Kolkata Knight Riders',
    'DC': 'Delhi Capitals',
    'PBKS': 'Punjab Kings',
    'RR': 'Rajasthan Royals',
    'SRH': 'Sunrisers Hyderabad',
    'GT': 'Gujarat Titans',
    'LSG': 'Lucknow Super Giants'
};

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
});

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Proxy endpoint for stats
app.get('/stats', async (req, res) => {
    try {
        console.log('Fetching stats from backend...');
        const backendUrl = 'https://iplbackend-xenz.onrender.com/stats';
        console.log('Backend URL:', backendUrl);
        
        const response = await fetch(backendUrl);
        console.log('Backend response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend error response:', errorText);
            throw new Error(`Backend returned ${response.status}: ${response.statusText}\n${errorText}`);
        }
        
        const data = await response.json();
        console.log('Stats data:', data);
        res.json(data);
    } catch (error) {
        console.error('Error in /stats:', error);
        res.status(500).json({ 
            error: 'Failed to fetch stats',
            details: error.message
        });
    }
});

// Proxy endpoint for voting
app.post('/vote', async (req, res) => {
    try {
        console.log('Processing vote request body:', JSON.stringify(req.body, null, 2));
        const teamName = req.body.team_name;
        
        if (!teamName) {
            console.error('Team name is missing');
            return res.status(400).json({ error: 'Team name is required' });
        }
        
        // Validate team name
        const isValidTeam = Object.values(teamMapping).includes(teamName);
        if (!isValidTeam) {
            console.error('Invalid team name:', teamName);
            return res.status(400).json({ error: 'Invalid team name' });
        }
        
        const backendUrl = 'https://iplbackend-xenz.onrender.com/vote';
        console.log('Backend URL:', backendUrl);
        console.log('Sending vote with payload:', JSON.stringify({ team_name: teamName }, null, 2));
        
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ team_name: teamName }),
        });
        
        console.log('Backend response status:', response.status);
        const responseText = await response.text();
        console.log('Backend response body:', responseText);
        
        let responseData;
        try {
            responseData = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse response as JSON:', e);
            responseData = { message: responseText };
        }
        
        if (!response.ok) {
            throw new Error(`Backend returned ${response.status}: ${response.statusText}\n${JSON.stringify(responseData, null, 2)}`);
        }
        
        console.log('Vote successfully processed:', responseData);
        res.json(responseData);
    } catch (error) {
        console.error('Error in /vote:', error);
        res.status(500).json({ 
            error: 'Failed to process vote',
            details: error.message,
            stack: error.stack
        });
    }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
    console.log('Health check available at http://localhost:3001/health');
});
