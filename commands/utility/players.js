const fs = require('fs');

// Function to extract connected players from server status data
function getConnectedPlayers(serverStatus) {
    const connectedPlayers = new Set();
    serverStatus.forEach(entry => {
        if (entry.event === 'player_login' && entry.zdo_id !== '0') {
            connectedPlayers.add(entry.zdo_id);
        } else if (entry.event === 'player_disconnect' && entry.zdo_id && entry.player_name) {
            connectedPlayers.delete(entry.zdo_id);
        }
    });
    return Array.from(connectedPlayers);
}

// Read server log data from JSON file
fs.readFile('serverLog.json', 'utf8', (err, data) => {
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
