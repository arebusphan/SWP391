import { Routes, Route } from "react-router-dom";

import RightSide from "./RightSide";
import LeftSideParent from "../components/LeftSideParent";



const ParentPage = () => {
    return (

        <Routes>

            <Route  element={<LeftSideParent />}>
                <Route index element={<RightSide/>} />
            </Route>


        </Routes>


    )
}
export default ParentPage;

