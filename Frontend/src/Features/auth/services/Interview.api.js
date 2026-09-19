import axios, { Axios } from "axios";

const api = axios.create({
   // baseURL : "http://localhost:3000",
    baseURL : "https://skillgaps.onrender.com",
    withCredentials : true
});

export const generateInterviewReport =async ({jobDescription , selfDescription  , resumeFile}) =>{
    const formData = new FormData();
    formData.append("jobDescription" ,  jobDescription);
    formData.append("selfDescription" ,  selfDescription);
    formData.append("resume" ,  resumeFile);

    const response  =await api.post("/api/interviewReport/" , formData , {
        headers :{
            "Content-Type" : "multipart/form-Data"
        }
    });

    return response.data

}

export const getInterviewReportById =async (interviewId) =>{
    const response =await api.get(`/api/interviewReport/report/${interviewId}`)

    return response.data
}

export const getAllInterviewReports =async ()=>{
    const response =await api.get("/api/interviewReport/")

    return response.data
}