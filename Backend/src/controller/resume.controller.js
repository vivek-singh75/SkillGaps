const interviewReportModel = require("../models/interviewReport.model");

const { generateTargetedResume } = require("../services/ai.services");


async function generateResumeController(req, res) {

    try {

        const userId = req.user.userId;

        // Get user's latest interview report
        const interviewReport =
            await interviewReportModel
                .findOne({ user: userId })
                .sort({ createdAt: -1 });


        if (!interviewReport) {

            return res.status(404).json({
                message: "Interview report not found"
            });

        }


        const {
            resume,
            jobDescription,
            selfDescription
        } = interviewReport;


        if (!resume || !jobDescription || !selfDescription) {

            return res.status(400).json({
                message: "Required interview data is missing"
            });

        }


        const {
            resumeHTML,
            pdfBuffer
        } = await generateTargetedResume({
            resume,
            jobDescription,
            selfDescription
        });


        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition":
                "attachment; filename=targeted-resume.pdf"
        });


        res.send(pdfBuffer);


    } catch (error) {

        console.error(
            "Error in generateResumeController:",
            error
        );

        return res.status(500).json({
            message: "Failed to generate targeted resume"
        });

    }

}


module.exports = {
    generateResumeController
};