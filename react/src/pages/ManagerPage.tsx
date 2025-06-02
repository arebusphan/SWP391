import { Routes, Route } from "react-router-dom";
import LeftSideManager from "./LeftSideManager";






const ManagerPage = () => {
    return (
        <Routes>
            <Route element={< LeftSideManager />}>
                <Route index element={} />
                
            </Route>
        </Routes>


    )
}
export default ManagerPage;

