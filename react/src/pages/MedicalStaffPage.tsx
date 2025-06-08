import { Routes, Route } from "react-router-dom";


import LeftSideMedicalStaff from "../components/LeftSideMedicalStaff";
import SendingMedicine from "./SendingMedicine";

import RightSideMedicalStaff from "../components/RightSideMedicalStaff";
import StudentProfileList from "./StudentProfileList";
import PendingMedicationRequests from "./PendingMedicationRequests";

import VaccinationForm from "./VaccinationForm";
import HealthCheckForm from "./HealthCheckForm";


import MedicalIncident from './MedicalIncident';
import MaterialManagement from './MaterialManagement';

const MedicalStaffPage = () => {
    return (

        <Routes>

            <Route element={<LeftSideMedicalStaff />}>
                <Route index element={<RightSideMedicalStaff />} />
                <Route path="SendingMedicine" element={<SendingMedicine />}>  </Route>
                <Route path="StudentProfile" element={<StudentProfileList />} />
                <Route path="RequestForMedication" element={<PendingMedicationRequests />} />

                <Route path="Vaccination" element={<VaccinationForm />} />
                <Route path="HealthCheck" element={<HealthCheckForm />} />
                
                <Route path="MedicalIncident" element={<MedicalIncident />} />
                <Route path="MaterialManagement" element={<MaterialManagement />} />
               
            </Route>


        </Routes>


    )
}
export default MedicalStaffPage;

