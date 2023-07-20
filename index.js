const { Client, Intents, VoiceReceiver } = require('discord.js');
const prism = require('prism-media');
require('dotenv').config()

const client = new Client({ intents: ["GUILDS", "GUILD_VOICE_STATES", "GUILD_MESSAGES"] });

client.once('ready', () => {
    console.log('Ready!');
});

client.on('messageCreate', async message => {
    if (!message.guild) return;
    if (message.content === '/join') {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            const receiver = connection.receiver;
            connection.on('speaking', (user, speaking) => {
                if (speaking) {
                    const audioStream = receiver.createStream(user, { mode: 'pcm' });
                    const outputStream = new prism.opus.Decoder({ rate: 48000, channels: 2, frameSize: 960 });
                    audioStream.pipe(outputStream).on('data', console.log);
                }
            });
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
});

client.login(`${process.env.BOT_TOKEN}`);
