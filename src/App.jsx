import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./Pages/Home/Home";
import Login from "./auth/LoginForm";
import Register from "./auth/RegistrationForm";
import Dashboard from "./componants/Dashboard/Dashboard";
import AdminDashboard from "./componants/AdminDashboard/AdminDashboard";
import { AuthProvider } from "./Contexts/AuthContext";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "home", element: <Home /> },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/admindashboard",
      element: <AdminDashboard />,
    },
    {
      path: "*",
      element: <Login />,
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;

// import React from "react";
// import {
//   createBrowserRouter,
//   RouterProvider,
//   Navigate,
// } from "react-router-dom";
// import Layout from "./Layout/Layout";
// import Home from "./Pages/Home/Home";
// import Login from "./auth/LoginForm";
// import Register from "./auth/RegistrationForm";
// import Dashboard from "./componants/Dashboard/Dashboard";
// import AdminDashboard from "./componants/AdminDashboard/AdminDashboard";
// import { AuthProvider, useAuth } from "./Contexts/AuthContext";

// // Protected Route component
// const ProtectedRoute = ({ children, requiredRole = null }) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (requiredRole && user.roleId !== requiredRole) {
//     // If user doesn't have required role, redirect to their appropriate dashboard
//     const redirectTo = user.roleId === 1 ? "/admindashboard" : "/dashboard";
//     return <Navigate to={redirectTo} replace />;
//   }

//   return children;
// };

// function App() {
//   const router = createBrowserRouter([
//     {
//       path: "/",
//       element: <Layout />,
//       children: [
//         { index: true, element: <Home /> },
//         { path: "home", element: <Home /> },
//       ],
//     },
//     {
//       path: "/login",
//       element: <Login />,
//     },
//     {
//       path: "/register",
//       element: <Register />,
//     },
//     {
//       path: "/dashboard",
//       element: (
//         <ProtectedRoute requiredRole={2}>
//           <Dashboard />
//         </ProtectedRoute>
//       ),
//     },
//     {
//       path: "/admindashboard",
//       element: (
//         <ProtectedRoute requiredRole={1}>
//           <AdminDashboard />
//         </ProtectedRoute>
//       ),
//     },
//     {
//       path: "*",
//       element: <Login />,
//     },
//   ]);

//   return (
//     <AuthProvider>
//       <RouterProvider router={router} />
//     </AuthProvider>
//   );
// }

// export default App;

// import React from "react";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Layout from "./Layout/Layout";
// import Home from "./Pages/Home/Home";
// import Login from "./auth/LoginForm";
// import Register from "./auth/RegistrationForm";
// import Dashboard from "./componants/Dashboard/Dashboard";
// import AdminDashboard from "./componants/AdminDashboard/AdminDashboard";
// import { AuthProvider } from "./Contexts/AuthContext";

// function App() {
//   const router = createBrowserRouter([
//     {
//       path: "/",
//       element: <Layout />,
//       children: [
//         { index: true, element: <Home /> },
//         { path: "home", element: <Home /> },
//       ],
//     },
//     {
//       path: "/login",
//       element: <Login />,
//     },
//     {
//       path: "/register",
//       element: <Register />,
//     },
//     {
//       path: "/dashboard",
//       element: <Dashboard />,
//     },
//     {
//       path: "/admindashboard",
//       element: <AdminDashboard />,
//     },
//     {
//       path: "*",
//       element: <Login />,
//     },
//   ]);

//   return (
//     <AuthProvider>
//       <RouterProvider router={router} />
//     </AuthProvider>
//   );
// }

// export default App;

// import React from "react";
// import {
//   createBrowserRouter,
//   createRoutesFromElements,
//   Route,
//   RouterProvider,
// } from "react-router-dom";
// import Layout from "./Layout/Layout";
// import Home from "./Pages/Home/Home";
// import Login from "./componants/Login/Login";
// import Register from "./componants/Register/Register";
// import Dashboard from "./componants/Dashboard/Dashboard";
// import { Navigate } from "react-router-dom";

// function App() {
//   const router = createBrowserRouter(
//     createRoutesFromElements(
//       <Route path="/" element={<Layout />}>
//         <Route index element={<Home />} />
//         <Route path="home" element={<Home />} />
//         {/* <Route path="contact" element={<ContactUsPage />} />
//         <Route path="about" element={<AboutPage />} />
//         <Route path="services" element={<ServicesPage />} />
//         <Route path="training" element={<TrainingPage />} />
//         <Route path="*" element={<PageNotFound />} /> */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/" element={<Navigate to="/login" />} />
//       </Route>
//     )
//   );

//   return <RouterProvider router={router} />;
// }

// export default App;
