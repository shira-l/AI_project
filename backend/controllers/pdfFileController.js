import fs from "fs";
import PDFDocument from 'pdfkit';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function createCharacterizationFile(req, res) {
  const businessDetails = req.body;

  try {
    // חיבור לג'מיני ליצירת תוכן
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{
            text: "I want to open a new business. " +
              "I want to give you category, my business idea, the purpose of the business and a description, " +
              "and I want you to return to me a Business characterization document. Ok?"
          }],
        },
        {
          role: "model",
          parts: [{ text: "Absolutely! no problem. Send me the information  without '*' characters." }],
        },
      ],
    });

    // שליחת המידע לג'מיני
    const resText = await chat.sendMessage(`My business information: 
      Name: ${businessDetails.name}, 
      Email: ${businessDetails.email}, 
      Company Type: ${businessDetails.companyType}, 
      Description: ${businessDetails.description}, 
      Purpose: ${businessDetails.purpose}, 
      About: ${businessDetails.about}.`);

    // קבלת טקסט ותוכן לוגו
    const characterizationText = resText.response.text();
    const resLogo = await chat.sendMessage("Can you give me a logo for my company?");
    const logoText = resLogo.response.text();

    // יצירת מסמך PDF
    const doc = new PDFDocument();
    const pdfPath = 'example.pdf';
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // כתיבת תוכן למסמך PDF
    doc
      .fontSize(20)
      .text('Business Characterization Document', { align: 'center' })
      .moveDown()
      .fontSize(12)
      .text(characterizationText, { align: 'left' })
      .moveDown()
      .text('Logo Suggestion:', { align: 'left' })
      .fontSize(10)
      .text(logoText, { align: 'left' });

    doc.end();

    // שליחת המסמך ללקוח
    writeStream.on('finish', () => {
      res.download(pdfPath, 'SpecificationFile.pdf', (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).send('Error generating PDF');
        } else {
          fs.unlinkSync(pdfPath); // מחיקת הקובץ מהשרת לאחר ההורדה
        }
      });
    });
  } catch (error) {
    console.error('Error creating PDF:', error);
    res.status(500).send('Error creating PDF');
  }
}
