import {generateInterviewReport ,getInterviewReportById , getAllInterviewReports} from "../services/Interview.api"
import { useContext } from "react"
import { InterviewContext } from "../../interview/Interview.context.jsx"


export const useInterview =  () => {
    const context = useContext(InterviewContext);

    if(!context){
        throw new Error("useInterview must be in InterviewProvider"); 
    }

    const {loading , setLoading , report ,setReport , reports, setReports } = context

    const generateReport = async (data) => {
        try {
            setLoading(true);

            const response = await generateInterviewReport(data);
            const interviewReport = response.interviewReport;
            const reportData = {
                _id: interviewReport._id,
                matchScore: interviewReport.matchScore,
                technicalQuestion: interviewReport.technicalQuestion,
                behavioralQuestion: interviewReport.behavioralQuestion,
                skillGap: interviewReport.skillGap,
                preparationPlan: interviewReport.preparationPlan
            };

            setReport(reportData);
            return reportData;
        } catch (error) {
            console.error("Generate interview report error:", error);
            throw error;

        } finally {
            setLoading(false);
        }
    };

    const getReportById = async (interviewId) =>{

        let response = null
        try{
            setLoading(true)
            response = await getInterviewReportById(interviewId)

            const interviewReport = response.interviewReport;
                const reportData = {
                    _id: interviewReport._id,
                    matchScore: interviewReport.matchScore,
                    technicalQuestion: interviewReport.technicalQuestion,
                    behavioralQuestion: interviewReport.behavioralQuestion,
                    skillGap: interviewReport.skillGap,
                    preparationPlan: interviewReport.preparationPlan
            };

            setReport(reportData);

            return reportData;
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const getReports = async () => {
        setLoading(true);

        try {
            const response = await getAllInterviewReports();

            const interviewReports = response.interviewReport;

            const reportData = interviewReports.map((report) => ({
                _id: report._id,
                matchScore: report.matchScore,
                title: report.title,
                user: report.user,
                createdAt: report.createdAt
            }));

            setReports(reportData);

            return reportData;

        } catch (error) {
            console.log(`error in getReports ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return {loading , report, reports ,generateReport , getReportById , getReports}
}