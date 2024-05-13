const fs = require('fs');

function getConnectedPlayers(serverStatus) {
    const connectedPlayers = new Map();

    // Iterate through server status to track player's online status
    serverStatus.forEach(entry => {
        if (entry.event === 'player_login' && entry.zdo_id && entry.zdo_id !== '0') {
            const playerName = entry.player_name;
            const zdoId = entry.zdo_id;
            if (!connectedPlayers.has(playerName)) {
                connectedPlayers.set(playerName, zdoId); // Add player to connected players with zdo_id
                console.log(`Player ${playerName} logged in with zdo_id ${zdoId}`);
            } else {
                const currentZdoId = connectedPlayers.get(playerName);
                if (zdoId !== currentZdoId) {
                    console.log(`Player ${playerName} already logged in with zdo_id ${currentZdoId}, replacing with zdo_id ${zdoId}`);
                    connectedPlayers.set(playerName, zdoId); // Update player's zdo_id
                } else {
                    console.log(`Player ${playerName} already logged in with zdo_id ${zdoId}, ignoring zdo_id ${zdoId}`);
                }
            }
        } else if (entry.event === 'player_disconnect' && entry.zdo_id) {
            const playerName = entry.player_name;
            if (connectedPlayers.has(playerName)) {
                connectedPlayers.delete(playerName); // Remove player from connected players
                console.log(`Player ${playerName} disconnected with zdo_id ${entry.zdo_id}`);
            } else {
                console.log(`Player ${playerName} disconnected with zdo_id ${entry.zdo_id}, but was not logged in previously with this zdo_id`);
            }
        }
    });

    return Array.from(connectedPlayers.values()); // Return only the zdo_ids of connected players
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
