import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import PDFDocument from 'pdfkit'
//import PDFDocument from 'pdf-lib'
export async function createCharacterizationFile(req, res) {
    const businessDetails = req.body;
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{
                    text: "I want to open a new business. " +
                        "I want to give you category, my business idea, the purpose of the business and a description " +
                        "and I want you to return to me a Business characterization document for. Ok?"
                }],
            },
            {
                role: "model",
                parts: [{ text: "Absolutely! no problem. send me the information." }],
            },
        ],
    });
    console.log(businessDetails);
    let resText = await chat.sendMessage(`my business information: name: ${businessDetails.name}
         email: ${businessDetails.email} companyType: ${businessDetails.companyType} description:
     ${businessDetails.description} purpose: ${businessDetails.purpose} aboute: ${businessDetails.aboute}.`);
    console.log(resText.response.text());
    let resLogo = await chat.sendMessage('can you give me a logo for my company');
    console.log(resLogo.response.text());
    const result = { 'text': `${resText.response.text()}`, 'logo': `${resLogo.response.text()}` }


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
 //   const text = result.response.text().toString();
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
        .text(result.text, 100, 100);



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
}