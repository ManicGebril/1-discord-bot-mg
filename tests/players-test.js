// Mock interaction object for testing
const mockInteraction = {
    reply: async (message) => {
        console.log(message);
    }
};

// Import the command
const playersCommand = require('../commands/utility/players.js');

// Invoke the command's execute function
playersCommand.execute(mockInteraction)
    .then(() => {
        console.log('Command executed successfully.');
    })
    .catch((error) => {
        console.error('Error executing command:', error);
    });