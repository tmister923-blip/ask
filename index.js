const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits, AttachmentBuilder } = require('discord.js');
const http = require('http');
const { createCanvas, loadImage, registerFont } = require('canvas');
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

// Text wrapping function for canvas
function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const testWidth = ctx.measureText(testLine).width;
        
        if (testWidth <= maxWidth) {
            currentLine = testLine;
        } else {
            if (currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                lines.push(word);
            }
        }
    }
    
    if (currentLine) {
        lines.push(currentLine);
    }
    
    return lines;
}

// Create NGL-style image card for anonymous messages
async function createAnonymousCard(message) {
    const canvas = createCanvas(600, 450);
    const ctx = canvas.getContext('2d');
    
    // Set high quality rendering
    ctx.antialias = 'subpixel';
    ctx.textRenderingOptimization = 'optimizeQuality';
    
    // Background with gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, 450);
    bgGradient.addColorStop(0, '#f8f9fa');
    bgGradient.addColorStop(1, '#e9ecef');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 600, 450);
    
    // Helper function for rounded rectangles
    const roundRect = (x, y, width, height, radius) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
    };
    
    // Main card shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 8;
    
    // Draw main card background
    ctx.fillStyle = '#ffffff';
    roundRect(30, 30, 540, 390, 20);
    ctx.fill();
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Gradient header
    const headerGradient = ctx.createLinearGradient(0, 30, 0, 130);
    headerGradient.addColorStop(0, '#667eea');
    headerGradient.addColorStop(0.3, '#764ba2');
    headerGradient.addColorStop(0.7, '#f093fb');
    headerGradient.addColorStop(1, '#f5576c');
    
    ctx.fillStyle = headerGradient;
    roundRect(30, 30, 540, 100, 20);
    ctx.fill();
    
    // Header overlay for better text contrast
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    roundRect(30, 30, 540, 100, 20);
    ctx.fill();
    
    // Header text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial, system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎭 Anonymous Message', 300, 70);
    
    ctx.font = '16px Arial, system-ui';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillText('💌 Shared anonymously with love', 300, 105);
    
    // Message content area
    ctx.fillStyle = '#2c3e50';
    
    // Detect if message contains Arabic characters
    const hasArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(message);
    
    if (hasArabic) {
        ctx.font = 'bold 20px Arial, Tahoma, "Segoe UI", system-ui';
        ctx.direction = 'rtl';
    } else {
        ctx.font = 'bold 20px Arial, "Segoe UI", system-ui';
        ctx.direction = 'ltr';
    }
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Wrap text and center it vertically
    const maxWidth = 480;
    const lines = wrapText(ctx, message, maxWidth);
    const lineHeight = 32;
    const totalHeight = lines.length * lineHeight;
    const startY = 260 - (totalHeight / 2) + (lineHeight / 2);
    
    // Add subtle background for message area
    ctx.fillStyle = 'rgba(108, 117, 125, 0.05)';
    roundRect(50, startY - 20, 500, totalHeight + 40, 15);
    ctx.fill();
    
    // Draw message lines
    ctx.fillStyle = '#2c3e50';
    lines.forEach((line, index) => {
        ctx.fillText(line, 300, startY + (index * lineHeight));
    });
    
    // Decorative border at bottom
    const bottomGradient = ctx.createLinearGradient(50, 370, 550, 370);
    bottomGradient.addColorStop(0, 'rgba(102, 126, 234, 0.3)');
    bottomGradient.addColorStop(0.5, 'rgba(245, 87, 108, 0.3)');
    bottomGradient.addColorStop(1, 'rgba(102, 126, 234, 0.3)');
    
    ctx.fillStyle = bottomGradient;
    ctx.fillRect(50, 370, 500, 3);
    
    // Footer text
    ctx.fillStyle = 'rgba(108, 117, 125, 0.7)';
    ctx.font = '14px Arial, system-ui';
    ctx.textAlign = 'center';
    ctx.direction = 'ltr';
    ctx.fillText('React with 💝 to show support', 300, 395);
    
    // Decorative elements
    ctx.fillStyle = '#f5576c';
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(250 + (i * 25), 410, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    return canvas.toBuffer('image/png');
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
                    try {
                        // Generate the NGL-style card image
                        const cardBuffer = await createAnonymousCard(messageContent);
                        const attachment = new AttachmentBuilder(cardBuffer, { 
                            name: 'anonymous-message.png',
                            description: 'Anonymous message card'
                        });
                        
                        // Send the image card
                        await generalChannel.send({ 
                            files: [attachment],
                            content: '📩 **New Anonymous Message**'
                        });
                        
                        await interaction.reply({
                            content: '✅ Your anonymous message has been sent successfully!',
                            ephemeral: true
                        });
                    } catch (error) {
                        console.error('Error creating anonymous card:', error);
                        await interaction.reply({
                            content: '❌ Error: Failed to create message card. Please try again.',
                            ephemeral: true
                        });
                    }
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