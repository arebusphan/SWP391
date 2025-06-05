import axios from "axios";

export const sendOtp = (phone: string) => {
    return axios.post("https://localhost:7195/api/Otp/send", { phone });
};


export const verifyOtp = (email: string, otpcode: string) => {
    return axios.post("https://localhost:7195/api/Otp/verify-otp", { email, otpcode });
};

export const adduser = async (
    fullName: string,
    phoneNumber: string,
    email: string,
    roleId: number,
    role: string,
    isActive: boolean
) => {
    const res = await axios.post("https://localhost:7195/api/User/add", {
        fullName,
        phoneNumber,
        email,
        roleId,
        role,
        isActive,
    });
    return res.data;
};

export const getuser = (params?: {
    fullName?: string;
    phoneNumber?: string;
    email?: string;
    isActive?: boolean;
    role?: string;
}) => {
    return axios.get("https://localhost:7195/api/User/get", { params });
};
export const sendingmedicine = (studentId: number, medicineName: string, prescriptionImage: string) => {
    const token = localStorage.getItem("token");
    return axios.post("https://localhost:7195/api/medication-requests", { studentId, medicineName, prescriptionImage }, {
    headers: {
      
      Authorization: `Bearer ${token}`,
    },
  })
};

export const update = (userId: number, fullName: string, email: string, phoneNumber: string)=>{
    return axios.put("https://localhost:7195/api/User/Update", {
        userId, fullName, email, phoneNumber
    })
}
export const deletebyactive = (userId: number) => {
    return axios.put("https://localhost:7195/api/User/Delete", {
        userId
    })
}

export const getstudentid = (params?: {
    studentId: number;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    guardianId: number;
    guardianName: string;
    guardianPhone: string;
}) => {
    const token = localStorage.getItem("token");

    return axios.get("https://localhost:7195/api/students/get-StuByGuardian", {
        params, 
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};