import { Routes, Route } from "react-router-dom";


import LeftSideMedicalStaff from "../components/LeftSideMedicalStaff";
import SendingMedicine from "./SendingMedicine";


const MedicalStaffPage = () => {
    return (

        <Routes>

            <Route element={<LeftSideMedicalStaff />}>
                <Route path="SendingMedicine" element={<SendingMedicine/> }>  </Route>
            </Route>


        </Routes>


    )
}
export default MedicalStaffPage;

