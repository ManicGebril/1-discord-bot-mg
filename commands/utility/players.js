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
            const players = serverStatus.players.join(', ');
            await interaction.reply(`Currently connected players: ${players}`);
        } catch (error) {
            console.error('Error reading server log data:', error);
            await interaction.reply('Error reading server log data.');
        }
    },
};
