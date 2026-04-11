import { useEffect } from "react";
import {
  FaUserCheck,
  FaUserClock,
  FaUserFriends,
  FaUsers,
  FaStar,
} from "react-icons/fa";
import { FaUserXmark } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import { toast } from "sonner";
import { fetchRequestCount } from "../utils/requestCountSlice";

const Networks = () => {
  // const [requestCount, setRequestCount] = useState(null);
  const dispatch = useDispatch();
  const { requestCount, loading, error } = useSelector(
    (state) => state.requestCount,
  );


  useEffect(() => {
    // Fetch the initial request count when the component is mounted
    dispatch(fetchRequestCount());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error); // Display the error if there is one
    }
  }, [error]);

  return (
    <div className="mx-auto flex w-full flex-col items-center gap-6 py-10 lg:w-11/12 lg:flex-row lg:items-start lg:gap-10 xl:w-10/12">

      {/* Sidebar */}
      <div className="w-full max-w-96 rounded-2xl bg-white shadow-md border border-gray-100 lg:sticky lg:top-28 lg:w-4/12 xl:w-3/12">

        <h2 className="px-5 py-4 text-lg font-semibold text-gray-800 tracking-tight">
          Manage Your Connections
        </h2>

        <hr className="border-gray-200" />

        <div className="flex flex-col text-sm">

          {/* Item */}
          <NavLink
            to="/networks"
            end
            className={({ isActive }) =>
              `flex items-center justify-between px-5 py-3 transition-all duration-200 
             hover:bg-gray-50 ${isActive
                ? "bg-indigo-50 text-indigo-600 font-semibold border-l-4 border-indigo-500"
                : "text-gray-700"
              }`
            }
          >
            <span className="flex items-center gap-3">
              <FaUserClock /> Interested
            </span>
            {requestCount?.interestedReceived > 0 && (
              <span className="text-xs font-medium text-gray-500">
                ({requestCount?.interestedReceived})
              </span>
            )}
          </NavLink>

          <NavLink
            to="/networks/connections"
            className={({ isActive }) =>
              `flex items-center justify-between px-5 py-3 transition-all duration-200 
             hover:bg-gray-50 ${isActive
                ? "bg-indigo-50 text-indigo-600 font-semibold border-l-4 border-indigo-500"
                : "text-gray-700"
              }`
            }
          >
            <span className="flex items-center gap-3">
              <FaUsers /> Connections
            </span>
            {requestCount?.connections > 0 && (
              <span className="text-xs text-gray-500">
                ({requestCount?.connections})
              </span>
            )}
          </NavLink>

          <NavLink
            to="/networks/recommendations"
            className={({ isActive }) =>
              `flex items-center justify-between px-5 py-3 transition-all duration-200 hover:bg-gray-50 ${isActive
                ? "bg-indigo-50 text-indigo-600 font-semibold border-l-4 border-indigo-500"
                : "text-gray-700"
              }`
            }
          >
            <span className="flex items-center gap-3">
              <FaStar /> Recommendations
            </span>

          </NavLink>


          <NavLink
            to="/networks/followers"
            className={({ isActive }) =>
              `flex items-center justify-between px-5 py-3 transition-all duration-200 
             hover:bg-gray-50 ${isActive
                ? "bg-indigo-50 text-indigo-600 font-semibold border-l-4 border-indigo-500"
                : "text-gray-700"
              }`
            }
          >
            <span className="flex items-center gap-3">
              <FaUserCheck /> Followers
            </span>
            {requestCount?.followers > 0 && (
              <span className="text-xs text-gray-500">
                ({requestCount?.followers})
              </span>
            )}
          </NavLink>

          <NavLink
            to="/networks/following"
            className={({ isActive }) =>
              `flex items-center justify-between px-5 py-3 transition-all duration-200 
             hover:bg-gray-50 ${isActive
                ? "bg-indigo-50 text-indigo-600 font-semibold border-l-4 border-indigo-500"
                : "text-gray-700"
              }`
            }
          >
            <span className="flex items-center gap-3">
              <FaUserFriends /> Following
            </span>
            {requestCount?.following > 0 && (
              <span className="text-xs text-gray-500">
                ({requestCount?.following})
              </span>
            )}
          </NavLink>

          <NavLink
            to="/networks/ignored"
            className={({ isActive }) =>
              `flex items-center justify-between px-5 py-3 transition-all duration-200 
             hover:bg-gray-50 ${isActive
                ? "bg-indigo-50 text-indigo-600 font-semibold border-l-4 border-indigo-500"
                : "text-gray-700"
              }`
            }
          >
            <span className="flex items-center gap-3">
              <FaUserFriends /> Ignored
            </span>
            {requestCount?.ignoredSend > 0 && (
              <span className="text-xs text-gray-500">
                ({requestCount?.ignoredSend})
              </span>
            )}
          </NavLink>

          <NavLink
            to="/networks/rejected"
            className={({ isActive }) =>
              `flex items-center justify-between px-5 py-3 transition-all duration-200 
             hover:bg-gray-50 ${isActive
                ? "bg-indigo-50 text-indigo-600 font-semibold border-l-4 border-indigo-500"
                : "text-gray-700"
              }`
            }
          >
            <span className="flex items-center gap-3">
              <FaUserXmark /> Rejected
            </span>
            {requestCount?.rejected > 0 && (
              <span className="text-xs text-gray-500">
                ({requestCount?.rejected})
              </span>
            )}
          </NavLink>

        </div>
      </div>

      {/* Content */}
      <div className="w-full lg:w-8/12">
        <div className="rounded-2xl bg-white shadow-md border border-gray-100 p-4">
          <Outlet />
        </div>
      </div>

    </div>
  );
}

export default Networks;