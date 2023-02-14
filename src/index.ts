import express, { Express, Request, Response,  } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const port = ((): number => {
    if (undefined === process.env.PORT) {
        return 3000;
    }

    const port = parseInt(process.env.PORT);

    if (! Number.isNaN(port) && port >= 1000 && port <= 60000) {
        return port;
    }

    throw new Error('PORT variable is not valid. refusing to start');
})();

const app: Express = express();

app.get('/', async (req: Request, res: Response) => {
    res.send('It works!');
});

const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at 0.0.0.0:${port}`);

    server.on('close', () => {
        console.log('Server terminated');
    });

    [
        'SIGINT',  // Ctrl+C
        'SIGTERM', // docker
    ].forEach(handledSignal => process.once(handledSignal, async (receivedSignal:string) => {
        console.log(`Received ${receivedSignal}, shutting down`);
        await server.close();
        process.exit(0);
    }));
});
