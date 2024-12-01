import fs from "fs";
import PDFDocument from 'pdfkit';
import { GoogleGenerativeAI } from "@google/generative-ai";
import contentDisposition from 'content-disposition';

export async function createCharacterizationFile(req, res) {
    const businessDetails = req.body;

    try {
        // חיבור לג'מיני ליצירת תוכן
        const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chat = model.startChat();

        let resName = await chat.sendMessage(`I want to open a new business. 
                Give me a creative good name for my company. 
                Give me only a name, nothing else
                I want to give you category, my business idea, the purpose of the business and a description, 
                and I want you to return to me a company name.
                My business information: 
                Name: ${businessDetails.name}, 
                Email: ${businessDetails.email}, 
                Company Type: ${businessDetails.companyType}, 
                Description: ${businessDetails.description}, 
                Purpose: ${businessDetails.purpose}, 
                Information: ${businessDetails.information}.`);
        let passDomain = true;
        let com = '.com';
        let domain, name, domainName;
        let companyName;
        do {
            try {
                name = resName.response.text();
                domainName = name.replaceAll(' ', '');
                companyName = domainName;
                domain = domainName.concat(com);
                const url = `https://rdap.verisign.com/com/v1/domain/${domain}`;
                const response = await fetch(url);
                if (response.status === 200)
                    resName = await chat.sendMessage("Give me a different name for my company. Give me only a name, nothing else");
                else
                    passDomain = false;
            } catch (error) {
                if (error.response && error.response.status === 404)
                    passDomain = false;
                else {
                    console.error(`Error checking domain:`, error.message);
                    //resName = await chat.sendMessage("Give me a different name for my company. Give me only a name, nothing else");
                }
            }
        } while (passDomain);


        // שליחת המידע לג'מיני
        const resText = await chat.sendMessage(`
              Return to me a Business characterization document for my ${name} business, 
              The domain suggestion should be http://${domain},
              The document in this json format, 
              The keys should be: 'title', 'subTitle1', 'sectionHeading1', 'text1', 'sectionHeading2','text2', 'subTitle2','sectionHeading3', 'text3'. ext.
              And values should be their content.
              Manage with the information I gave you dont ask questions and dont send eny thing else exept for the json.`);


        // קבלת טקסט ותוכן לוגו
        const characterizationText = resText.response.text();
        console.log(characterizationText)
        const pdfObject = JSON.parse(characterizationText.substring(characterizationText.indexOf('{'), characterizationText.lastIndexOf('}') + 1))
        console.log(pdfObject);


        // יצירת מסמך PDF
        const doc = new PDFDocument();
        const pdfPath = `example.pdf`;
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
        // res.setHeader("content-disposition", contentDisposition(`${companyName}.pdf`));
        // שליחת המסמך ללקוח
        writeStream.on('finish', () => {
            writeStream.close();
            res.download(pdfPath, `${companyName}.pdf`, (err) => {
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
