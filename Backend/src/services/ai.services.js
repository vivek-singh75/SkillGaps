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
  You are an expert recruitment analyst, technical interviewer, and career preparation planner.

  Analyze the candidate using ALL THREE sources provided in the input:

  1. Job Description
  2. Resume
  3. Self Description

  ${userDetails}

  The Job Description is the TARGET PROFILE.

  Your job is to determine how well the candidate matches THIS SPECIFIC JOB and create a detailed, personalized interview preparation plan.

  ==================================================
  CORE ANALYSIS RULES
  ==================================================

  1. Read and analyze the complete Job Description before evaluating the candidate.

  2. Extract the important requirements from the Job Description:
    - Required skills
    - Preferred skills
    - Tools and technologies
    - Responsibilities
    - Education requirements
    - Experience requirements
    - Domain knowledge
    - Important soft skills

  3. Compare these requirements against the candidate's Resume and Self Description.

  4. The Resume is the strongest evidence of the candidate's actual skills and experience.

  5. Use the Self Description only as supporting evidence.

  6. NEVER invent skills, experience, projects, certifications, achievements, or knowledge that are not supported by the Resume or Self Description.

  7. Do not penalize the candidate for skills that are not required or preferred by the Job Description.

  8. Identify:
    - Skills the candidate already has
    - Skills where the candidate has partial knowledge
    - Skills required by the job that the candidate is missing

  9. Every skill gap MUST be relevant to the Job Description.

  10. Questions and preparation topics MUST be derived from the actual Job Description, candidate profile, and identified skill gaps.

  Do NOT generate generic questions or generic preparation topics unrelated to the target job.

  ==================================================
  MATCH SCORE
  ==================================================

  Generate ONE final matchScore between 0 and 100.

  Calculate the score based on:

  - Technical/Domain Skills: 35%
  - Relevant Experience/Projects: 20%
  - Education/Qualification: 15%
  - Job Responsibilities Alignment: 15%
  - Tools and Job-Specific Knowledge: 15%

  The score must reflect the actual evidence found in the Resume and Self Description.

  Do not randomly assign a score.

  Return only the final combined score to the user as matchScore.

  ==================================================
  TITLE
  ==================================================

  Return the actual job title extracted from the Job Description as:

  "title"

  Do not invent a different job title.

  ==================================================
  TECHNICAL QUESTIONS
  ==================================================

  Generate 15-20 technical and role-specific interview questions.

  Questions MUST be based on:

  - Skills explicitly required by the Job Description
  - Responsibilities mentioned in the Job Description
  - Candidate's Resume
  - Candidate's projects and experience
  - Candidate's missing or weak skills

  Include a mixture of:

  - Conceptual questions
  - Practical questions
  - Problem-solving questions
  - Scenario-based questions
  - Questions based on the candidate's Resume

  Do not generate generic questions unrelated to the target role.

  For every question provide:

  {
    "question": "string",
    "intention": "Why the interviewer would ask this question im few words",
    "answer": "Detailed expected answer in 1-2 line"
  }

  Answers must be detailed enough to help the candidate prepare.

  ==================================================
  BEHAVIORAL QUESTIONS
  ==================================================

  Generate 6-8 behavioral and HR interview questions.

  Questions should be relevant to:

  - The target job
  - Candidate's Resume
  - Candidate's experience
  - Responsibilities of the role

  Provide realistic and detailed expected answers.

  Each object MUST contain:

  {
    "question": "string",
    "intention": "string",
    "answer": "string"
  }

  ==================================================
  SKILL GAPS
  ==================================================

  Identify the most important skill gaps between the candidate and the Job Description.

  Prioritize gaps based on:

  - Importance to the Job Description
  - Candidate's current level
  - Impact on job readiness

  Each object MUST contain:

  {
    "skills": "string",
    "severity": "low | medium | high"
  }

  Use:
  low = useful but not critical
  medium = important for the role
  high = major requirement missing or significantly weak

  Do not include irrelevant skills.

  ==================================================
  PREPARATION ROADMAP
  ==================================================

  Generate a LONG, detailed, personalized preparation roadmap.

  Generate 14-30 days depending on the complexity of the Job Description and the size of the candidate's skill gaps.

  Do NOT generate a generic roadmap.

  Every day must be directly connected to:

  - A Job Description requirement
  OR
  - An identified skill gap
  OR
  - Interview preparation for the target role

  The roadmap should progress logically:

  Foundation
  → Core Concepts
  → Job-Specific Skills
  → Practical Application
  → Advanced Topics
  → Interview Practice
  → Mock Interview
  → Final Revision

  Each day MUST contain:

  {
    "day": number,
    "focus": "specific topic",
    "tasks": [
      "detailed actionable task",
      "detailed actionable task",
      "detailed actionable task"
    ]
  }

  Tasks must tell the candidate WHAT to learn, WHAT to practice, and WHAT to build/solve where applicable in few words.

  Do not make tasks vague such as:
  "Study finance"
  "Learn backend"
  "Practice interview questions"

  Instead provide specific topics and actionable activities.

  The roadmap must focus more time on the candidate's important skill gaps.

  ==================================================
  OUTPUT RULES
  ==================================================

  Return ONLY valid JSON.

  Use EXACTLY these top-level field names:

  title
  matchScore
  technicalQuestion
  behavioralQuestion
  skillGap
  preparationPlan

  Do NOT use:

  technicalQuestions
  behavioralQuestions
  skillGaps
  fullTechnicalQuestions
  testQuestions
  skillGapsTable
  preparationPlanDetailed

  Do not add any other top-level fields.

  technicalQuestion MUST be an array of objects.

  behavioralQuestion MUST be an array of objects.

  skillGap MUST be an array of objects.

  preparationPlan MUST be an array of objects.

  Ensure the JSON is valid and contains no markdown, comments, or explanatory text.
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