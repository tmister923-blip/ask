# 🚀 Deploying to Render.com

This guide will help you deploy your Discord bot to Render.com for free hosting.

## 📋 Prerequisites

1. **GitHub Account** - Your code needs to be in a GitHub repository
2. **Discord Bot Token** - From Discord Developer Portal
3. **Render.com Account** - Sign up at [render.com](https://render.com)

## 🔧 Step-by-Step Deployment

### 1. Upload to GitHub

1. Create a new repository on GitHub
2. Upload all your bot files to the repository
3. Make sure `.env` is NOT uploaded (it's in `.gitignore`)

### 2. Connect to Render

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account and select your bot repository
4. Choose the repository containing your bot code

### 3. Configure the Service

**Basic Settings:**
- **Name**: `anonymous-discord-bot` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 4. Set Environment Variables

In the Render dashboard, go to **"Environment"** tab and add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Automatically set |
| `PORT` | `1000` | HTTP server port for Render |
| `DISCORD_BOT_TOKEN` | `your_actual_bot_token` | ⚠️ Keep this secret! |
| `CLIENT_ID` | `your_bot_client_id` | From Discord Developer Portal |
| `PANEL_CHANNEL_ID` | `1422585282112389162` | Already configured |
| `GENERAL_CHANNEL_ID` | `1409108686869364778` | Already configured |
| `SUPPORT_URL` | `https://guns.lol/i_q` | Already configured |

### 5. Deploy

1. Click **"Create Web Service"**
2. Render will automatically build and deploy your bot
3. Check the logs to ensure successful deployment
4. Your bot should come online in Discord

## 🔐 Getting Your Discord Bot Token

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application (or create one)
3. Go to **"Bot"** section
4. Under **"Token"**, click **"Reset Token"** and copy the new token
5. **Important**: Keep this token secret and never share it publicly

## 📊 Monitoring Your Bot

### Render Dashboard Features:
- **Logs**: View real-time bot logs
- **Metrics**: CPU and memory usage
- **Events**: Deployment history
- **Settings**: Update environment variables

### Logs to Watch For:
```
✅ Bot is ready! Logged in as YourBot#1234
New panel message created
Panel message updated successfully
```

## 🛠️ Troubleshooting

### Common Issues:

**1. Build Failures:**
- Check if `package.json` is in the root directory
- Ensure Node.js version compatibility (>=18.0.0)
- Verify all dependencies are listed correctly

**2. Bot Not Starting:**
- Check environment variables are set correctly
- Verify Discord bot token is valid
- Review logs for specific error messages

**3. Bot Offline in Discord:**
- Confirm `DISCORD_BOT_TOKEN` is correct
- Check if bot has been added to your server
- Verify bot permissions in Discord

**4. Panel Not Appearing:**
- Check `PANEL_CHANNEL_ID` is correct
- Ensure bot has permissions in the channel
- Verify channel exists and bot can access it

### Render-Specific Tips:

- **Free Plan Limitations**: 
  - Service sleeps after 15 minutes of inactivity
  - 750 hours/month usage limit
  - Service wakes up automatically when needed

- **Keeping Bot Active**:
  - Consider upgrading to a paid plan for 24/7 uptime
  - Or use external ping services (though not recommended for Discord bots)

## 🔄 Updating Your Bot

1. Push changes to your GitHub repository
2. Render will automatically detect changes and redeploy
3. Monitor logs during deployment
4. Bot will restart with new changes

## 📈 Scaling (Paid Plans)

For larger servers, consider upgrading to:
- **Starter Plan** ($7/month): 24/7 uptime, better performance
- **Pro Plan** ($25/month): More resources, faster scaling

## 🆘 Support

If you encounter issues:
1. Check Render's [documentation](https://render.com/docs)
2. Review Discord bot logs in Render dashboard
3. Verify all environment variables are correctly set
4. Ensure Discord bot has proper server permissions

## 📋 Deployment Checklist

- [ ] Code uploaded to GitHub repository  
- [ ] `.env` file not committed (check `.gitignore`)
- [ ] Render service created and connected to GitHub
- [ ] All environment variables set in Render dashboard
- [ ] Build and start commands configured correctly
- [ ] Discord bot token is valid and secret
- [ ] Bot added to Discord server with proper permissions
- [ ] Deployment successful (check logs)
- [ ] Bot online and panel created in Discord

Your Discord bot should now be running 24/7 on Render.com! 🎉