import express from 'express';
import ffmpeg from 'fluent-ffmpeg';

const app = express();
const PORT = process.env.PORT || 3333;
const HOST = process.env.HOST || '127.0.0.1';

app.use(express.json());

app.disable('x-powered-by');

const handleCommand = ( options, response ) => {
    // Initialize FFmpeg command
    const command = ffmpeg();

    return new Promise((resolve, reject) => {
        for (const [optionName, optionValue] of Object.entries(options)) {
            switch (typeof optionValue) {
                case "object": // array
                    optionValue.forEach( value => command?.[optionName]( value ) );
                    break;
                default: // string, number
                    command?.[optionName](optionValue)
                    break;
            }
        }
    
        command
            .on('start', commandLine => {
                console.log('conversion start:', commandLine);
            })
            .on('error', ( error , stdout, stderr ) => {
                console.error('conversion error:', { stdout, stderr, error });
                reject( error )
            })
            .on('end', resolve )
            .pipe( response, { end: true } );
    });
}

app.post('/api', ( request, response ) => {
    // Extract input parameters from the request
    const { contentType = "video/mp4", ...options } = request.body;

    // Debug
    console.log( request.body );

    // Assuming MP4 format for the example
    response.contentType(contentType);

    // Run ffmpeg command
    handleCommand( options, response )
        .then( () => console.log('conversion end.') )
        .catch( error => response.status(500).json({ error: error.message }))
});

app.listen(PORT, HOST, () => {
    console.log(`ffmpeg-web-api: POST http://${HOST}:${PORT}/api`);
});
