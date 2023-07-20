# Discord Real Time Whisper Transcription

This is a Discord bot using OpenAI's [Whisper](https://github.com/openai/whisper) speech to text model. It transcribes the speech of all users in a channel.

To install with Docker run
```
sudo apt-get install nvidia-container-runtime
docker build -t whisperbot .
docker run -p 5000:5000 --gpus all -it whisperbot
```