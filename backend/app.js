
import { targil1 } from './callsToGemini.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv'
dotenv.config()
import fs from "fs";
import readline from 'readline';
import { PDFDocument } from "pdf-lib";


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
//=========================
app.listen(3001, function () {
    console.log('My app is listening on port 3001!');
});

app.post('/getCharacterizationFile', async (req, res) => {
    const businessDetails=req.body;
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    //const prompt = "add a logo. can you give me a file explaning what company does, \n a ibt aboute my company: my company does coaching for business managers to help them elevate their business \n we have the best coaches that give each manager personal time and each one gets guidenss in his own way \n offer a name for our company and atach a logo";
    const prompt = `add a logo. can you give me a file explaning what company does,
     \n a ibt aboute my company: ${businessDetails.descreption} \n
      ${businessDetails.purpose} \n 
      offer a name for our company and atach a logo`;

    const result = await model.generateContent(prompt);
    console.log(result.response.text());

    // Here we need to take result.response.text() and export it to pdf
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([1200, 1000]);
    page.drawText(result.response.text(), {
        x: 20,
        y: 950,        // Start the text higher up on the page
        size: 12,
        maxWidth: 1160 // Ensure the text doesn't exceed the page width minus margins
    });

    // Convert to bytes and send as response
    const pdfBytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=CoverLetter.pdf");
    return res.json({ file: Buffer.from(pdfBytes) });
})