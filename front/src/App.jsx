import { Routes, Navigate, Route, useLocation } from "react-router-dom"
import NavBar from "./components/NavBar";
import PrivateRoute from "./components/PrivateRoute";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import BoardDetail from "./pages/BoardDetail";
import Boards from "./pages/Boards";


function App() {
    const loc = useLocation();
    const hideNav = loc.pathname === "/login" || loc.pathname === "/signup";
    return (
        <div className="min-h-screen">
            {!hideNav && <NavBar />}
            <div className="">
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    <Route element={<PrivateRoute />}>
                        <Route path="/boards" element={<Boards />} />
                        <Route path="/boards/:id" element={<BoardDetail />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/boards" />} />
                </Routes>
            </div>
        </div>
    )
}

export default App