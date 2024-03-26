# FFmpeg Web API

This project provides a simple web API for executing FFmpeg commands on video and audio files, leveraging the power of `fluent-ffmpeg` and `express`. It allows clients to send FFmpeg command options in a JSON format via a POST request, making it easy to integrate video and audio processing features into web applications.

## 0. Prerequisites

- Node.js (version 14 or higher)
- FFmpeg installed on your system
- npm (for installing Node.js dependencies) # or docker

## 1. Installation

### 1.1 Docker
```bash
curl -X POST http://localhost:3333/api \
     -H "Content-Type: application/json" \
     -d '{"contentType": "video/mp4", "input": "input.mp4", "vf": ["scale=320:240"], "outputOptions": ["-c:v libx264"]}'
```

### 1.2 Local
```bash
git clone https://github.com/CostardRouge/ffmpeg-web-api.git
cd ffmpeg-web-api
npm install
npm run start # or node index.js
```

## 2. Usage

To use the API, send a POST request to /api with a JSON body containing the FFmpeg command options you wish to execute. The request should also include a contentType field to specify the output format.

```
curl -X POST http://localhost:3333/api \
     -H "Content-Type: application/json" \
     -d "{
            'outputOptions': [ '-movflags frag_keyframe+empty_moov', '-c:a aac', '-b:a 128k' ],
            'input': [
                'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
                'http://codeskulptor-demos.commondatastorage.googleapis.com/descent/gotitem.mp3'
            ],
            'inputOptions': [ '-r 60' ],
            'format': 'mp4',
            'contentType': 'video/mp4'
        }"
```

### 2.1 Response
The response will be the processed media stream, according to the specified contentType and FFmpeg options.

## 3. Contributing
Contributions are welcome! Please feel free to submit a pull request.

