const express = require('express');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');

const app = express();
const PORT = 3000;

ffmpeg.setFfmpegPath(ffmpegPath);

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/views/index.html')));
app.get('/video', (req, res) => res.sendFile(path.join(__dirname, '/views/video.html')));
app.get('/audio', (req, res) => res.sendFile(path.join(__dirname, '/views/audio.html')));

// Video Download
app.post('/download-video', (req, res) => {
  const videoURL = req.body.url;
  res.header('Content-Disposition', 'attachment; filename="video.mp4"');
  ytdl(videoURL, { format: 'mp4' }).pipe(res);
});

// Audio Download
app.post('/download-audio', (req, res) => {
  const videoURL = req.body.url;
  const stream = ytdl(videoURL, { quality: 'highestaudio' });
  res.header('Content-Disposition', 'attachment; filename="audio.mp3"');

  ffmpeg(stream)
    .audioBitrate(128)
    .toFormat('mp3')
    .pipe(res, { end: true });
});

// Start Server
app.listen(PORT, () => console.log(`✅ Running at http://localhost:${PORT}`));
