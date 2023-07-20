# Discord Real Time Whisper Transcription

This is a Discord bot that can join a channel and stream the audio of all the users talking in that channel.

To install with Docker run
```
docker build -t whisperbot .
docker run -p 5000:5000 --gpus all -it whisperbot
```
