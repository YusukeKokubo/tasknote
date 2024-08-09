import { Outlet, useNavigate } from "react-router-dom"

function Layout() {
  const navigate = useNavigate()
  return (
    <>
      <div className="Header">
        <button onClick={() => navigate("/")}>home</button>
        <button onClick={() => navigate("/about")}>about</button>
        <button onClick={() => navigate("/about/a")}>about/a</button>
      </div>
      <Outlet />
    </>
  )
}

export default Layout
