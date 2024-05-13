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
    const loginPlayers = getLoginPlayers(serverStatus);
    const logoutPlayers = getLogoutPlayers(serverStatus);

    // Create a map to store the latest login and logout timestamp for each player
    const latestLogins = new Map();
    const latestLogouts = new Map();

    // Iterate through server status to find the latest login and logout for each player
    serverStatus.forEach(entry => {
        if (entry.event === 'player_login') {
            latestLogins.set(entry.player_name, entry.timestamp);
        } else if (entry.event === 'player_disconnect') {
            latestLogouts.set(entry.zdo_id, entry.timestamp);
        }
    });

    // Filter out players who have logged in but not logged out yet
    const connectedPlayers = loginPlayers.filter(player => {
        const latestLoginTimestamp = latestLogins.get(player);
        const latestLogoutTimestamp = latestLogouts.get(player);
        // Check if there's no corresponding logout event after the latest login event
        return latestLoginTimestamp && (!latestLogoutTimestamp || latestLogoutTimestamp < latestLoginTimestamp);
    });

    // Ensure unique player names
    return [...new Set(connectedPlayers)];
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
