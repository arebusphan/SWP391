import { Outlet, useNavigate } from "react-router-dom";

const LeftSideParent = () => {
    const navigate = useNavigate();
    return (
        <div className="h-screen flex">
            <div className="w-64 bg-blue-900 text-white flex flex-col p-6 space-y-4">

                <div onClick={() => navigate('/ParentPage/Info')} className="hover:bg-blue-700 rounded-lg px-4 py-2 cursor-pointer">Profile</div>
                <div onClick={() => navigate('/ParentPage/SendingMedicine')} className="hover:bg-blue-700 rounded-lg px-4 py-2 cursor-pointer">Sending Medicine </div>
                <div onClick={() => navigate('/')} className="hover:bg-blue-700 rounded-lg px-4 py-2 cursor-pointer">Notification</div>
                <div onClick={() => navigate('/')} className="hover:bg-blue-700 rounded-lg px-4 py-2 cursor-pointer">History</div>
            </div>

            <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
                <Outlet />
            </div>
        </div>


    )

}
export default LeftSideParent;