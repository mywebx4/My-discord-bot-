require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const { GoogleGenAI } = require('@google/genai');
const fetch = require('node-fetch');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const serverDirectory = {
    animation: ["https://discord.gg/animation1", "https://discord.gg/animeHub", "https://discord.gg/toons2026"],
    gaming: ["https://discord.gg/gamerZone", "https://discord.gg/epicGames", "https://discord.gg/playtogether"],
    coding: ["https://discord.gg/devs", "https://discord.gg/codersHub"]
};

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const commands = [
        new SlashCommandBuilder()
            .setName('servers')
            .setDescription('Get a list of Discord server invites by category')
            .addStringOption(option =>
                option.setName('category')
                    .setDescription('The category (e.g., animation, gaming, coding)')
                    .setRequired(true))
            .addIntegerOption(option =>
                option.setName('amount')
                    .setDescription('How many servers do you need?')
                    .setRequired(false)),

        new SlashCommandBuilder()
            .setName('curseforge')
            .setDescription('Search for a mod/game on CurseForge and fetch its links')
            .addStringOption(option =>
                option.setName('query')
                    .setDescription('Name of the game or mod')
                    .setRequired(true)),

        new SlashCommandBuilder()
            .setName('chat')
            .setDescription('Chat with the AI assistant (ChatGPT style)')
            .addStringOption(option =>
                option.setName('prompt')
                    .setDescription('What do you want to ask?')
                    .setRequired(true))
    ];

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
        console.log('Successfully registered global slash commands.');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'servers') {
        const category = interaction.options.getString('category').toLowerCase();
        const amount = interaction.options.getInteger('amount') || 5;

        if (!serverDirectory[category]) {
            return interaction.reply({ content: `❌ Category not found! Available categories: ${Object.keys(serverDirectory).join(', ')}`, ephemeral: true });
        }

        const links = serverDirectory[category].slice(0, amount);
        return interaction.reply(`📂 **Here are ${links.length} server(s) for ${category}:**\n` + links.join('\n'));
    }

    else if (commandName === 'curseforge') {
        const query = interaction.options.getString('query');
        await interaction.deferReply();

        try {
            return interaction.editReply(`🔍 Searched CurseForge for **${query}**.\nCheck out results on the main site: https://www.curseforge.com/search?search=${encodeURIComponent(query)}`);
        } catch (err) {
            return interaction.editReply('❌ Error fetching data from CurseForge.');
        }
    }

    else if (commandName === 'chat') {
        const userPrompt = interaction.options.getString('prompt');
        await interaction.deferReply();

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: userPrompt,
            });

            return interaction.editReply(`🤖 **AI Response:**\n${response.text}`);
        } catch (error) {
            console.error(error);
            return interaction.editReply('❌ Sorry, I encountered an error talking to the AI engine.');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
