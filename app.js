import express from 'express';
import bodyParser from 'body-parser';
import path, {dirname} from 'path';
import {fileURLToPath} from "url";
import {noteRoutes} from './routes/note-routes.js';


const __dirname = dirname(fileURLToPath(import.meta.url));

export const app = express();

app.use(express.static(path.resolve('public')));

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile("/html/index.html", {root: `${__dirname  }/public/`});
});

app.use("/notes", noteRoutes);

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('No token / Invalid token provided');
    } else {
        next(err);
    }
});
