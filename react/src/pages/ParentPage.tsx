import { Routes, Route, Navigate } from "react-router-dom";

import LeftSideParent from "../components/LeftSideParent";

import InfoofParent from "../components/InfoofParent";
import SendingMedicineView from "../components/ParentPage/SendMedicineView";
import Notificationview from "../components/ParentPage/Notificationview";
import VaccinationConfirmation from "../components/ParentPage/VaccinationConfirmation";
import StudentHealthCheckList from "../components/ParentPage/ParentHealthCheck";
import IncidentHistoryParent from "./IncidentHistoryParent";
import ParentVaccineResult from "../components/ParentPage/ParentVaccineResult";

const ParentPage = () => {
    return (
        <Routes>
            <Route element={<LeftSideParent />}>
                {/* ✅ Mặc định chuyển hướng về Info */}
                <Route index element={<Navigate to="Info" replace />} />

                <Route path="Info" element={<InfoofParent />} />
                <Route path="SendingMedicine" element={<SendingMedicineView />} />
                <Route path="Notificationview" element={<Notificationview />} />
                <Route path="VaccinationConfirmation" element={<VaccinationConfirmation />} />
                <Route path="VaccineResult" element={<ParentVaccineResult />} />
                <Route path="IncidentHistory" element={<IncidentHistoryParent />} />
                <Route path="parent-health-check" element={<StudentHealthCheckList />} />
            </Route>
        </Routes>
    );
};

export default ParentPage;
