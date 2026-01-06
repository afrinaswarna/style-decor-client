import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home";
import Services from "../Pages/Services/Services";
import About from "../Pages/About/About";
import Contact from "../Pages/Contact/Contact";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import ServiceDetail from "../Pages/ServiceDetail/ServiceDetail";
import DashboardLayout from "../Layouts/DashboardLayout";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import MyBookings from "../Pages/MyBookings/MyBookings";
import PrivateRoutes from "../PrivateRoutes/PrivateRoutes";
import PaymentSuccess from "../Pages/Dashboard/PaymentSuccess";
import PaymentCancelled from "../Pages/Dashboard/PaymentCancelled";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory";
import Decorator from "../Pages/Decorator/Decorator";
import ApproveDecorator from "../Pages/Dashboard/ApproveDecorator";
import AdminRoutes from "../PrivateRoutes/AdminRoutes";
import UsersManagement from "../Pages/Dashboard/UsersManagement";
import AssignDecorator from "../Pages/Dashboard/AssignDecorator";
import DecoratorRoutes from "../PrivateRoutes/DecoratorRoutes";

import MyAssignedProjects from "../Pages/Dashboard/MyAssignedProjects";
import TodaySchedule from "../Pages/Dashboard/TodaySchedule";
import MyEarnings from "../Pages/Dashboard/MyEarnings";
import MyProfile from "../Pages/Dashboard/MyProfile";
import AddServices from "../Pages/Dashboard/AddServices";
import ManageServices from "../Pages/Dashboard/ManageServices";

import UpdateServices from "../Pages/Dashboard/UpdateServices";



export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "services",
        Component: Services,
      },
      {
        path: "service-detail/:id",

        Component: ServiceDetail,
      },

      {
        path: "about",
        Component: About,
      },
      {
        path: "contact",
        Component: Contact,
      },
      {
        path: "decorator",
        loader: () => fetch("/serviceCoverage.json"),
        element: (
          <PrivateRoutes>
            <Decorator></Decorator>
          </PrivateRoutes>
        ),
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },

  {
    path: "dashboard",
    element: 
      <PrivateRoutes>
        <DashboardLayout></DashboardLayout>
      </PrivateRoutes>
    ,
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: "my-booking",
        Component: MyBookings,
      },

      {
        path: "payment-history",
        Component: PaymentHistory,
      },
      {
        path: "my-profile",
        Component: MyProfile,
      },
      {
        path: "payment-success",
        Component: PaymentSuccess,
      },
      {
        path: "payment-cancelled",
        Component: PaymentCancelled,
      },
      {
        path: "add-services",
        
        element:<AdminRoutes><AddServices></AddServices></AdminRoutes>
      },
      {
        path: "manage-services",
        
        element:<AdminRoutes><ManageServices></ManageServices></AdminRoutes>
      },
      {
        path: "update-service/:id",
        
        element:<AdminRoutes><UpdateServices></UpdateServices></AdminRoutes>
      },
      {
        path: "approve-decorator",
        
        element:<AdminRoutes><ApproveDecorator></ApproveDecorator></AdminRoutes>
      },
      {
        path: "assign-decorator",

        element:<AdminRoutes><AssignDecorator></AssignDecorator></AdminRoutes>
      },
      {
        path: "users-management",

        element:<AdminRoutes><UsersManagement></UsersManagement></AdminRoutes>
      },
      {
        path:'assigned-projects',
        element:<DecoratorRoutes><MyAssignedProjects></MyAssignedProjects></DecoratorRoutes>
      },
      {
        path:'today-schedule',
        element:<DecoratorRoutes><TodaySchedule></TodaySchedule></DecoratorRoutes>
      },
      {
        path:'my-earnings',
        element:<DecoratorRoutes><MyEarnings></MyEarnings></DecoratorRoutes>
      }
    ],
  },
]);
