import { Routes, Route } from "react-router-dom";
import LeftSideManager from "./LeftSideManager";
import Manage from "../components/Manage";







const ManagerPage = () => {
    return (
        <Routes>
            <Route element={< LeftSideManager />}>
                <Route index element={<Manage />} />
                
            </Route>
        </Routes>


    )
}
export default ManagerPage;

