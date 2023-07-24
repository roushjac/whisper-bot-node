const { Client } = require('discord.js');
const { EndBehaviorType, joinVoiceChannel } = require('@discordjs/voice')
const prism = require('prism-media');
const { pipeline } = require('node:stream');
const process = require('node:process');
const { createWriteStream } = require('node:fs');
require('dotenv').config();

const client = new Client({ intents: ["GUILDS", "GUILD_VOICE_STATES", "GUILD_MESSAGES"] });

client.once('ready', () => {
    console.log('Ready!');
});

client.on('messageCreate', async message => {
    if (!message.guild) return;
    if (message.content === '!join WhisperBot') {
        if (message.member.voice.channel) {
            const voiceConnection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.member.voice.channel.guild.id,
                adapterCreator: message.member.voice.channel.guild.voiceAdapterCreator,
                selfDeaf: false,
                selfMute: false,
            });
            const receiver = voiceConnection.receiver;
            // const audio = receiver.createStream(message.member.voice.id)

            const opusStream = receiver.subscribe(userId=message.member.id, {
                end: {
                    behavior: EndBehaviorType.AfterSilence,
                    duration: 100,
                },
            });
        
            // const oggStream = new prism.opus.OggLogicalBitstream({
            //     opusHead: new prism.opus.OpusHead({
            //         channelCount: 2,
            //         sampleRate: 48000,
            //     }),
            //     pageSizeControl: {
            //         maxPackets: 10,
            //     },
            // });

            const filename = `./recordings/${Date.now()}.mp3`;

            const out = createWriteStream(filename);

            console.log(`👂 Started recording ${filename}`);
        
            pipeline(opusStream, out, (err) => {
                if (err) {
                    console.warn(`❌ Error recording file ${filename} - ${err.message}`);
                } else {
                    console.log(`✅ Recorded ${filename}`);
                }
            });

            // voiceConnection.on('speaking', (user, speaking) => {
            //     if (speaking) {
            //         console.log("speaking")
            //         const audioStream = receiver.createStream(user, { mode: 'pcm' });
            //         const outputStream = new prism.opus.Decoder({ rate: 48000, channels: 2, frameSize: 960 });
            //         audioStream.pipe(outputStream).on('data', console.log);
            //     }
            // });

        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
});

client.login(`${process.env.BOT_TOKEN}`);
