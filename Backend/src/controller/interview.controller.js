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

async function getInterviewReportById(req , res) {
    const interviewId = req.params

    const interviewReport = await interviewReportModel.findOne({_id: interviewId , user : req.user.userId});

    if(!interviewReport){
        return res.status(409).json({
            message : "no interview report found "
        });
    }

    res.status(200).json({
        message : "interview report fetched",
        interviewReport
    });
} 

 
async function getAllInterviewReportBy(req ,res) {
    const interviewReport = await interviewReportModel.find({user: req.user.userId})
    .sort({createdAt: -1}).select("-resume  - selfDescription  jobDescription _v -technicalQuestion -behavioralQuestion skillsGap -preparationPlan "  )
 
    res.status(200).json({
        message : "interview report fetched succesfully",
        interviewReport
    })
}



module.exports= { 
    interviewController, 
    getInterviewReportById,
    getAllInterviewReportBy

}