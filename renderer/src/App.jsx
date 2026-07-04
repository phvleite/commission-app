import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

export default function App() {
    return (
        <>
            <Sidebar />
            <div className="main-content">
                <Outlet />
            </div>
        </>
    );
}
