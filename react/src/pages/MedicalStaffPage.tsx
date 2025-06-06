import { Routes, Route } from "react-router-dom";


import LeftSideMedicalStaff from "../components/LeftSideMedicalStaff";
import SendingMedicine from "./SendingMedicine";

import RightSideMedicalStaff from "../components/RightSideMedicalStaff";


const MedicalStaffPage = () => {
    return (

        <Routes>

            <Route element={<LeftSideMedicalStaff />}>
                <Route index element={<RightSideMedicalStaff />} />
                <Route path="SendingMedicine" element={<SendingMedicine/> }>  </Route>
            </Route>


        </Routes>


    )
}
export default MedicalStaffPage;

