import dotenv from "dotenv";

// load config-file
dotenv.config({ path: `.env${process.env.NODE_ENV ? `-${process.env.NODE_ENV}` : ''}`});

(async () => {
    const {app} = await import('./app.js');

    const port = 3000;
    const hostname = 'localhost';

    app.listen(port, hostname, () => {
        // eslint-disable-next-line no-console
        console.log(`Server running at http://${hostname}:${port}/`);
    });
})();