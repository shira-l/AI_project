import dotenv from 'dotenv'
dotenv.config()
import {pdfFileRouter} from './routers/pdfFileRouter.js'
import {webPageRouter} from './routers/webPageRouter.js'
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use(pdfFileRouter);
app.use(webPageRouter);
//=========================
app.listen(3001, function () {
    console.log('My app is listening on port 3001!');
});

