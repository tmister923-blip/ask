const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits, AttachmentBuilder } = require('discord.js');
const http = require('http');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
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
    console.log('🎨 Starting image generation with @napi-rs/canvas for message:', message.substring(0, 30) + '...');
    
    try {
        const width = 500;
        const height = 300;
        console.log('🔍 Creating canvas:', width, 'x', height);
        
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        
        console.log('✅ Canvas and context created successfully');
        
        // Fill entire background with light gray
        console.log('🎨 Step 1: Drawing background');
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, width, height);
        
        // Draw main card (white background)
        console.log('🎨 Step 2: Drawing card background');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(20, 20, width - 40, height - 40);
        
        // Add card border
        console.log('🎨 Step 3: Adding card border');
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 2;
        ctx.strokeRect(20, 20, width - 40, height - 40);
        
        // Draw header background
        console.log('🎨 Step 4: Drawing header');
        ctx.fillStyle = '#ff69b4'; // Hot pink
        ctx.fillRect(20, 20, width - 40, 80);
        
        // Header text
        console.log('🎨 Step 5: Adding header text');
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        try {
            ctx.fillText('🎭 Anonymous Message', width / 2, 50);
            ctx.font = '14px Arial';
            ctx.fillText('💌 Shared anonymously', width / 2, 75);
            console.log('✅ Header text rendered successfully');
        } catch (textError) {
            console.error('❌ Header text failed:', textError);
        }
        
        // Message content
        console.log('🎨 Step 6: Adding message content');
        ctx.fillStyle = '#333333';
        ctx.font = '16px Arial';
        
        // Simple text display (no complex wrapping)
        const maxLength = 50;
        const displayText = message.length > maxLength ? message.substring(0, maxLength - 3) + '...' : message;
        
        try {
            ctx.fillText(displayText, width / 2, 160);
            console.log('✅ Message text rendered successfully');
        } catch (msgError) {
            console.error('❌ Message text failed:', msgError);
        }
        
        // Footer
        console.log('🎨 Step 7: Adding footer');
        ctx.fillStyle = '#666666';
        ctx.font = '12px Arial';
        
        try {
            ctx.fillText('React with 💝 to show support', width / 2, 220);
            console.log('✅ Footer text rendered successfully');
        } catch (footerError) {
            console.error('❌ Footer text failed:', footerError);
        }
        
        // Convert to buffer
        console.log('📋 Converting canvas to PNG buffer...');
        const buffer = canvas.encode('png');
        
        console.log('✅ PNG buffer created! Size:', buffer.length, 'bytes');
        
        // Validate PNG header
        if (buffer.length > 8) {
            const pngSignature = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
            const isValidPng = pngSignature.every((byte, index) => buffer[index] === byte);
            
            if (isValidPng) {
                console.log('✅ Valid PNG signature detected!');
            } else {
                console.log('⚠️ PNG signature validation failed');
                console.log('Expected:', pngSignature.map(b => '0x' + b.toString(16)).join(' '));
                console.log('Got:', Array.from(buffer.slice(0, 8)).map(b => '0x' + b.toString(16)).join(' '));
            }
        }
        
        return buffer;
        
    } catch (mainError) {
        console.error('❌ Main image generation failed:', mainError);
        console.error('Error details:', mainError.message);
        console.error('Stack trace:', mainError.stack);
        
        // Ultimate fallback - create the simplest possible image
        try {
            console.log('🔄 Attempting ultra-simple fallback...');
            
            const simpleCanvas = createCanvas(400, 200);
            const simpleCtx = simpleCanvas.getContext('2d');
            
            console.log('✅ Fallback canvas created');
            
            // Draw simple colored rectangles (no text)
            simpleCtx.fillStyle = '#ffffff';
            simpleCtx.fillRect(0, 0, 400, 200);
            
            simpleCtx.fillStyle = '#ff69b4';
            simpleCtx.fillRect(0, 0, 400, 50);
            
            simpleCtx.fillStyle = '#e0e0e0';
            simpleCtx.fillRect(20, 70, 360, 80);
            
            simpleCtx.fillStyle = '#666666';
            simpleCtx.fillRect(20, 170, 360, 20);
            
            console.log('✅ Fallback shapes drawn');
            
            const fallbackBuffer = simpleCanvas.encode('png');
            console.log('✅ Fallback image created! Size:', fallbackBuffer.length, 'bytes');
            
            return fallbackBuffer;
            
        } catch (fallbackError) {
            console.error('❌ Even fallback failed:', fallbackError);
            
            // Return text-based response as final resort
            throw new Error('Image generation completely failed. Canvas library may not be working on this server.');
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