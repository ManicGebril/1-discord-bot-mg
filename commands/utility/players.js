const fs = require('fs');

// Function to extract login players from server status data
function getLoginPlayers(serverStatus) {
    return serverStatus
        .filter(entry => entry.event === 'player_login')
        .map(entry => entry.player_name);
}

// Function to extract logout players from server status data
function getLogoutPlayers(serverStatus) {
    return serverStatus
        .filter(entry => entry.event === 'player_disconnect')
        .map(entry => entry.player_name);
}

// Function to determine currently connected players
function getConnectedPlayers(serverStatus) {
    const connectedPlayers = new Map();

    // Iterate through server status to track player's online status
    serverStatus.forEach(entry => {
        if (entry.event === 'player_login' && entry.zdo_id) {
            connectedPlayers.set(entry.zdo_id, entry.timestamp); // Add player to connected players with login timestamp
            console.log(`Player with zdo_id ${entry.zdo_id} logged in`);
        } else if (entry.event === 'player_disconnect' && entry.zdo_id) {
            if (connectedPlayers.has(entry.zdo_id)) {
                connectedPlayers.delete(entry.zdo_id); // Remove player from connected players
                console.log(`Player with zdo_id ${entry.zdo_id} disconnected`);
            } else {
                console.log(`Player with zdo_id ${entry.zdo_id} disconnected, but was not logged in previously`);
            }
        }
    });

    return Array.from(connectedPlayers.keys()); // Return only the zdo_ids of connected players
}

module.exports = {
    data: {
        name: 'players',
        description: 'Check the list of connected players.',
    },
    async execute(interaction) {
        try {
            const data = fs.readFileSync('/home/matalasg/serverLog.json', 'utf8');
            console.log('Raw data from serverLog.json:', data); // log raw data
            const serverStatus = JSON.parse(data);
            console.log('Parsed server status:', serverStatus); // log parsed server status
            
            // Get currently connected players
            const connectedPlayers = getConnectedPlayers(serverStatus);
            console.log('Connected Players:', connectedPlayers); // log connected players

            if (connectedPlayers.length === 0) {
                await interaction.reply('There are no players currently connected.');
            } else {
                await interaction.reply(`Currently connected players: ${connectedPlayers.join(', ')}`);
            }
        } catch (error) {
            console.error('Error reading server log data:', error);
            await interaction.reply('Error reading server log data.');
        }
    },
};
