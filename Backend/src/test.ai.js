const { generateInterviewReport } = require("./services/ai.services");


async function testAI() {

    try {

        const userDetails = {

            resume: `
B.Tech Computer Science student.
Skills: Java, JavaScript, React, Node.js, Express, MongoDB and SQL.

Projects:
1. ShopSphere - MERN stack e-commerce application.
2. Placement Preparation Tracker - React based application.
`,

            jobDescription: `
We are looking for a Software Engineer.

Requirements:
- Strong JavaScript knowledge
- React
- Node.js
- Express
- MongoDB
- REST APIs
- Problem solving
- Good communication skills
`,

            selfDescription: `
I am a fresher interested in full-stack software development.
I enjoy building web applications and learning new technologies.
`
        };


        console.log("Calling Gemini...\n");


        const result =
            await generateInterviewReport(userDetails);


        console.log(
            "AI RESPONSE:\n"
        );

        console.log(
            JSON.stringify(result, null, 2)
        );


    } catch (error) {

        console.error(
            "AI TEST FAILED:"
        );

        console.error(error);

    }

}


testAI();