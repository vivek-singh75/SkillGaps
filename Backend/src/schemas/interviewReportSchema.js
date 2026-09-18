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

const technicalQuestionSchema = z.object({
  question: z.string(),
  intention: z.string(),
  answer: z.string()
});

const behavioralQuestionSchema = z.object({
  question: z.string(),
  intention: z.string(),
  answer: z.string()
});

const skillGapSchema = z.object({
  skills: z.string(),
  severity: z.enum(["low", "medium", "high"])
});

const preparationPlanSchema = z.object({
  day: z.number(),
  focus: z.string(),
  tasks: z.array(z.string())
});

const interviewReportSchema = z.object({
  matchScore: z.number().min(0).max(100),

  title : z.string(),

  technicalQuestion: z.array(
    technicalQuestionSchema
  ),

  behavioralQuestion: z.array(
    behavioralQuestionSchema
  ),

  skillGap: z.array(
    skillGapSchema
  ),

  preparationPlan: z.array(
    preparationPlanSchema
  )
});


const interviewReportJsonSchema = {
  type: "object",

  properties: {
    title :{
      type: "string",
      
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
          }
        },
        required: [
          "question",
          "intention",
          "answer"
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
          }
        },
        required: [
          "question",
          "intention",
          "answer"
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
            enum: ["low", "medium", "high"]
          }
        },
        required: [
          "skills",
          "severity"
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
          focus: {
            type: "string"
          },
          tasks: {
            type: "array",
            items: {
              type: "string"
            }
          }
        },
        required: [
          "day",
          "focus",
          "tasks"
        ]
      }
    }
  },

  required: [
    "matchScore",
    "title",
    "technicalQuestion",
    "behavioralQuestion",
    "skillGap",
    "preparationPlan"
  ]
};


module.exports = {
  userDetailsToText,
  interviewReportSchema,
  interviewReportJsonSchema
};