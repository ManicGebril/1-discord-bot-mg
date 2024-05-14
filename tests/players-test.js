// Mock interaction object for testing
const mockInteraction = {
    reply: async (message) => {
        console.log(message);
    }
};

// Import the getConnectedPlayers function from players.js
const { getConnectedPlayers } = require('../commands/utility/players.js');

// Read server log data from JSON file
const fs = require('fs');
fs.readFile('/home/matalasg/serverLog.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading server log file:', err);
        return;
    }
    try {
        const serverStatus = JSON.parse(data);
        const connectedPlayers = getConnectedPlayers(serverStatus);
        console.log('Connected Players:', connectedPlayers);
        console.log('Currently connected players:', connectedPlayers.join(', '));
        console.log('Command executed successfully.');
    } catch (error) {
        console.error('Error parsing server log data:', error);
    }
});
