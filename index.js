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
    console.log('🎨 Starting image generation for message:', message.substring(0, 30) + '...');
    
    try {
        const width = 400;
        const height = 200;
        console.log('🔍 Creating canvas:', width, 'x', height);
        
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        
        // Test if canvas is working by setting a global composite operation
        ctx.globalCompositeOperation = 'source-over';
        
        // Fill with bright color first to test
        console.log('🎨 Step 1: Filling with bright red for testing');
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, width, height);
        
        // Now fill with actual background
        console.log('🎨 Step 2: Adding actual background');
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);
        
        // Draw card background - use explicit RGB values
        console.log('🎨 Step 3: Drawing white card');
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(10, 10, width - 20, height - 20);
        
        // Draw header with explicit RGB
        console.log('🎨 Step 4: Drawing pink header');
        ctx.fillStyle = 'rgb(255, 107, 157)'; // #ff6b9d in RGB
        ctx.fillRect(10, 10, width - 20, 50);
        
        // Test if text rendering works - start with simple text
        console.log('🎨 Step 5: Testing text rendering');
        ctx.fillStyle = 'rgb(255, 255, 255)'; // White text
        ctx.font = '16px Arial';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        
        // Try to draw text
        try {
            ctx.fillText('Anonymous Message', width / 2, 35);
            console.log('✅ Header text drawn successfully');
        } catch (textError) {
            console.error('❌ Text drawing failed:', textError);
        }
        
        // Draw message content
        console.log('🎨 Step 6: Drawing message content');
        ctx.fillStyle = 'rgb(44, 62, 80)'; // Dark text
        ctx.font = '14px Arial';
        
        // Simple message - no fancy wrapping
        const displayMessage = message.length > 30 ? message.substring(0, 27) + '...' : message;
        try {
            ctx.fillText(displayMessage, width / 2, 100);
            console.log('✅ Message text drawn successfully');
        } catch (msgError) {
            console.error('❌ Message text failed:', msgError);
        }
        
        // Add footer
        console.log('🎨 Step 7: Adding footer');
        ctx.fillStyle = 'rgb(108, 117, 125)';
        ctx.font = '12px Arial';
        try {
            ctx.fillText('Sent anonymously', width / 2, 150);
            console.log('✅ Footer text drawn successfully');
        } catch (footerError) {
            console.error('❌ Footer text failed:', footerError);
        }
        
        // Generate the buffer
        console.log('📋 Converting to PNG...');
        const buffer = canvas.toBuffer('image/png');
        
        console.log('✅ Buffer generated! Size:', buffer.length, 'bytes');
        
        // Debug: Check if buffer has actual content by looking at first few bytes
        const firstBytes = Array.from(buffer.slice(0, 10)).map(b => b.toString(16).padStart(2, '0')).join(' ');
        console.log('🔍 First 10 bytes of PNG:', firstBytes);
        
        // Valid PNG should start with: 89 50 4E 47 0D 0A 1A 0A
        const validPngHeader = '89 50 4e 47 0d 0a 1a 0a';
        if (firstBytes.toLowerCase().startsWith(validPngHeader.toLowerCase())) {
            console.log('✅ PNG header is valid!');
        } else {
            console.log('⚠️ PNG header might be invalid. Expected:', validPngHeader, 'Got:', firstBytes);
        }
        
        return buffer;
        
    } catch (error) {
        console.error('❌ Main image generation failed:', error);
        console.error('Stack:', error.stack);
        
        // Super simple fallback - just rectangles, no text
        try {
            console.log('🔄 Creating minimal fallback image...');
            const canvas = createCanvas(300, 150);
            const ctx = canvas.getContext('2d');
            
            // Just draw colored rectangles
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 300, 150);
            
            ctx.fillStyle = 'blue';
            ctx.fillRect(0, 0, 300, 30);
            
            ctx.fillStyle = 'green';
            ctx.fillRect(10, 40, 280, 60);
            
            ctx.fillStyle = 'red';
            ctx.fillRect(10, 110, 280, 30);
            
            const buffer = canvas.toBuffer('image/png');
            console.log('✅ Minimal fallback created, size:', buffer.length);
            return buffer;
            
        } catch (fallbackError) {
            console.error('❌ Complete failure:', fallbackError);
            throw new Error('Cannot create any image: ' + fallbackError.message);
        }
    }
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

client.once('clientReady', async () => {
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
                    flags: 64 // Ephemeral flag
                });
            }
            
        } else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'anonymous_message_modal') {
                console.log('📝 Modal submitted by user:', interaction.user.tag);
                
                // Defer reply immediately to prevent timeout
                await interaction.deferReply({ flags: 64 }); // Ephemeral
                console.log('✅ Deferred reply sent');
                
                const messageContent = interaction.fields.getTextInputValue('message_content');
                console.log('💬 Message received (length:', messageContent.length, ')');
                
                // Send anonymous message to general channel
                const generalChannel = client.channels.cache.get(config.generalChannelId);
                if (generalChannel) {
                    console.log('📞 Found general channel:', generalChannel.name);
                    try {
                        console.log('🎨 Starting image generation...');
                        // Generate the NGL-style card image
                        const cardBuffer = await createAnonymousCard(messageContent);
                        
                        if (!cardBuffer || cardBuffer.length === 0) {
                            throw new Error('Generated image buffer is empty');
                        }
                        
                        console.log('✅ Image buffer created, size:', cardBuffer.length, 'bytes');
                        
                        const attachment = new AttachmentBuilder(cardBuffer, { 
                            name: 'anonymous-message.png',
                            description: 'Anonymous message card'
                        });
                        
                        console.log('📤 Sending image to channel...');
                        // Send the image card
                        const sentMessage = await generalChannel.send({ 
                            files: [attachment],
                            content: '📩 **New Anonymous Message**'
                        });
                        
                        console.log('✅ Message sent successfully! Message ID:', sentMessage.id);
                        
                        await interaction.editReply({
                            content: '✅ Your anonymous message has been sent successfully!'
                        });
                        
                    } catch (error) {
                        console.error('❌ Error in image generation/sending:', error);
                        console.error('Error stack:', error.stack);
                        await interaction.editReply({
                            content: '❌ Error: Failed to create message card. Please try again.\nError: ' + error.message
                        });
                    }
                } else {
                    console.error('❌ General channel not found! ID:', config.generalChannelId);
                    await interaction.editReply({
                        content: '❌ Error: Could not find the general channel.'
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
                    flags: 64 // Ephemeral
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