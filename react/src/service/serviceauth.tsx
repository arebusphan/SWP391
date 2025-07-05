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


interface MedicationRequestPayload {
  studentId: number;
  medicineName: string;
  prescriptionImage: string;
  healthStatus: string;
  note: string;
}

export const sendingmedicine = (payload: MedicationRequestPayload) => {
  const token = localStorage.getItem("token");

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

export const updateMedicationStatus = async (
  id: number,
  status: string,
  reviewedBy: number,
  rejectReason?: string
): Promise<Response> => {
  const token = localStorage.getItem("token");

  const payload: {
    status: string;
    reviewedBy: number;
    rejectReason?: string;
  } = {
    status,
    reviewedBy,
  };

  if (rejectReason) {
    payload.rejectReason = rejectReason;
  }

  const response = await fetch(`/api/medicationrequests/${id}/status`, {
    method: "PATCH", // or PUT, depending on your backend
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(payload),
  });

  return response;
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

  return axios.post("https://localhost:7195/api/User/importExcel", formData, {
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

  return axios.get("https://localhost:7195/api/notifications", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getAllClass = async () => {
  const res = await axios.get("https://localhost:7195/api/Classes/all");
  return res.data; // đừng return res.data
};


export const AddSupplies = async (
    supplyName: string,
    quantity: number,
    notes: string,
    image: string
) => {
    return await axios.post("https://localhost:7195/api/MedicalSupplies/post", {
        supplyName,
        quantity,
        notes,
        image,
        lastUsedAt: null 
    });
};



export const getStudentsByClassId = async (classId: number) => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`https://localhost:7195/api/students/by-class/${classId}`, {
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
    return axios.post("https://localhost:7195/api/Incident/post", {
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
    return await axios.put("https://localhost:7195/api/MedicalSupplies/post/used", {
        supplyId,
        quantity 
    });
};
export const GetSupplies = async () => {
    return await axios.get("https://localhost:7195/api/MedicalSupplies/get");

}
export const getAllStudents = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get("https://localhost:7195/api/students/get-all-student", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


export async function findUserByEmailOrPhone(input: string) {
  const params = new URLSearchParams();

  // Tự động xác định là email hay phone
  if (input.includes("@")) {
    params.append("email", input);
  } else {
    params.append("phone", input);
  }

  const res = await fetch(`https://localhost:7195/api/User/find-by-email-or-phone?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("User not found");

  return await res.json();
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

  return axios.post("https://localhost:7195/api/students/addstudent", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getStudentHealthProfile = async (studentId: number) => {
  const token = localStorage.getItem("token");

  return await axios.get(`https://localhost:7195/api/HealthProfile/student/${studentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createStudentHealthProfile = async (payload: {
  studentId: number;
  allergies?: string;
  chronicDiseases?: string;
  vision?: string;
  hearing?: string;
  otherNotes?: string;
}) => {
  const token = localStorage.getItem("token");

  return await axios.post("https://localhost:7195/api/HealthProfile", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
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

  return await axios.put(`https://localhost:7195/api/HealthProfile/${profileId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getMedicationIntakeLogs = async (studentId: number) => {
  const token = localStorage.getItem("token");

  const res = await axios.get(
    `https://localhost:7195/api/medication-requests/logs/${studentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const GetIncidentHistory = async () => {
    const res = await axios.get("https://localhost:7195/api/Incident/incident-supplies-history");
    return res.data;
};
export const getIncidentHistoryByGuardian = async (guardianId: number) => {
    return axios.get(`https://localhost:7195/api/Incident/guardian/${guardianId}/incidents`);
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

  return await axios.post(
    "https://localhost:7195/api/notifications/students/confirm",
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

  const res = await axios.get("https://localhost:7195/api/notifications/students/pending", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
export const getApprovedMedicationRequests = () => {
  const token = localStorage.getItem("token");

  return axios.get("https://localhost:7195/api/medication-requests/approved", {
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

  return await axios.post(
    "https://localhost:7195/api/medication-requests/logs",
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

    return await axios.post("https://localhost:7195/api/article/post", payload, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
};
export const getAllArticles = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get("https://localhost:7195/api/article/get", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
};
export const getArticleById = async (id: number) => {
    const token = localStorage.getItem("token");

    const res = await axios.get(`https://localhost:7195/api/article/get${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
};
export const getReportByType = async (type: string) => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`https://localhost:7195/api/report/${type}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data; // { bar: [], pie: [] }
};
