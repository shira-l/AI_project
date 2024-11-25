
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv'
dotenv.config()
import fs from "fs";
import PDFDocument from 'pdfkit'
//import PDFDocument from 'pdf-lib'

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
    const businessDetails = req.body;
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log(businessDetails)
    //const prompt = "add a logo. can you give me a file explaning what company does, \n a ibt aboute my company: my company does coaching for business managers to help them elevate their business \n we have the best coaches that give each manager personal time and each one gets guidenss in his own way \n offer a name for our company and atach a logo";
    const prompt = `add a logo. can you give me a file explaning what company does,
     \n a ibt aboute my company: ${businessDetails.descreption} \n
      ${businessDetails.purpose} \n 
      offer a name for our company and atach a logo`;

    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    //1
    // Here we need to take result.response.text() and export it to pdf
    //     const pdfDoc = await PDFDocument.create();
    //     const page = pdfDoc.addPage([1200, 1000]);
    //     page.drawText('ghjghjgj', {
    //         x: 20,
    //         y: 950,        // Start the text higher up on the page
    //         size: 12,
    //         maxWidth: 1160 // Ensure the text doesn't exceed the page width minus margins
    //     });

    //     // Convert to bytes and send as response
    //     const pdfBytes = await pdfDoc.save();
    //     res.setHeader("Content-Type", "application/pdf");
    //     res.setHeader("Content-Disposition", "attachment; filename=CoverLetter.pdf");
    // //return res.json({file:pdfBytes})
    //    return res.json({ file: Buffer.from(pdfBytes) });
    // Create a new PDF document

    //2
    // Create a document
    // Filename - index.js

    // Importing modules

    // Create a document
    const doc = new PDFDocument();
    const text =result.response.text().toString();
    // Saving the pdf file in root directory.
    doc.pipe(fs.createWriteStream('example.pdf'));

    // Adding functionality
    doc
        .fontSize(27)
        .text('This the article for GeeksforGeeks', 100, 100);

    // // Adding an image in the pdf.

    // doc.image('download3.jpg', {
    //     fit: [300, 300],
    //     align: 'center',
    //     valign: 'center'
    // });

    doc
        .addPage()
        .fontSize(15)
        .text(text);



    // Apply some transforms and render an SVG path with the 
    // 'even-odd' fill rule
    doc
        .scale(0.6)
        .translate(470, -380)
        .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
        .fill('red', 'even-odd')
        .restore();

    // Add some text with annotations
    doc
        .addPage()
        .fillColor('blue')
        .text('The link for GeeksforGeeks website', 100, 100)
        .link(100, 100, 160, 27, 'https://www.geeksforgeeks.org/');

    // Finalize PDF file
    doc.end();
    return res.download('example.pdf');
})