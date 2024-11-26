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
                    text: "I want to create a promotional webpage based on the information I'll provide. " +
                        "You must return to me the HTML and CSS code. " +
                        "give me it in a json format, the entry keys should be 'html' and 'css', and the values should be code in a string format" +
                        "The website should be very visually appealing and show should be a promotional website that has strong marketing language and convinces the website visitor to use our service." +
                        `The website should be in this Hex color code: ${designDetails.colors.map((color) => color)} colors. ` +
                        "Include the following ,making sure everything is customized to the details I am provide:" +

                        // "A company name that you think goes well with the business" +
                        `${designDetails.sections.map(section => section == 'Header' ? 'Header and a tagline written in italics underneath the company name' : null)} ` +
                        `${designDetails.sections.map(section => section == 'Navigation' ? 'Navigation to all sections of the web page ' : null)} ` +
                        `${designDetails.sections.map(section => section == 'Content' ? 'Content section' : null)} ` +
                        `${designDetails.sections.map(section => section == 'About' ? 'About section- A paragraph describing the business ' : null)} ` +
                        `${designDetails.sections.map(section => section == 'Social proof' ? 'Social proof for the business' : null)} ` +
                        `${designDetails.sections.map(section => section == 'Benefits' ? 'A bulleted list of reasons why you should use our service and benefits' : null)} ` +
                        `${designDetails.sections.map(section => section == 'Contact information' ? 'Contact information' : null)} ` +
                        `${designDetails.sections.map(section => section == 'Powerful calls to action' ? 'Powerful calls to action' : null)} ` +
                        `${designDetails.sections.map(section => section == 'Footer' ? 'Footer in the end of the page' : null)} ` +
                        "I'll provide you the relevant information. Ok? "
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


