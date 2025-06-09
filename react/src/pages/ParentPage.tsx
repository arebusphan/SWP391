import { Routes, Route } from "react-router-dom";


import LeftSideParent from "../components/LeftSideParent";
import RightSideParent from "./RightSideParent";
import InfoofParent from "../components/InfoofParent";
import SendingMedicineView from "../components/ParentPage/SendMedicineView";



const ParentPage = () => {
    return (

        <Routes>
            <Route element={<LeftSideParent />}>
                <Route index element={<RightSideParent />} />
                <Route path="Info" element={<InfoofParent />} />
                <Route path="SendingMedicine" element={<SendingMedicineView />} />
            </Route>
        </Routes>


    )
}
export default ParentPage;