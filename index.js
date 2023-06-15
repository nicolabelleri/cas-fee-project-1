
import dotenv from "dotenv";

// load config-file
dotenv.config({ path: `.env${process.env.NODE_ENV ? `-${process.env.NODE_ENV}` : ''}`});

// load app with current config
const app = (await import('./app.js')).app;

const port = 3000;
const hostname = 'localhost';

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});