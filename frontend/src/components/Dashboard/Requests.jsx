import { Link, Outlet } from "react-router-dom";
import DataCard from "./DataCard";

const Requests = () => {
 return (
  <div className="px-4 py-6">
    
    <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
      Requests
    </h2>

    <div className="grid grid-cols-1 place-items-center gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      
      <Link to="/admin/requests" className="w-full flex justify-center">
        <DataCard heading="All" type="request" data="all" />
      </Link>

      <Link to="/admin/requests/interested" className="w-full flex justify-center">
        <DataCard heading="Interested" type="request" data="interested" />
      </Link>

      <Link to="/admin/requests/accepted" className="w-full flex justify-center">
        <DataCard heading="Accepted" type="request" data="accepted" />
      </Link>

      <Link to="/admin/requests/rejected" className="w-full flex justify-center">
        <DataCard heading="Rejected" type="request" data="rejected" />
      </Link>

      <Link to="/admin/requests/ignored" className="w-full flex justify-center">
        <DataCard heading="Ignored" type="request" data="ignored" />
      </Link>

    </div>

    <div className="mt-6">
      <Outlet />
    </div>

  </div>
);

};

export default Requests;