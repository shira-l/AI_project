
import { targil1 } from './callsToGemini.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv'
dotenv.config()
import fs from "fs";
import readline from 'readline';
//import { PDFDocument } from "pdf-lib";
import PDFDocument from 'pdfkit'


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
    //     page.drawText(result.response.text(), {
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
    // const doc = new PDFDocument();

    // // Pipe its output somewhere, like to a file or HTTP response
    // // See below for browser usage
    // doc.pipe(fs.createWriteStream('./output.pdf'));

    // // Embed a font, set the font size, and render some text
    // doc
    //     .fontSize(25)
    //     .text('Some text with an embedded font!', 100, 100);

    // // Add an image, constrain it to a given size, and center it vertically and horizontally
    // // doc.image('path/to/image.png', {
    // //   fit: [250, 300],
    // //   align: 'center',
    // //   valign: 'center'
    // // });

    // // Add another page
    // doc
    //     .addPage()
    //     .fontSize(25)
    //     .text('Here is some vector graphics...', 100, 100);

    // // Draw a triangle
    // doc
    //     .save()
    //     .moveTo(100, 150)
    //     .lineTo(100, 250)
    //     .lineTo(200, 250)
    //     .fill('#FF3300');

    // // Apply some transforms and render an SVG path with the 'even-odd' fill rule
    // doc
    //     .scale(0.6)
    //     .translate(470, -380)
    //     .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
    //     .fill('red', 'even-odd')
    //     .restore();

    // // Add some text with annotations
    // doc
    //     .addPage()
    //     .fillColor('blue')
    //     .text('Here is a link!', 100, 100)
    //     .underline(100, 100, 160, 27, { color: '#0000FF' })
    //     .link(100, 100, 160, 27, 'http://google.com/');

    // // Finalize PDF file
    // doc.end();
    // return res.sendFile( path.join( __dirname + 'output.pdf' ));
})