const { Client } = require('discord.js');
const { EndBehaviorType, joinVoiceChannel } = require('@discordjs/voice')
const prism = require('prism-media');
const process = require('node:process');
const wrtc = require('wrtc');
const { WebSocketServer } = require('ws')
require('dotenv').config();

const wss = new WebSocketServer({ port: 8080 });

const client = new Client({ intents: ["GUILDS", "GUILD_VOICE_STATES", "GUILD_MESSAGES"] });

client.once('ready', () => {
    console.log('Ready!');
});

client.on('messageCreate', async message => {
    if (!message.guild) return;
    if (message.content === '!j') {
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

            global.opusStream = receiver.subscribe(userId=message.member.id, {
                end: {
                    behavior: EndBehaviorType.Manual,
                },
            });
        
            

        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
})


wss.on('connection', ws => {

    console.log("connected on websockets")

    let pc = new wrtc.RTCPeerConnection();
  
    pc.onicecandidate = event => {
      if (event.candidate) {
        ws.send(JSON.stringify({
          type: 'candidate',
          candidate: event.candidate
        }));
      }
    };
  
    const audioSource = new wrtc.nonstandard.RTCRtpSender(global.opusStream, {
      mimeType: 'audio/pcm',
      clockRate: 48000,
      channels: 2
    });
  
    // Add the audio source to the peer connection
    pc.addTrack(audioSource.track);
  
    ws.on('message', async message => {
      let msg = JSON.parse(message);
  
      if (msg.type === 'offer') {
        await pc.setRemoteDescription(new wrtc.RTCSessionDescription(msg.offer));
        let answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
  
        ws.send(JSON.stringify({
          type: 'answer',
          answer: pc.localDescription
        }));
      } else if (msg.type === 'candidate') {
        await pc.addIceCandidate(new wrtc.RTCIceCandidate(msg.candidate));
      }
    });
  });






client.login(`${process.env.BOT_TOKEN}`);
