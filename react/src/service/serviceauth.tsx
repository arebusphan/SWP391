import axios from "axios";

export const sendOtp = (phone: string) => {
    return axios.post("https://localhost:7195/api/Otp/send", { phone });
};


export const verifyOtp = (email: string, otpcode: string) => {
    return axios.post("https://localhost:7195/api/Otp/verify-otp", { email, otpcode });
};

export const adduser = (fullName: string, phoneNumber: string, email: string, roleId: number, role: string, isActive: boolean) => {
    return axios.post("https://localhost:7195/api/User/add", { fullName, phoneNumber, email, roleId, role, isActive });
    }

export const getuser = (params?: {
    fullName?: string;
    phoneNumber?: string;
    email?: string;
    isActive?: boolean;
    role?: string;
}) => {
    return axios.get("https://localhost:7195/api/User/get", { params });
};

