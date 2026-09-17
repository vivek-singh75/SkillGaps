const { PDFParse } = require("pdf-parse");

const { generateInterviewReport } = require("../services/ai.services");

const interviewReportModel = require("../models/interviewReport.model");



async function interviewController(req ,res) {
    const resumeFile = req.file

const parser = new PDFParse({
    data: req.file.buffer
    });

const pdfData = await parser.getText();

const resumeContent = pdfData.text;

await parser.destroy();
    const {selfDescription ,  jobDescription} = req.body

    const interviewReportByAi = await generateInterviewReport({
        resume : resumeContent,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user : req.user.userId,
        resume : resumeContent,
        selfDescription,
        jobDescription,
        ...interviewReportByAi

    });

    res.status(201).json({
        message : "interview report generate successfully",
        interviewReport
    })



}

module.exports= { interviewController, }