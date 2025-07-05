import { Routes, Route } from "react-router-dom";
import LeftSideManager from "./LeftSideManager";
import Manage from "../components/Manage";
import StatisticView from "../components/ManagerPage/StatisticsView";
import ReportView from "../components/ManagerPage/ReportView"





const ManagerPage = () => {
    return (
        <Routes>    
            <Route element={< LeftSideManager />}>
                <Route index element={<Manage />} />
                <Route path="statisticview" element={<StatisticView />} />
                <Route path="reportview" element={<ReportView />} />
            </Route>
        </Routes>


    )
}
export default ManagerPage;

