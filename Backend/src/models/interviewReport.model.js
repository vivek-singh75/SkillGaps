const mongoose = require("mongoose");


const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "technical question is required"]
    },

    intention: {
        type: String,
        required: [true, "Intention is required"]
    },

    answer: {
        type: String,
        required: [true, "Answer is required"]
    },

    // NEW
    topic: {
        type: String,
        required: [true, "Topic is required"]
    },

    // NEW
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: [true, "Difficulty is required"]
    },

    // NEW
    relatedRequirement: {
        type: String,
        required: [true, "Related job requirement is required"]
    }

}, {
    _id: false
});


const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "behavioral question is required"]
    },

    intention: {
        type: String,
        required: [true, "Intention is required"]
    },

    answer: {
        type: String,
        required: [true, "Answer is required"]
    },

    // NEW
    relatedRequirement: {
        type: String,
        required: [true, "Related job requirement is required"]
    }

}, {
    _id: false
});


const skillGapSchema = new mongoose.Schema({
    skills: {
        type: String,
        required: [true, "Skill is required"]
    },

    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Severity is required"]
    },

    // NEW
    jobRequirement: {
        type: String,
        required: [true, "Job requirement is required"]
    },

    // NEW
    candidateEvidence: {
        type: String,
        required: [true, "Candidate evidence is required"]
    },

    // NEW
    whyItMatters: {
        type: String,
        required: [true, "Why it matters is required"]
    },

    // NEW
    topicsToLearn: [{
        type: String
    }]

}, {
    _id: false
});


const preparationPlanSchema = new mongoose.Schema({

    day: {
        type: Number,
        required: [true, "Day is required"]
    },

    // NEW
    title: {
        type: String,
        required: [true, "Title is required"]
    },

    focus: {
        type: String,
        required: [true, "Focus is required"]
    },

    // NEW
    topics: [{
        type: String
    }],

    // NEW
    conceptsToLearn: [{
        type: String
    }],

    tasks: [{
        type: String,
        required: [true, "Task is required"]
    }],

    // NEW
    practiceExercises: [{
        type: String
    }],

    // NEW
    interviewQuestionsToPractice: [{
        type: String
    }],

    // NEW
    relatedSkillGaps: [{
        type: String
    }],

    // NEW
    expectedOutcome: {
        type: String,
        required: [true, "Expected outcome is required"]
    }

});


const interviewReportSchema = new mongoose.Schema({

    jobDescription: {
        type: String,
        required: [true, "job description is required"]
    },

    resume: {
        type: String
    },

    selfDescription: {
        type: String
    },

    matchScore: {
        type: Number,
        min: 0,
        max: 100
    },

    technicalQuestion: [
        technicalQuestionSchema
    ],

    behavioralQuestion: [
        behavioralQuestionSchema
    ],

    skillGap: [
        skillGapSchema
    ],

    preparationPlan: [
        preparationPlanSchema
    ],

    title: {
        type: String,
        required: [true, "job title is required"]
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }

}, {
    timestamps: true
});


const interviewReportModel =
    mongoose.model("InterviewReport", interviewReportSchema);


module.exports = interviewReportModel;