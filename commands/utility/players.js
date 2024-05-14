const fs = require('fs');
const path = require('path');

// Function to extract connected players from server status data
function getConnectedPlayers(serverStatus) {
    const connectedPlayers = new Set();
    serverStatus.forEach(entry => {
        if (entry.event === 'player_login' && entry.zdo_id !== '0') {
            connectedPlayers.add(entry.zdo_id);
        } else if (entry.event === 'player_disconnect') {
            connectedPlayers.delete(entry.zdo_id);
        }
    });
    return Array.from(connectedPlayers);
}

// Define the path to the server log file
const serverLogPath = path.resolve(__dirname, '/home/matalasg/serverLog.json');

// Read server log data from JSON file
fs.readFile(serverLogPath, 'utf8', (err, data) => {
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

// Export the getConnectedPlayers function
module.exports = {
    getConnectedPlayers: getConnectedPlayers
};
