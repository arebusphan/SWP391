import { Routes, Route, Navigate } from "react-router-dom";

import LeftSideManager from "./LeftSideManager";
import Manage from "../components/Manage";
import StatisticView from "../components/ManagerPage/StatisticsView";
import ReportView from "../components/ManagerPage/ReportView";

const ManagerPage = () => {
    return (
        <Routes>
            <Route element={<LeftSideManager />}>
                {/* ✅ Mặc định chuyển về statisticview */}
                <Route index element={<Navigate to="statisticview" replace />} />
                
                <Route path="statisticview" element={<StatisticView />} />
                <Route path="reportview" element={<ReportView />} />
                <Route path="manage" element={<Manage />} /> {/* giữ lại nếu muốn truy cập trực tiếp */}
            </Route>
        </Routes>
    );
};

export default ManagerPage;
