const fs = require('fs');

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
            
            // Extract player names from login events
            const loginPlayers = serverStatus.filter(entry => entry.event === 'player_login').map(entry => entry.player_name);
            console.log('Login Players:', loginPlayers); // log login players

            // Extract player names from logout events
            const logoutPlayers = serverStatus.filter(entry => entry.event === 'player_disconnect').map(entry => entry.player_name);
            console.log('Logout Players:', logoutPlayers); // log logout players

            // Combine login and logout players to get currently connected players
            const connectedPlayers = [...new Set([...loginPlayers, ...logoutPlayers])];
            console.log('Connected Players:', connectedPlayers); // log connected players

            await interaction.reply(`Currently connected players: ${connectedPlayers.join(', ')}`);
        } catch (error) {
            console.error('Error reading server log data:', error);
            await interaction.reply('Error reading server log data.');
        }
    },
};
