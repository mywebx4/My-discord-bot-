# Multi-Tool Discord Bot

A multi-utility Discord bot hosted on Discloud featuring server invite directory search, CurseForge gaming lookup, and AI-powered chat interactions.

## Features
- **Server Directory (`/servers`):** Get curated server invite links by category (e.g., animation, gaming, coding).
- **CurseForge Search (`/curseforge`):** Search for game mods and community server details.
- **AI Chat (`/chat`):** Ask questions and get conversational AI answers powered by Google Gemini.

## Project Structure
- `index.js`: Main bot logic and command handlers.
- `package.json`: Project dependencies (`discord.js`, `@google/genai`, `dotenv`, `node-fetch`).
- `discloud.config`: Discloud hosting configuration.

## Environment Variables
The following keys must be set in your Discloud Environment Settings:
- `DISCORD_TOKEN`: Your Discord Application Bot Token.
- `GEMINI_API_KEY`: Your Google AI Studio API Key.
- 
