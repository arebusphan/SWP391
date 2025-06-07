import { Routes, Route } from "react-router-dom";


import LeftSideMedicalStaff from "../components/LeftSideMedicalStaff";
import SendingMedicine from "./SendingMedicine";

import RightSideMedicalStaff from "../components/RightSideMedicalStaff";
import StudentProfileList from "./StudentProfileList";
import PendingMedicationRequests from "./PendingMedicationRequests";
const MedicalStaffPage = () => {
    return (

        <Routes>

            <Route element={<LeftSideMedicalStaff />}>
                <Route index element={<RightSideMedicalStaff />} />
                <Route path="SendingMedicine" element={<SendingMedicine />}>  </Route>
                <Route path="StudentProfile" element={<StudentProfileList />} />
                <Route path="RequestForMedication" element={<PendingMedicationRequests />} />
            </Route>


        </Routes>


    )
}
export default MedicalStaffPage;

