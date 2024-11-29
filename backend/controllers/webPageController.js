import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs'
export async function getWebPage(req, res) {
    //     process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    //     const url = 'https://markerapi.com/api/v2/trademarks/trademark/bamba/status/active/start/1/username/Test123/password/MWJm4rTdCp';
    //     const agent = new https.Agent({ rejectUnauthorized: false })
    //     setGlobalDispatcher(new Agent({ connect: { timeout: 60_000 } }))
    //     const response = await fetch(url, { agent });
    //     const jsonResponse = await response.json();
    //     console.log(jsonResponse);
    const designDetails = req.body;
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const header = 'Header and a tagline written in italics underneath the company name';
    const navigation = 'Navigation to all sections of the web page ';
    const content = 'Content section';
    const about = 'About section- A paragraph describing the business ';
    const social = 'Social proof for the business';
    const benefits = 'A bulleted list of reasons why you should use our service and benefits';
    const contact = 'My contact information';
    const powerful = 'Powerful calls to action';
    const footer = 'Footer in the end of the page';

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{
                    text: "I want to create a promotional webpage based on the information I'll provide. " +
                        "You must return to me the HTML code in string format. " +
                        "give me only code! nothing else!" +
                        " do not write instructions for the site owner like 'Here you would add images and descriptions' and'Insert Property Details Here' within the user-visible code!!."+
                        "If you are missing information, make it up yourself"+
                        "The website should be responsive and Neatly designed."+
                        `The website should be in this Hex color code: ${designDetails.colors.map((color) => color)} colors. ` +
                        "Please use diffferent special fonts and interesting designs." +
                        "The website should have a big margin on both sides and be very visually appealing,prestigious and innovative,and show should be a promotional website that has strong marketing language and convinces the website visitor to use our service." +
                        "Include the following ,making sure everything is customized to the details I am provide:" +

                        // "A company name that you think goes well with the business" +
                        `${designDetails.sections.map(section => {
                            switch (section) {
                                case 'Header':
                                    return header;
                                case 'Navigation':
                                    return navigation;
                                case 'Content':
                                    return content;
                                case 'About':
                                    return about;
                                case 'Social proof':
                                    return social;
                                case 'Benefits':
                                    return benefits;
                                case 'Contact information':
                                    return contact;
                                case 'Powerful calls to action':
                                    return powerful;
                                case 'Footer':
                                    return footer;
                            }
                        })} ` +
                        "I'll provide you the relevant information. Ok? "
                }],
            },
            {
                role: "model",
                parts: [{ text: "Absolutely! no problem. send me the information." }],
            },
        ],
    });
    let htmlResult = await chat.sendMessage(`my business information:
        name: ${designDetails.name}
        email: ${designDetails.email}
        companyType: ${designDetails.companyType}
        description: ${designDetails.description}
        purpose: ${designDetails.purpose}
        about: ${designDetails.about}.`);
    let htmlText = htmlResult.response.text();
    let html = htmlText.slice(htmlText.indexOf("html") + 4, -4);
    
    fs.writeFileSync('C:/Users/The user/AI_project/backend/html/landingPage.html', html);
    res.download('C:/Users/The user/AI_project/backend/html/landingPage.html', 'webPAge.html')
}


