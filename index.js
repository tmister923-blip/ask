const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits } = require('discord.js');
const http = require('http');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Configuration
const config = {
    panelChannelId: process.env.PANEL_CHANNEL_ID || '1422585282112389162',
    generalChannelId: process.env.GENERAL_CHANNEL_ID || '1409108686869364778',
    supportUrl: process.env.SUPPORT_URL || 'https://guns.lol/i_q',
    port: process.env.PORT || 1000
};

// Create HTTP server for Render.com
const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: 'ok', 
            bot: client.user ? 'online' : 'offline',
            timestamp: new Date().toISOString()
        }));
    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Discord Bot is running! \ud83e\udd16');
    }
});

// Start HTTP server
server.listen(config.port, () => {
    console.log(`\ud83c\udf10 HTTP server running on port ${config.port}`);
});

let panelMessage = null;

// Create NGL-style embed for anonymous messages
function createAnonymousEmbed(message) {
    const embed = new EmbedBuilder()
        .setColor(0x7289DA) // Discord blurple color
        .setTitle('📩 Anonymous Message')
        .setDescription(message)
        .setThumbnail('https://i.imgur.com/wSTFkRM.png') // Optional: Add a small anonymous icon
        .setFooter({ 
            text: '💌 Sent anonymously • React to show support',
            iconURL: 'https://i.imgur.com/wSTFkRM.png' 
        })
        .setTimestamp();

    // Create a gradient-like effect using color and styling
    embed.setAuthor({
        name: '🎭 Anonymous',
        iconURL: 'https://i.imgur.com/wSTFkRM.png'
    });

    return embed;
}

// Create the persistent panel
function createPanel() {
    const embed = new EmbedBuilder()
        .setColor(0xFF6B9D) // Pink gradient color
        .setTitle('💬 Anonymous Messaging Panel')
        .setDescription('**Send anonymous messages to the community!**\n\n' +
                       '🔸 Click "Send a Message" to share something anonymously\n' +
                       '🔸 Click "Support" if you need help\n\n' +
                       '> *Your identity will remain completely anonymous*')
        .setThumbnail('https://i.imgur.com/wSTFkRM.png')
        .setFooter({ 
            text: '🛡️ Safe • Anonymous • Secure',
            iconURL: 'https://i.imgur.com/wSTFkRM.png' 
        })
        .setTimestamp();

    const sendMessageButton = new ButtonBuilder()
        .setCustomId('send_anonymous_message')
        .setLabel('📝 Send a Message')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('💭');

    const supportButton = new ButtonBuilder()
        .setCustomId('support')
        .setLabel('🆘 Support')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('❓');

    const row = new ActionRowBuilder()
        .addComponents(sendMessageButton, supportButton);

    return { embeds: [embed], components: [row] };
}

// Send or update the panel message
async function ensurePanel(channel) {
    try {
        const panelContent = createPanel();
        
        if (panelMessage) {
            try {
                await panelMessage.edit(panelContent);
                console.log('Panel message updated successfully');
                return panelMessage;
            } catch (error) {
                console.log('Panel message no longer exists, creating new one');
                panelMessage = null;
            }
        }
        
        if (!panelMessage) {
            panelMessage = await channel.send(panelContent);
            console.log('New panel message created');
        }
        
        return panelMessage;
    } catch (error) {
        console.error('Error ensuring panel:', error);
    }
}

// Check if panel exists periodically
async function checkPanelExists() {
    try {
        const channel = client.channels.cache.get(config.panelChannelId);
        if (!channel) return;

        if (panelMessage) {
            try {
                await panelMessage.fetch();
            } catch (error) {
                console.log('Panel message was deleted, recreating...');
                panelMessage = null;
                await ensurePanel(channel);
            }
        } else {
            await ensurePanel(channel);
        }
    } catch (error) {
        console.error('Error checking panel:', error);
    }
}

client.once('ready', async () => {
    console.log(`✅ Bot is ready! Logged in as ${client.user.tag}`);
    
    // Ensure panel exists on startup
    const panelChannel = client.channels.cache.get(config.panelChannelId);
    if (panelChannel) {
        await ensurePanel(panelChannel);
        
        // Check panel every 5 minutes
        setInterval(checkPanelExists, 5 * 60 * 1000);
    } else {
        console.error('❌ Panel channel not found!');
    }
});

// Handle button interactions
client.on('interactionCreate', async (interaction) => {
    try {
        if (interaction.isButton()) {
            if (interaction.customId === 'send_anonymous_message') {
                // Create modal for anonymous message input
                const modal = new ModalBuilder()
                    .setCustomId('anonymous_message_modal')
                    .setTitle('📝 Send Anonymous Message');

                const messageInput = new TextInputBuilder()
                    .setCustomId('message_content')
                    .setLabel('Your Anonymous Message')
                    .setStyle(TextInputStyle.Paragraph)
                    .setPlaceholder('Type your message here... (supports Arabic and English)')
                    .setRequired(true)
                    .setMaxLength(2000)
                    .setMinLength(1);

                const firstActionRow = new ActionRowBuilder().addComponents(messageInput);
                modal.addComponents(firstActionRow);

                await interaction.showModal(modal);
                
            } else if (interaction.customId === 'support') {
                // Handle support button
                await interaction.reply({
                    content: `🆘 **Need support?** Click the link below:\n${config.supportUrl}`,
                    ephemeral: true
                });
            }
            
        } else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'anonymous_message_modal') {
                const messageContent = interaction.fields.getTextInputValue('message_content');
                
                // Send anonymous message to general channel
                const generalChannel = client.channels.cache.get(config.generalChannelId);
                if (generalChannel) {
                    const anonymousEmbed = createAnonymousEmbed(messageContent);
                    await generalChannel.send({ embeds: [anonymousEmbed] });
                    
                    await interaction.reply({
                        content: '✅ Your anonymous message has been sent successfully!',
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content: '❌ Error: Could not find the general channel.',
                        ephemeral: true
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error handling interaction:', error);
        if (!interaction.replied && !interaction.deferred) {
            try {
                await interaction.reply({
                    content: '❌ An error occurred while processing your request.',
                    ephemeral: true
                });
            } catch (replyError) {
                console.error('Error sending error reply:', replyError);
            }
        }
    }
});

// Handle message deletions to recreate panel if needed
client.on('messageDelete', async (message) => {
    if (panelMessage && message.id === panelMessage.id) {
        console.log('Panel message was deleted, recreating...');
        panelMessage = null;
        const channel = client.channels.cache.get(config.panelChannelId);
        if (channel) {
            setTimeout(() => ensurePanel(channel), 1000); // Small delay to avoid rate limits
        }
    }
});

// Error handling
client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
    process.exit(1);
});

// Login to Discord
client.login(process.env.DISCORD_BOT_TOKEN).catch(error => {
    console.error('❌ Failed to login to Discord:', error);
    process.exit(1);
});