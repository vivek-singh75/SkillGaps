const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer")

const config = require("../config/config");

const {
  userDetailsToText,
  interviewReportSchema,
  interviewReportJsonSchema
} = require("../schemas/interviewReportSchema");


const ai = new GoogleGenAI({
  apiKey: config.GOOGLE_GENAI_API_KEY
});


async function generateInterviewReport({
  resume,
  jobDescription,
  selfDescription
}) {

  try {

    const userDetails = userDetailsToText({
      resume,
      jobDescription,
      selfDescription
    });


    const prompt = `
You are an expert technical interviewer and recruitment analyst.

Analyze the candidate based on:

${userDetails}

Generate a personalized interview preparation report.

IMPORTANT:
Return ONLY valid JSON.

Use EXACTLY these field names:

matchScore
technicalQuestion
behavioralQuestion
skillGap
preparationPlan

DO NOT use:

technicalQuestions
behavioralQuestions
skillGaps
fullTechnicalQuestions
testQuestions
skillGapsTable
preparationPlanDetailed

--------------------------------------------------

technicalQuestion

This MUST be an array of OBJECTS.

Each object MUST contain:

{
  "question": "string",
  "intention": "string",
  "answer": "string"
}

Generate 3 technical questions.

--------------------------------------------------

behavioralQuestion

This MUST be an array of OBJECTS.

Each object MUST contain:

{
  "question": "string",
  "intention": "string",
  "answer": "string"
}

Generate 2 behavioral questions.

--------------------------------------------------

skillGap

This MUST be an array of OBJECTS.

Each object MUST contain:

{
  "skills": "string",
  "severity": "low"
}

severity MUST be exactly one of:

low
medium
high

--------------------------------------------------

preparationPlan

This MUST be an array of OBJECTS.

Each object MUST contain:

{
  "day": 1,
  "focus": "string",
  "tasks": ["string", "string"]
}

Generate a 5-day preparation plan.

--------------------------------------------------

matchScore

Give a number between 0 and 100.

title 
job title is should be showed , 

Do not add any extra fields.
`;


    const response = await ai.models.generateContent({

      model: "gemini-3.5-flash-lite",

      contents: prompt,

      config: {
        responseMimeType: "application/json",
        responseSchema: interviewReportJsonSchema
      }

    });


    console.log("\nGemini generated response:");
    console.log(response.text);


    const result = JSON.parse(response.text);


    // Validate Gemini response
    const validatedResult =
      interviewReportSchema.parse(result);


    // Add original user data
    const finalReport = {

      jobDescription,

      resume,

      selfDescription,

      ...validatedResult

    };


    return finalReport;


  } catch (error) {

    console.error(
      "Error in generateInterviewReport:",
      error
    );

    throw error;
  }
}


async function generateTargetedResume({
    resume,
    jobDescription,
    selfDescription
}) {

    let browser;

    try {

        const userDetails = userDetailsToText({
            resume,
            jobDescription,
            selfDescription
        });


        const prompt = `
You are an expert ATS resume writer.

Create a professional job-targeted resume in HTML.

Use the candidate's existing resume, self description and job description below.

Rules:
- Use only the provided information.
- Do not invent any skills, experience, projects, education or achievements.
- Target the resume toward the job description.
- Prioritize relevant skills and experience.
- Improve wording and make it ATS-friendly.
- Return only HTML.
- Start with <div class="resume"> and end with </div>.
- Do not return Markdown or explanations.

Candidate Information:

${userDetails}
`;

        // Gemini generates HTML
        const response = await ai.models.generateContent({

            model: "gemini-3.5-flash-lite",

            contents: prompt,

            config: {
                responseMimeType: "text/plain"
            }

        });


        let resumeHTML = response.text.trim();


        // Remove markdown fences if Gemini adds them
        resumeHTML = resumeHTML
            .replace(/^```html\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();


        // Generate PDF
        browser = await puppeteer.launch({
            headless: true
        });


        const page = await browser.newPage();


        await page.setContent(resumeHTML, {
            waitUntil: "networkidle0"
        });


        const pdfBuffer = await page.pdf({

            format: "A4",

            printBackground: true,

            margin: {
                top: "10mm",
                bottom: "10mm",
                left: "10mm",
                right: "10mm"
            }

        });


        return {
            resumeHTML,
            pdfBuffer
        };


    } catch (error) {

        console.error(
            "Error in generateTargetedResume:",
            error
        );

        throw error;

    } finally {

        if (browser) {
            await browser.close();
        }

    }

}

module.exports = {
  generateInterviewReport,
  generateTargetedResume
};