import { Routes, Route } from "react-router-dom";

import LeftSideMedicalStaff from "../components/LeftSideMedicalStaff";
import SendingMedicine from "./SendingMedicine";

import RightSideMedicalStaff from "../components/RightSideMedicalStaff";
import StudentProfileList from "./StudentProfileList";
import PendingMedicationRequests from "./PendingMedicationRequests";


import HealthCheckForm from "./HealthCheckForm";

<<<<<<< Updated upstream
=======


import StudentDetailPage from "./StudentDetailPage";
import SuppliesWarehose from "./SuppliesWarehouse";
import IncidentManagement from "./IncidentManagement";
>>>>>>> Stashed changes


import StudentDetailPage from "./StudentDetailPage";
import SuppliesWarehose from "./SuppliesWarehouse";
import IncidentManagement from "./IncidentManagement";

// Thêm 3 màn mới tương ứng 3 API
import NotificationCreate from "./NotificationCreate"; // API 1
import ConfirmStudentList from "./ConfirmStudentList"; // API 2
import VaccinationResultForm from "./VaccinationResultForm"; // API 3
const MedicalStaffPage = () => {
    return (
        <Routes>
            <Route element={<LeftSideMedicalStaff />}>
                <Route index element={<RightSideMedicalStaff />} />
                <Route path="SendingMedicine" element={<SendingMedicine />} />
                <Route path="StudentProfile" element={<StudentProfileList />} />
                <Route path="RequestForMedication" element={<PendingMedicationRequests />} />
                <Route path="Vaccination" element={<NotificationCreate />} /> {/* API 1 */}
                <Route path="ConfirmStudents" element={<ConfirmStudentList />} /> {/* API 2 */}
                <Route path="VaccinationResult" element={<VaccinationResultForm />} /> {/* API 3 */}
                <Route path="HealthCheck" element={<HealthCheckForm />} />
                <Route path="SuppliesWarehouse" element={<SuppliesWarehose />} />
                <Route path="IncidentManagement" element={<IncidentManagement />} />
                <Route path="student-detail/:studentId" element={<StudentDetailPage />} /> 
            </Route>
        </Routes>
    );
};

export default MedicalStaffPage;
