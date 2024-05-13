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
            
            // Extract player names from each object in the serverStatus array
            const playerNames = serverStatus.map(entry => entry.player_name);
            console.log('Server Status Players:', playerNames); // log server players

            await interaction.reply(`Currently connected players: ${playerNames.join(', ')}`);
        } catch (error) {
            console.error('Error reading server log data:', error);
            await interaction.reply('Error reading server log data.');
        }
    },
};
