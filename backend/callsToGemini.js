import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv'
dotenv.config()
import fs from "fs";
import readline from 'readline';
import { PDFDocument } from "pdf-lib";


// Make sure to include these imports:
// import { GoogleGenerativeAI } from "@google/generative-ai";
export async function targil1(req, res) {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "add a logo. can you give me a file explaning what company does, \n a ibt aboute my company: my company does coaching for business managers to help them elevate their business \n we have the best coaches that give each manager personal time and each one gets guidenss in his own way \n offer a name for our company and atach a logo";

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
    return res.send({ data: Buffer.from(pdfBytes) });


}
//targil1();

async function targil2() {
    // Make sure to include these imports:
    // import { GoogleGenerativeAI } from "@google/generative-ai";
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    function fileToGenerativePart(path, mimeType) {
        return {
            inlineData: {
                data: Buffer.from(fs.readFileSync(path)).toString("base64"),
                mimeType,
            },
        };
    }

    const prompt = "There are nine squres containing images,describe me whats in each";
    // Note: The only accepted mime types are some image types, image/*.
    const imagePart = fileToGenerativePart(
        `captcha.png`,
        "image/png",
    );

    const result = await model.generateContent([prompt, imagePart]);
    console.log(result.response.text());
}
//targil2();

async function targil3() {
    // Make sure to include these imports:
    // import { GoogleGenerativeAI } from "@google/generative-ai";
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Write a story about a magic backpack.";

    const result = await model.generateContentStream(prompt);

    // Print text as it comes in.
    for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        let array = chunkText.split(" ");
        for (let i = 0; i < array.length; i++) {
            // setTimeout(()=>{process.stdout.write(" "+array[i]);},5000);
            setTimeout(() => { console.log(" " + array[i]); }, 5000);

        }
    }
}
//targil3();

async function targil4() {
    // Make sure to include these imports:
    // import { GoogleGenerativeAI } from "@google/generative-ai";
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // Create an interface to interact with the terminal

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: "Hello" }],
            },
            {
                role: "model",
                parts: [{ text: "Great to meet you. What would you like to know?" }],
            },
        ],
    });
    let result = await chat.sendMessage("I have 2 dogs in my house. Do you have dogs?");
    console.log(result.response.text());
    result = await chat.sendMessage("How many paws are in my house?");
    console.log(result.response.text());
}
//targil4();

function askQuestion() {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: "Hello" }],
            },
            {
                role: "model",
                parts: [{ text: "Great to meet you. What would you like to know?" }],
            },
        ],
    });

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question("Enter something (type 'exit' to quit): ", async (input) => {
        // Print response to the user
        console.log(`You entered: ${input}`);

        // Check if user wants to exit the loop
        if (input.toLowerCase() === 'exit') {
            console.log("Goodbye!");
            rl.close(); // Ends the readline interface
        } else {
            let result = await chat.sendMessage(input);
            console.log(result.response.text());
            // Recursive call to continue asking for input
            askQuestion();
        }
    });
}
// askQuestion();