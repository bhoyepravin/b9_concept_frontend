import React from "react";
import Navbar from "../componants/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../componants/Footer/Footer";
import MedicalConditionsMarquee from "../componants/MedicalConditionsMarquee/MedicalConditionsMarquee";

function Layout() {
  return (
    <div className="">
      <Navbar />
      <MedicalConditionsMarquee />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Layout;
