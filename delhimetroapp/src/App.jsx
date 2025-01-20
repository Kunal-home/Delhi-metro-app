import  "./App.css";
import Header from "./component/header";
import Navbar from "./component/Navbar";
import Map from "./component/map";
import Newroute from "./component/newroute";
import AdminDashboard from "./component/AdminDashboard";
import Notification from "./component/Notification";
import Adminlogin from "./component/Adminlogin";
import AdminFareManager from "./component/AdminFareManager";
import Locbutton from "./component/Locbutton";
import Findmetro from "./component/findmetro";
import Home from "./component/Home";
import Routes from "./component/Routes";
import Fare from "./component/Fare";
import ErrorPage from "./ErrorPage";
import { createBrowserRouter , RouterProvider} from "react-router-dom";
import AddStationForm from "./component/AddStationForm";


function App(){
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <><Header/>
          <Navbar /> {/* Navbar is now inside the routing context */}
          <Home />
          
        </>
      ),
      errorElement: (
        <><Header/>
          <Navbar /> {/* Ensure Navbar is shown even on error pages */}
          <ErrorPage />
        </>
      ),
    },
    {
      path: "/routes",
      element: (
        <><Header/>
          <Navbar />
          <Routes />
        </>
      ),
    },
    {
      path: "/fare",
      element: (
        <><Header/>
          <Navbar />
          <Fare />
        </>
      ),
    },
    {
      path: "/map",
      element: (
        <><Header/>
          <Navbar />
          <Map />
        </>
      ),
    },
    {
      path: "/show",
      element: (
        <><Header/>
          <Navbar />
          <Locbutton/>
        </>
      ),
    },
    {
      path: "/notification",
      element: (
        <><Header/>
          <Navbar />
          <Notification/>
        </>
      ),
    },
    {
      path: "/admin-login",
      element: (
        <Adminlogin/>
        
      ),
    },
    {
      path: "/admin-dashboard",
      element: (
        <AdminDashboard />
        
      ),
    },
    {
      path: "/admin-fare-manager",
      element: (
        <AdminFareManager />
        
      ),
    },
    {
      path: "/addstation",
      element: (
        <AddStationForm />
        
      ),
    },
  ]);

return <>



 <RouterProvider router={router} />



</>

}

export default App;