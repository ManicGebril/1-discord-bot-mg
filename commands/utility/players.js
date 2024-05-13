const fs = require('fs');

module.exports = {
    data: {
        name: 'players',
        description: 'Check the list of connected players.',
    },
    async execute(interaction) {
        try {
            const data = fs.readFileSync('/home/matalasg/serverLog.json', 'utf8');
            const serverStatus = JSON.parse(data);

            // Log the value of serverStatus.players
            console.log('Server Status Players:', serverStatus.players);

            // Check if serverStatus.players is defined and is an array
            if (Array.isArray(serverStatus.players)) {
                const players = serverStatus.players.join(', ');
                await interaction.reply(`Currently connected players: ${players}`);
            } else {
                console.error('serverStatus.players is not an array or is undefined.');
                await interaction.reply('Error reading server log data.');
            }
        } catch (error) {
            console.error('Error reading server log data:', error);
            await interaction.reply('Error reading server log data.');
        }
    },
};
