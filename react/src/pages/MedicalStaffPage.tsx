import { Routes, Route, Navigate } from "react-router-dom";

import LeftSideMedicalStaff from "../components/LeftSideMedicalStaff";

import SendingMedicine from "./SendingMedicine";
import StudentProfileList from "./StudentProfileList";
import PendingMedicationRequests from "./PendingMedicationRequests";
import HealthCheckForm from "./HealthCheckForm";
import StudentDetailPage from "./StudentDetailPage";
import SuppliesWarehose from "./SuppliesWarehouse";
import IncidentManagement from "./IncidentManagement";

import NotificationCreate from "./NotificationCreate"; // API 1
import ConfirmStudentList from "./ConfirmStudentList"; // API 2
import VaccinationResultForm from "./VaccinationResultForm"; // API 3

const MedicalStaffPage = () => {
    return (
        <Routes>
            <Route element={<LeftSideMedicalStaff />}>
                {/* ✅ Mặc định về StudentProfile */}
                <Route index element={<Navigate to="StudentProfile" replace />} />

                <Route path="SendingMedicine" element={<SendingMedicine />} />
                <Route path="StudentProfile" element={<StudentProfileList />} />
                <Route path="RequestForMedication" element={<PendingMedicationRequests />} />
                <Route path="Vaccination" element={<NotificationCreate />} />
                <Route path="ConfirmStudents" element={<ConfirmStudentList />} />
                <Route path="VaccinationResult" element={<VaccinationResultForm />} />
                <Route path="HealthCheck" element={<HealthCheckForm />} />
                <Route path="MaterialManagement" element={<SuppliesWarehose />} />
                <Route path="IncidentManagement" element={<IncidentManagement />} />
                <Route path="student-detail/:studentId" element={<StudentDetailPage />} />
            </Route>
        </Routes>
    );
};

export default MedicalStaffPage;
