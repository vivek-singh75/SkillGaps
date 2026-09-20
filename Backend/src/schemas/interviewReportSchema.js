const { z } = require("zod");

function userDetailsToText({ resume, jobDescription, selfDescription }) {
  return `
JOB DESCRIPTION:
${jobDescription}

RESUME:
${resume}

SELF DESCRIPTION:
${selfDescription}
`;
}

/* =========================================================
   TECHNICAL QUESTION
========================================================= */

const technicalQuestionSchema = z.object({
  question: z.string(),
  intention: z.string(),
  answer: z.string(),
  topic: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  relatedRequirement: z.string()
});


/* =========================================================
   BEHAVIORAL QUESTION
========================================================= */

const behavioralQuestionSchema = z.object({
  question: z.string(),
  intention: z.string(),
  answer: z.string(),
  relatedRequirement: z.string()
});


/* =========================================================
   SKILL GAP
========================================================= */

const skillGapSchema = z.object({
  skills: z.string(),

  severity: z.enum([
    "low",
    "medium",
    "high"
  ]),

  jobRequirement: z.string(),

  candidateEvidence: z.string(),

  whyItMatters: z.string(),

  topicsToLearn: z.array(
    z.string()
  )
});


/* =========================================================
   PREPARATION PLAN
========================================================= */

const preparationPlanSchema = z.object({
  day: z.number().int(),

  title: z.string(),

  focus: z.string(),

  topics: z.array(
    z.string()
  ),

  conceptsToLearn: z.array(
    z.string()
  ),

  tasks: z.array(
    z.string()
  ),

  practiceExercises: z.array(
    z.string()
  ),

  interviewQuestionsToPractice: z.array(
    z.string()
  ),

  relatedSkillGaps: z.array(
    z.string()
  ),

  expectedOutcome: z.string()
});


/* =========================================================
   COMPLETE INTERVIEW REPORT
========================================================= */

const interviewReportSchema = z.object({

  /*
   * Actual job title extracted from JD
   */
  title: z.string(),

  /*
   * One final score shown to the user
   */
  matchScore: z.number()
    .min(0)
    .max(100),

  /*
   * 20-25+ detailed questions
   */
  technicalQuestion: z.array(
    technicalQuestionSchema
  ),

  /*
   * 6-8 behavioral questions
   */
  behavioralQuestion: z.array(
    behavioralQuestionSchema
  ),

  /*
   * Important gaps between candidate and JD
   */
  skillGap: z.array(
    skillGapSchema
  ),

  /*
   * Long personalized preparation roadmap
   */
  preparationPlan: z.array(
    preparationPlanSchema
  )

});


/* =========================================================
   GEMINI JSON SCHEMA
========================================================= */

const interviewReportJsonSchema = {

  type: "object",

  properties: {

    title: {
      type: "string"
    },

    matchScore: {
      type: "number",
      minimum: 0,
      maximum: 100
    },

    technicalQuestion: {

      type: "array",

      items: {

        type: "object",

        properties: {

          question: {
            type: "string"
          },

          intention: {
            type: "string"
          },

          answer: {
            type: "string"
          },

          topic: {
            type: "string"
          },

          difficulty: {
            type: "string",
            enum: [
              "easy",
              "medium",
              "hard"
            ]
          },

          relatedRequirement: {
            type: "string"
          }

        },

        required: [
          "question",
          "intention",
          "answer",
          "topic",
          "difficulty",
          "relatedRequirement"
        ]
      }
    },


    behavioralQuestion: {

      type: "array",

      items: {

        type: "object",

        properties: {

          question: {
            type: "string"
          },

          intention: {
            type: "string"
          },

          answer: {
            type: "string"
          },

          relatedRequirement: {
            type: "string"
          }

        },

        required: [
          "question",
          "intention",
          "answer",
          "relatedRequirement"
        ]
      }
    },


    skillGap: {

      type: "array",

      items: {

        type: "object",

        properties: {

          skills: {
            type: "string"
          },

          severity: {
            type: "string",
            enum: [
              "low",
              "medium",
              "high"
            ]
          },

          jobRequirement: {
            type: "string"
          },

          candidateEvidence: {
            type: "string"
          },

          whyItMatters: {
            type: "string"
          },

          topicsToLearn: {

            type: "array",

            items: {
              type: "string"
            }
          }

        },

        required: [
          "skills",
          "severity",
          "jobRequirement",
          "candidateEvidence",
          "whyItMatters",
          "topicsToLearn"
        ]
      }
    },


    preparationPlan: {

      type: "array",

      items: {

        type: "object",

        properties: {

          day: {
            type: "integer"
          },

          title: {
            type: "string"
          },

          focus: {
            type: "string"
          },

          topics: {

            type: "array",

            items: {
              type: "string"
            }
          },

          conceptsToLearn: {

            type: "array",

            items: {
              type: "string"
            }
          },

          tasks: {

            type: "array",

            items: {
              type: "string"
            }
          },

          practiceExercises: {

            type: "array",

            items: {
              type: "string"
            }
          },

          interviewQuestionsToPractice: {

            type: "array",

            items: {
              type: "string"
            }
          },

          relatedSkillGaps: {

            type: "array",

            items: {
              type: "string"
            }
          },

          expectedOutcome: {
            type: "string"
          }

        },

        required: [
          "day",
          "title",
          "focus",
          "topics",
          "conceptsToLearn",
          "tasks",
          "practiceExercises",
          "interviewQuestionsToPractice",
          "relatedSkillGaps",
          "expectedOutcome"
        ]
      }
    }

  },

  required: [
    "title",
    "matchScore",
    "technicalQuestion",
    "behavioralQuestion",
    "skillGap",
    "preparationPlan"
  ],

  additionalProperties: false
};


module.exports = {
  userDetailsToText,
  interviewReportSchema,
  interviewReportJsonSchema
};