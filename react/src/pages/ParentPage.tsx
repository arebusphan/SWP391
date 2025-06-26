import { Routes, Route } from "react-router-dom";


import LeftSideParent from "../components/LeftSideParent";
import RightSideParent from "./RightSideParent";
import InfoofParent from "../components/InfoofParent";
import SendingMedicineView from "../components/ParentPage/SendMedicineView";
import Notificationview from "../components/ParentPage/Notificationview";
import Historyview from "../components/ParentPage/Historyview";

import IncidentHistory from "./IncidentHistory";

import ParentHealthForm from "../components/ParentPage/ParentHealthForm";

import { useAuth } from "../context/AuthContext";


const ParentPage = () => {
    

    return (

        <Routes>
            <Route element={<LeftSideParent />}>
                <Route index element={<RightSideParent />} />
                <Route path="Info" element={<InfoofParent />} />
                <Route path="SendingMedicine" element={<SendingMedicineView />} />
                <Route path="Notificationview" element ={<Notificationview/>}/>
                <Route path="Historyview" element={<Historyview />} />

                <Route path="IncidentHistory" element={<IncidentHistory/>} />

                <Route path="SubmitHealthProfile" element={<ParentHealthForm />} />

            </Route>
        </Routes>


    )
}
export default ParentPage;