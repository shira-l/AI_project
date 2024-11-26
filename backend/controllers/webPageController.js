import { GoogleGenerativeAI } from "@google/generative-ai";
export async function getWebPage(req, res) {
    const designDetails = req.body;
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{
                    text: "I want to create a promotional webpage based on the information I am providing below. " +
                        "You must return to me the HTML and CSS code. " +
                        "give me it in a json format, the entry keys should be 'html' and 'css', and the values should be code in a string format"+
                        "The website should be very visually appealing and show should be a promotional website that has strong marketing language and convinces the website visitor to use our service."
                        // "Include the following ,making sure everything is customized to the details I am providing below:" +
                        // "A company name that you think goes well with the business" +
                        // "A tagline written in italics underneath the company name" +
                        // "A paragraph describing the business" +
                        // "A bulleted list of reasons why you should use our service" +
                        // "CTA that is specific to that business." +
                        // "Contact information"
                }],
            },
            {
                role: "model",
                parts: [{ text: "Absolutely! no problem. send me the information." }],
            },
        ],
    });
    console.log(designDetails);
    let result = await chat.sendMessage(`my business information: name: ${businessDetails.name} email: ${businessDetails.email} companyType: ${businessDetails.companyType} description: ${businessDetails.description} purpose: ${businessDetails.purpose} aboute: ${businessDetails.aboute}.`);
    console.log(result.response.text());

}


