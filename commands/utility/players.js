const fs = require('fs');

module.exports = {
    data: {
        name: 'players',
        description: 'Check the list of connected players.',
    },
    async execute(interaction) {
        try {
            const data = fs.readFileSync('/home/matalasg/serverLog.json', 'utf8');
            console.log('Raw data from serverLog.json:', data); // Add this line to log raw data
            const serverStatus = JSON.parse(data);
            console.log('Parsed server status:', serverStatus); // Add this line to log parsed server status
            const players = serverStatus.players;
            console.log('Server Status Players:', players); // Add this line to log server players
            if (!Array.isArray(players)) {
                throw new Error('Server Status Players is not an array or is undefined.');
            }
            const playerNames = players.join(', ');
            await interaction.reply(`Currently connected players: ${playerNames}`);
        } catch (error) {
            console.error('Error reading server log data:', error);
            await interaction.reply('Error reading server log data.');
        }
    },
};
