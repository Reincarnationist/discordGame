const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('manage')
	.setDescription("add money to a user's balance")
	.addSubcommandGroup(group =>
		group
            .setName('money')
            .setDescription("Shows or manages user's balance")
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('user')
                    .setDescription("Display the current amount of money the user has")
                    .addUserOption((option) =>
                        option.setName('target').setDescription('The user').setRequired(true),
                    )
                    .addStringOption((option) =>
                        option
                            .setName('action')
                            .setDescription("What action should be taken with the user's money")
                            .addChoices([
                                ['I just wanna check my balance', 'done'],
                                ['Add money', 'add'],
                                ['Remove money', 'remove'],
                                ['Reset money', 'reset'],
                                
                            ])
                            .setRequired(true),
                    )
                    .addIntegerOption((option) => option.setName('money').setDescription('money to add or remove')),
            ),
    ),

	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'user') {
			const user = interaction.options.getUser('target');
            const action = interaction.options.getString('action')
            const amount = interaction.options.getInteger('money') ? interaction.options.getInteger('money'):0
			if (user.bot) {
                await interaction.reply("Sorry, bot does not own a bank account.")
                return;
		    }   
            else{
                if (action === 'done'){
                    await interaction.reply(`Here is your balance, ${user.username}`)
                    return;
                }else if (!interaction.member.permissions.has("ADMINISTRATOR")){
                    await interaction.reply(`Sorry, you do not have the permission.`);
                    return;
                }switch(action){
                    case 'add':
                        await interaction.reply(`Added ${amount} to ${user.username}'s balance`);
                        break;
                    case 'remove':
                        await interaction.reply(`Removed ${amount} from ${user.username}'s balance`);
                        break;
                    case 'reset':
                        await interaction.reply(`${user.username}'s balance has been reset.`);
                        break;
                    default:
                        await interaction.reply(`Something is broken, contact the Admin.`)
                }
        }
    }

           
        
	},
};