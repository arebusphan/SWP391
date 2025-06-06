import { Routes, Route } from "react-router-dom";


import LeftSideParent from "../components/LeftSideParent";
import RightSideParent from "./RightSideParent";
import InfoofParent from "../components/InfoofParent";
import SendingMedicine from "./SendingMedicine";



const ParentPage = () => {
    return (

        <Routes>
            <Route  element={<LeftSideParent />}>
                <Route index element={<RightSideParent />} />
                <Route path="Info" element={<InfoofParent />} />
                <Route path="SendingMedicine" element={<SendingMedicine />} />
            </Route>
        </Routes>


    )
}
export default ParentPage;

