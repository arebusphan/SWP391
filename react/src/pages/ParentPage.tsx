import { Routes, Route } from "react-router-dom";


import LeftSideParent from "../components/LeftSideParent";
import RightSideParent from "./RightSideParent";
import InfoofParent from "../components/InfoofParent";
import SendingMedicineView from "../components/ParentPage/SendMedicineView";
import Notificationview from "../components/ParentPage/Notificationview";
import Historyview from "../components/ParentPage/Historyview";
import ParentHealthForm from "../components/ParentPage/ParentHealthForm";

const ParentPage = () => {
    return (

        <Routes>
            <Route element={<LeftSideParent />}>
                <Route index element={<RightSideParent />} />
                <Route path="Info" element={<InfoofParent />} />
                <Route path="SendingMedicine" element={<SendingMedicineView />} />
                <Route path="Notificationview" element ={<Notificationview/>}/>
                <Route path="Historyview" element={<Historyview />} />
                <Route path="SubmitHealthProfile" element={<ParentHealthForm />} />
            </Route>
        </Routes>


    )
}
export default ParentPage;