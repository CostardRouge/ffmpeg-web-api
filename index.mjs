import express from 'express';
import ffmpeg from 'fluent-ffmpeg';

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());

app.post('/api/convert', (req, res) => {
    // Extract input parameters from the request
    const { inputs, inputOptions, outputOptions } = req.body;

    console.log(req.body);

    // Initialize FFmpeg command
    const command = ffmpeg();

    // Add inputs
    inputs.forEach( input => command.input( input ) );

    // Set input options
    if ( inputOptions ) {
        inputOptions.forEach( inputOption => command.inputOptions( inputOption ) );
    }

    // Set output options
    if ( outputOptions ) {
        outputOptions.forEach( outputOption => command.outputOptions( outputOption ) );
    }

    command.output("/tmp/output.mp4");

    command
        .on('start', commandLine => {
            console.log('FFmpeg command:', commandLine);
        })
        .on('error', (err, stdout, stderr) => {
            console.error('FFmpeg error:', err.message);
            console.error({
                stdout, stderr
            });
            res.status(500).json({ error: 'Internal server error' });
        })
        .on('end', () => {
            console.log('Conversion complete');

            res
                .status(200)
                .sendFile("/tmp/output.mp4");
        });

    // Stream output to response
    // command.pipe(res, { end: false });
    command.run()
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
