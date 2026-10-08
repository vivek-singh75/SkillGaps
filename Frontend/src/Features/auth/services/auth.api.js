import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",  //for production
    //baseURL: "https://skillgaps.onrender.com",
    withCredentials: true
})


export async function register(username ,email ,  password) {
    try {
        const response  = await api.post('/api/auth/register',
            {
                username , email , password
            });
        
        return response.data

    } catch (error) {
        console.log(`error in frontend register api call ${error}`)
    }
}



export async function login(email ,  password) {
    try {
        const response = await  api.post('/api/auth/login',{
                email , password
            });

        return response.data

    } catch (error) {
        console.log(`error in frontend login api call ${error}`)
    }
}

export async function logout() {
    try {
        const response = await api.get('/api/auth/logout');

        return response.data

    } catch (error) {
        console.log(`error in frontend logout api call ${error}`)
    }
}

export async function getMe() {
    try {
        const response = await api.get("/api/auth/getMe");

        return response.data;

    } catch (error) {
        throw error;
    }
}


export async function updateUserDetails(updatDetails) {
   
    const response = await api.patch("/api/auth/updatDetails", {
        username:updatDetails.username, 
        email : updatDetails.email
    });

    return response.data
   
}

export async function updateUserPassword(passwordData) {

    const response = await api.patch("/api/auth/updatepass", {
        currentPassword: passwordData.currentPassword,
        confirmPassword:passwordData.confirmPassword, 
        newPassword: passwordData.newPassword
    });

    return response.data

}


export async function deleteAccount(deletePassword) {
    
    const response = await api.delete("/api/auth/delete", {
        data : {
            password : deletePassword
        }
    } );

    return response.data;
}