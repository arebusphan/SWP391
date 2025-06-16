import axios from "axios";

export const sendOtp = (phone: string) => {
    return axios.post("https://localhost:7195/api/Otp/send", { phone });
};


export const verifyOtp = (email: string, otpcode: string) => {
    return axios.post("https://localhost:7195/api/Otp/verify-otp", { email, otpcode });
};

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dhuoon51m/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "SendMedicineImg";
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await axios.post(CLOUDINARY_URL, formData);
  return response.data.secure_url;
};

export const addUserAPI = async (
  parent: {
    fullName: string;
    phoneNumber?: string;
    email: string;
    roleId: number;
    isActive: boolean;
  },
  students?: {
    fullName: string;
    dateOfBirth: string; // đổi lại đúng key backend cần
    gender: string;
    classId: number;
  }[]
) => {
  const token = localStorage.getItem("token");

  const payload = students?.length
    ? { parent, students }
    : { parent };

  const res = await axios.post(
    "https://localhost:7195/api/User/add",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

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

export const sendingmedicine = (studentId: number, medicineName: string, prescriptionImageUrl: string) => {
  const token = localStorage.getItem("token");
  const payload = {
    studentId,
    medicineName,
    prescriptionImage: prescriptionImageUrl,
  };
  console.log("Sending medicine payload:", payload);

  return axios.post(
    "https://localhost:7195/api/medication-requests/parent-request",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};


export const update = (userId: number, fullName: string, email: string, phoneNumber: string) => {
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
export const getMedicationRequestsForNurse = () => {
    const token = localStorage.getItem("token");
    return axios.get("https://localhost:7195/api/medication-requests/nurseGetRequest", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const updateMedicationStatus = (id: number, status: string, reviewedBy: number) => {
    const token = localStorage.getItem("token");
    return axios.put(`https://localhost:7195/api/medication-requests/${id}/updateStatus`, {
        status,
        reviewedBy,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
export const getAllStudentHealthStatus = () => {
    const token = localStorage.getItem("token");
    return axios.get("https://localhost:7195/api/students/all-health-status", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    
};
export const uploadExcelFile = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post("https://localhost:7195/api/User/upload-excel", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const postBanner = async (title: string, imageUrl: string) => {
    return await axios.post("https://localhost:7195/api/Banners/post", { title, imageUrl })
}
export const getBanners = async () => {
    const res = await axios.get("https://localhost:7195/api/Banners/getall");
    return res.data;
};
export const getMedicationRequestHistory = (params?: {
  studentName?: string;
  status?: string;
  createdAt?: string;
}) => {
  const token = localStorage.getItem("token");

  return axios.get("https://localhost:7195/api/medication-requests/request-history", {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getNotifications = () => {
  const token = localStorage.getItem("token");

  return axios.get("https://localhost:7195/api/health-notifications", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getAllClass = async () => {
  const res = await axios.get("https://localhost:7195/api/Classes/all");
  return res.data; // đừng return res.data
};

