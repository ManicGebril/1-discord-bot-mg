const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('khrom')
		.setDescription('Pay your respects weakling'),
	async execute(interaction) {
		await interaction.reply(
            'General Khrom'
        );
	},
}