# Anonymous Discord Bot

A Discord bot that creates a persistent panel for sending anonymous messages with NGL-style embeds. Perfect for communities that want to allow anonymous feedback and messages.

## ✨ Features

- **Persistent Panel**: Automatically creates and maintains a panel message with buttons
- **Anonymous Messages**: Users can send anonymous messages through a modal interface
- **NGL-Style Embeds**: Beautiful, card-like messages with gradient colors and clean styling
- **Support Integration**: Direct support button with custom URL
- **Auto-Recovery**: If the panel is deleted, the bot automatically recreates it
- **Multi-Language Support**: Supports both Arabic and English text
- **Error Handling**: Comprehensive error handling and logging

## 🚀 Setup Instructions

### Prerequisites

1. **Node.js**: Download and install Node.js from [nodejs.org](https://nodejs.org/)
2. **Discord Bot**: Create a Discord application and bot at [Discord Developer Portal](https://discord.com/developers/applications)

### Installation Steps

1. **Clone or download this project** to your desired directory

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Fill in your bot token and configuration:
   ```env
   DISCORD_BOT_TOKEN=your_bot_token_here
   CLIENT_ID=your_bot_client_id_here
   PANEL_CHANNEL_ID=1422585282112389162
   GENERAL_CHANNEL_ID=1409108686869364778
   SUPPORT_URL=https://guns.lol/i_q
   ```

4. **Bot Permissions**:
   Ensure your bot has the following permissions:
   - Send Messages
   - Embed Links
   - Use Slash Commands
   - View Channels
   - Read Message History

5. **Run the bot**:
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

## ☁️ Deploy to Render.com

**For cloud hosting (recommended):**

1. Upload your code to GitHub (without the `.env` file)
2. Sign up at [render.com](https://render.com)
3. Create a new Web Service connected to your GitHub repo
4. Set the environment variables in Render's dashboard
5. Deploy automatically!

📖 **See `RENDER_DEPLOYMENT.md` for detailed deployment instructions**

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_BOT_TOKEN` | Your Discord bot token | ✅ |
| `CLIENT_ID` | Your Discord application client ID | ✅ |
| `PANEL_CHANNEL_ID` | Channel ID where the panel will be posted | ✅ |
| `GENERAL_CHANNEL_ID` | Channel ID where anonymous messages will be sent | ✅ |
| `SUPPORT_URL` | URL for the support button | ✅ |

### Channel Setup

1. **Panel Channel**: The bot will create a persistent panel in this channel
2. **General Channel**: Anonymous messages will be posted here
3. Make sure the bot has appropriate permissions in both channels

## 🎨 Features Explained

### Persistent Panel
- Creates an attractive panel with two buttons
- Automatically recreates if deleted
- Checks every 5 minutes to ensure it exists
- Beautiful embed with gradient colors and emojis

### Anonymous Messaging
- Users click "Send a Message" button
- Modal popup for message input
- Supports up to 2000 characters
- Works with Arabic and English text
- Messages are posted with beautiful NGL-style embeds

### Support Integration
- Support button redirects to your specified URL
- Private response (only visible to the user who clicked)

## 🛠️ Troubleshooting

### Common Issues

1. **Bot not responding**: 
   - Check if the bot token is correct
   - Ensure bot has necessary permissions
   - Check if bot is online in your server

2. **Panel not appearing**:
   - Verify the panel channel ID is correct
   - Check bot permissions in the channel
   - Look at console logs for errors

3. **Anonymous messages not sending**:
   - Verify the general channel ID is correct
   - Check bot permissions in the general channel
   - Ensure the channel exists and bot can access it

### Bot Permissions Checklist
- ✅ View Channels
- ✅ Send Messages
- ✅ Embed Links
- ✅ Use External Emojis (optional, for better appearance)
- ✅ Read Message History

## 📝 Code Structure

- `index.js` - Main bot file with all functionality
- `.env` - Environment variables (create from `.env.example`)
- `package.json` - Dependencies and scripts
- `README.md` - This documentation

## 🔒 Security & Privacy

- Messages are truly anonymous - no user data is stored or logged
- Only the message content is processed and forwarded
- Bot uses ephemeral responses to keep interactions private
- No persistent storage of user information

## 📄 License

MIT License - feel free to modify and use as needed.

## 🆘 Support

If you need help setting up the bot or encounter any issues, please check the troubleshooting section above or contact support through the configured support URL.