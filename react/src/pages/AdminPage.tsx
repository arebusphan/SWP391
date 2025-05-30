import { Routes, Route } from "react-router-dom";

import RightSide from "./RightSide";

import LeftSideAdmin from "../components/LeftSideAdmin";


const AdminPage = () => {
    return (

        <Routes>

            <Route element={<LeftSideAdmin />}>
                <Route index element={<RightSide />} />
            </Route>


        </Routes>


    )
}
export default AdminPage;

