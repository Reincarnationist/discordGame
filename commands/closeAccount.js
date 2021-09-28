const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('close')
	.setDescription('close the account, delete the profile in the database')
    .addUserOption((option) =>
    option.setName('target').setDescription('The user').setRequired(true)),

	async execute(interaction) {
        const user_to_delete = interaction.options.getUser('target');
        if (!interaction.member.permissions.has("ADMINISTRATOR")){
            await interaction.reply(`Sorry, you do not have the permission.`);
            return;
        }
        
        const user = await Users.findOne({ where: { user_id: user_to_delete.id } });
        if(!user){
            await interaction.reply({content: 'You are not registered.',ephemeral: true})
            return;
        }else{
            await Users.destroy({ where: { user_id: user_to_delete.id } });
            await interaction.reply(`User ${user_to_delete.username} has been deleted.`)
        }
	}
};