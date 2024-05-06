const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('thevoid')
		.setDescription('Replies with insight on The Void!'),
	async execute(interaction) {
		await interaction.reply(
            'We live on a placid island of ignorance in the midst of black seas of the infinity, and it was not meant that we should voyage far.!'
        );
	},
};