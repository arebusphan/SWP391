import { Routes, Route } from "react-router-dom";

import RightSide from "./RightSide";

import LeftSideMedicalStaff from "../components/LeftSideMedicalStaff";


const MedicalStaffPage = () => {
    return (

        <Routes>

            <Route element={<LeftSideMedicalStaff />}>
                <Route index element={<RightSide />} />
            </Route>


        </Routes>


    )
}
export default MedicalStaffPage;

