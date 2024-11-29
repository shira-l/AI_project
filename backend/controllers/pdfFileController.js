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
                        text: `I want to open a new business. 
              I want to give you category, my business idea, the purpose of the business and a description, 
              and I want you to return to me a Business characterization document.
              Return me the document in this json format, 
              The keys should be: 'title', 'subTitle1', 'sectionHeading1', 'text1', 'sectionHeading2','text2', 'subTitle2','sectionHeading3', 'text3'. ext.
              And values should be their content.
              Manage with the information I give you dont ask questions and dont send eny thing else exept for the json. Ok?`

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
        console.log(characterizationText)
        const pdfObject = JSON.parse(characterizationText.substring(characterizationText.indexOf('{'), characterizationText.lastIndexOf('}') + 1))
        console.log(pdfObject);

        const resName = await chat.sendMessage("Give me a name for my company. Give me only a name, nothing else");
        console.log(resName.response.text());
        let name = resName.response.text();
        name=name.replaceAll(' ', '');
        let com = '.com';
        const domain = name.concat(com);
        const url = `https://rdap.verisign.com/com/v1/domain/${domain}`;
        try {
            const response = await fetch(url);
            if (response.status === 200)
                console.log(`Domain "${domain}" is taken.`);
            else
                console.log(`Domain "${domain}" might be available.`);
        } catch (error) {
            if (error.response && error.response.status === 404)
                console.log(`Domain "${domain}" is available.`);
            else
                console.error(`Error checking domain:`, error.message);
        }

        // יצירת מסמך PDF
        const doc = new PDFDocument();
        const pdfPath = 'example.pdf';
        const writeStream = fs.createWriteStream(pdfPath);
        doc.pipe(writeStream);
        // כתיבת תוכן למסמך PDF
        for (const property in pdfObject) {
            if (property == "title") {
                doc
                    .fontSize(18)
                    .text(pdfObject[property], { align: 'center', underline: true, stroke: true })
                    .moveDown()
            }
            else if (property.includes("subTitle")) {
                doc
                    .fontSize(14)
                    .text(pdfObject[property], { align: 'left', underline: true, })
                    .moveDown(0.7)
            }
            else if (property.includes("sectionHeading")) {
                doc
                    .fontSize(12)
                    .text(`${pdfObject[property]}:`, { align: 'left' })
                    .moveDown(0.5)
            }
            else {
                doc
                    .fontSize(11)
                    .text(pdfObject[property], { align: 'left' })
                    .moveDown()
            }
        }


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
