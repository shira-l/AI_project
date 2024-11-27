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
              "and I want you to return to me a Business characterization document." +
              "Return me the document in a json format, " +
              "One key should be the title, then sub-title then content, and then the next sub-title and content ext." +
              "The json should have also a key of name- that you offer, and shouldnt include a logo." +
              "Manage with the information I give you dont ask questions and dont send eny thing else exept for the json. Ok?"
          }],
        },
        {
          role: "model",
          parts: [{ text: "Absolutely! No problem. Just send me information." }],
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
    const objectString=
    console.log(characterizationText)
    const resLogo = await chat.sendMessage("Give me a logo for my company in a img format.");

    // יצירת מסמך PDF
    const doc = new PDFDocument();
    const pdfPath = 'example.pdf';
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // כתיבת תוכן למסמך PDF
    doc
      .fontSize(20)
      .text('Business Characterization Document', { align: 'center',underline:true, })
      .moveDown()
      .fontSize(20)
      .text('Business Characterization Document', { align: 'center' })
      .fontSize(12)
      .text(characterizationText.name, { align: 'left' })
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
