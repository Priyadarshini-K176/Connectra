import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import NavBar from "./NavBar";

const FOOTER_CONTAINING_LINKS = [
  "/",
  "/team",
  "/faqs",
  "/support",
  "/contact-form",
];

const BodyContainer = () => {
  const location = useLocation();

  return (
  <>
    <NavBar />

    <div className="mx-auto mt-16 min-h-[calc(100vh-5rem)] max-w-6xl px-4">
      <Outlet />
    </div>

    {FOOTER_CONTAINING_LINKS.includes(location.pathname) && <Footer />}
  </>
);
};
export default BodyContainer;