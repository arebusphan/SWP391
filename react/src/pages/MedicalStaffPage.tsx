import { Routes, Route } from "react-router-dom";


import LeftSideMedicalStaff from "../components/LeftSideMedicalStaff";


const MedicalStaffPage = () => {
    return (

        <Routes>

            <Route element={<LeftSideMedicalStaff />}>
          
            </Route>


        </Routes>


    )
}
export default MedicalStaffPage;

