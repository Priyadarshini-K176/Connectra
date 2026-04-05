import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Quick overview of your platform
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-gray-500 text-sm">Total Users</p>
          <h3 className="text-2xl font-semibold text-gray-800 mt-2">
            1200
          </h3>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-gray-500 text-sm">Requests</p>
          <h3 className="text-2xl font-semibold text-gray-800 mt-2">
            85
          </h3>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-gray-500 text-sm">Pending</p>
          <h3 className="text-2xl font-semibold text-gray-800 mt-2">
            20
          </h3>
        </div>

      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        <Link
          to="/admin/users"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            Manage Users
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            View and manage all users
          </p>
        </Link>

        <Link
          to="/admin/requests"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            View Requests
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Check all user requests
          </p>
        </Link>

      </div>
    </div>
  );
};

export default Dashboard;