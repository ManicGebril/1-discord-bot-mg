const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Function to extract connected players from server status data
function getConnectedPlayers(serverStatus) {
    const connectedPlayers = new Map(); // Use a Map to track ZDOIDs and player names

    serverStatus.forEach(entry => {
        if (entry.event === 'player_login' && entry.zdo_id !== '0') {
            connectedPlayers.set(entry.zdo_id, entry.player_name);
        } else if (entry.event === 'player_disconnect') {
            connectedPlayers.delete(entry.zdo_id);
        }
    });

    return Array.from(connectedPlayers.values()); // Return an array of player names
}

// Define the path to the server log file
const serverLogPath = path.resolve(__dirname, '/home/matalasg/serverLog.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('players')
        .setDescription('Displays the currently connected players.'),
    async execute(interaction) {
        fs.readFile(serverLogPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading server log file:', err);
                interaction.reply('Error reading server log file.');
                return;
            }
            try {
                const serverStatus = JSON.parse(data);
                const connectedPlayers = getConnectedPlayers(serverStatus);
                let replyMessage;
                if (connectedPlayers.length > 0) {
                    replyMessage = `Connected Players: ${connectedPlayers.join(', ')}`;
                } else {
                    replyMessage = 'No players are currently connected.';
                }
                interaction.reply(replyMessage);
            } catch (error) {
                console.error('Error parsing server log data:', error);
                interaction.reply('Error fetching player data.');
            }
        });
    },
    getConnectedPlayers,  // export the function for command test
};
