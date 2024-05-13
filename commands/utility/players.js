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
    // Create maps to store the latest login and logout events for each player
    const latestLogin = new Map();
    const latestLogout = new Map();

    // Iterate through server status to update latest login and logout events
    serverStatus.forEach(entry => {
        if (entry.event === 'player_login') {
            latestLogin.set(entry.player_name, entry.timestamp); // Update latest login event
        } else if (entry.event === 'player_disconnect') {
            latestLogout.set(entry.zdo_id, entry.timestamp); // Update latest logout event
        }
    });

    // Filter out players who have a login event after their latest logout event
    const connectedPlayers = [];
    latestLogin.forEach((loginTime, player) => {
        if (!latestLogout.has(player) || latestLogout.get(player) < loginTime) {
            connectedPlayers.push(player);
        }
    });

    return connectedPlayers;
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
