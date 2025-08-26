import { useLocation, Navigate, Outlet } from "react-router-dom"

function PrivateRoute() {
  const token = sessionStorage.getItem("token")
  const loc = useLocation()
  return (token ?
    (<Outlet />) : (<Navigate to="/login" state={{ from: loc }} replace />)
  )
}

export default PrivateRoute