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


