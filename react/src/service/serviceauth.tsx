import axios from "axios";
import { apiser } from "./apiser";

export const sendOtp = (phone: string) => {
    return apiser.post("/Otp/send", { phone });
};


export const verifyOtp = (email: string, otpcode: string) => {
    return apiser.post("/Otp/verify-otp", { email, otpcode });
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
        dateOfBirth: string; 
        gender: string;
        classId: number;
    }[]
) => {
   
    const payload = students?.length ? { parent, students } : { parent };

    const res = await apiser.post("/User/add", payload);
    return res.data;
};


export const getuser = (params?: {
    fullName?: string;
    phoneNumber?: string;
    email?: string;
    isActive?: boolean;
    role?: string;
}) => {
    return apiser.get("/User/get", { params });
};


interface MedicationRequestPayload {
  studentId: number;
  medicineName: string;
  prescriptionImage: string;
  healthStatus: string;
  note: string;
}

export const sendingmedicine = (payload: MedicationRequestPayload) => {
  const token = localStorage.getItem("token");

    return apiser.post(
    "/medication-requests/parent-request",
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
    return apiser.put("/User/Update", {
        userId, fullName, email, phoneNumber
    })
}
export const deletebyactive = (userId: number) => {
    return apiser.put("/User/Delete", {
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

    return apiser.get("/students/get-StuByGuardian", {
        params,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
export const getMedicationRequestsForNurse = () => {
    const token = localStorage.getItem("token");
    return apiser.get("/medication-requests/nurseGetRequest", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const updateMedicationStatus = async (
    id: number,
    status: string,
    reviewedBy: number,
    rejectReason?: string
) => {
    const token = localStorage.getItem("token"); 

    const payload = {
        status,
        reviewedBy,
        ...(rejectReason ? { rejectReason } : {}),
    };

    const { data } = await apiser.put(
        `/medication-requests/${id}/updateStatus`,
        payload,
        {
            headers: {
                Authorization: `Bearer ${token}`, 
                "Content-Type": "application/json",
            },
        }
    );

    return data;
};




export const getAllStudentHealthStatus = () => {
    const token = localStorage.getItem("token");
    return apiser.get("/students/all-health-status", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    
};
export const uploadExcelFile = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiser.post("/User/importExcel", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const postBanner = async (title: string, imageUrl: string) => {
    return await apiser.post("/Banners/post", { title, imageUrl })
}
export const getBanners = async () => {
    const res = await apiser.get("/Banners/getall");
    return res.data;
};
export const getMedicationRequestHistory = (params?: {
  studentName?: string;
  status?: string;
  createdAt?: string;
}) => {
  const token = localStorage.getItem("token");

  return apiser.get("/medication-requests/request-history", {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getNotifications = () => {
  const token = localStorage.getItem("token");

  return apiser.get("/notifications", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getAllClass = async () => {
  const res = await apiser.get("/Classes/all");
  return res.data; 
};


export const AddSupplies = async (
    supplyName: string,
    quantity: number,
    notes: string,
    image: string
) => {
    return await apiser.post("/MedicalSupplies/post", {
        supplyName,
        quantity,
        notes,
        image,
        lastUsedAt: null 
    });
};



export const getStudentsByClassId = async (classId: number) => {
    const token = localStorage.getItem('token');
    const res = await apiser.get(`/students/by-class/${classId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};
export const postIncident = async (
    studentId: number,
    classId: number,
    incidentName: string,
    description: string,
    handledBy: string,
    occurredAt: string,
    suppliesUsed: { supplyId: number; quantityUsed: number }[]
) => {
    return apiser.post("/Incident/post", {
        studentId,
        classId,
        incidentName,
        description,
        handledBy,
        occurredAt,
        suppliesUsed
    });
};
export const AddSupplyToInventory = async (
    supplyId: number,
    quantity: number
) => {
    return await apiser.put("/MedicalSupplies/post/used", {
        supplyId,
        quantity 
    });
};
export const GetSupplies = async () => {
    return await apiser.get("/MedicalSupplies/get");

}
export const getAllStudents = async () => {
  const token = localStorage.getItem("token");

  const res = await apiser.get("/students/get-all-student", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


export async function findUserByEmailOrPhone(input: string) {
    const params = new URLSearchParams();

    if (input.includes("@")) {
        params.append("email", input);
    } else {
        params.append("phone", input);
    }

    const { data } = await apiser.get(`/User/find-by-email-or-phone?${params.toString()}`);
    return data;
}

export const addStudents = async (payload: {
  guardianId: number;
  students: {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    classId: number;
  }[];
}) => {
  const token = localStorage.getItem("token");

  return apiser.post("/students/addstudent", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getStudentHealthProfile = async (studentId: number) => {
  const token = localStorage.getItem("token");

  return  apiser.get(`/HealthProfile/student/${studentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createStudentHealthProfile = async (payload: {
    declarationId?: number;    
    studentId: number;
    allergies?: string;
    chronicDiseases?: string;
    vision?: string;
    hearing?: string;
    otherNotes?: string;
    studentName: string;         
    className: string;          
}) => {
    const token = localStorage.getItem("token");

    return await apiser.post("/HealthProfile", payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const updateStudentHealthProfile = async (
  profileId: number, // 👈 ID của hồ sơ sức khỏe cần cập nhật
  payload: {
    studentId: number;
    allergies?: string;
    chronicDiseases?: string;
    vision?: string;
    hearing?: string;
    otherNotes?: string;
  }
) => {
  const token = localStorage.getItem("token");

  return await apiser.put(`/HealthProfile/${profileId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getMedicationIntakeLogs = async (studentId: number) => {
  const token = localStorage.getItem("token");

  const res = await apiser.get(
    `/medication-requests/logs/${studentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const GetIncidentHistory = async () => {
    const res = await apiser.get("/Incident/incident-supplies-history");
    return res.data;
};
export const getIncidentHistoryByGuardian = async (guardianId: number) => {
    return apiser.get(`/Incident/guardian/${guardianId}/incidents`);
};

export const confirmVaccination = async (
  notificationStudentId: number,
  confirmStatus: "Confirmed" | "Declined",
  parentPhone: string,
  declineReason?: string
) => {
  const token = localStorage.getItem("token");

  const payload = {
    notificationStudentId,
    confirmStatus,
    parentPhone,
    declineReason: confirmStatus === "Declined" ? declineReason || "" : null,
  };

  return await apiser.post(
    "/notifications/students/confirm",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};
export const getPendingVaccinationConfirmations = async () => {
  const token = localStorage.getItem("token");

    const res = await apiser.get("/notifications/students/pending", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
export const getApprovedMedicationRequests = () => {
  const token = localStorage.getItem("token");

  return apiser.get("/medication-requests/approved", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const createMedicationIntakeLog = async (payload: {
  requestId: number;
  studentId: number;
  givenBy: string;
  notes: string;
}) => {
  const token = localStorage.getItem("token");

  return await apiser.post(
    "/medication-requests/logs",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};
export const createArticle = async (payload: {
    title: string;
    imageUrl: string;
    htmlContent: string;
}) => {
    const token = localStorage.getItem("token");

    return await apiser.post("/article/post", payload, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
};
export const getAllArticles = async () => {
    const token = localStorage.getItem("token");

    const res = await apiser.get("/article/get", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
};
export const getArticleById = async (id: number) => {
    const token = localStorage.getItem("token");

    const res = await apiser.get(`/article/get${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
};
export const getReportByType = async (type: string) => {
  const token = localStorage.getItem("token");

    const res = await apiser.get(`/report/${type}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data; // { bar: [], pie: [] }
};
// Gọi thống kê tổng quan (Overview)
export const getOverviewStatistics = async () => {
  const token = localStorage.getItem("token");

  const res = await apiser.get("/statistic/overview", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
export const getHealthNews = () => {
    return apiser.get("/News/health");
};