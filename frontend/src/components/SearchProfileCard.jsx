/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { abbreviateNumber, capitalize } from "../utils/constants";

const SearchProfileCard = ({ user }) => {
  const [requestCount, setRequestCount] = useState(null);

  const formattedName = (firstName, lastName) => {
    const truncatedLastName =
      lastName?.length > 14 ? `${lastName.slice(0, 14)}...` : lastName;
    return `${capitalize(firstName)} ${capitalize(truncatedLastName)}`;
  };

  const getRequestCount = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BackendURL + "/user/totalStatus/" + user._id,
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
      }
      setRequestCount(res.data.requestCount);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.error || "Something went wrong!");
      } else if (err.request) {
        toast.error("No response from the server. Please try again.");
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (user?._id) {
      getRequestCount();
    }
  }, [user]);

 return (
  <div className="flex w-full items-center justify-between rounded-md border border-border bg-cardBg p-4 transition hover:shadow-sm">
    
    <Link
      className="flex w-full items-center gap-4"
      to={`/profile/${user?.username}`}
    >
      {/* Avatar */}
      <img
        src={user?.avatar || "https://via.placeholder.com/150"}
        alt="User"
        className="size-14 rounded-full object-cover shrink-0"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="flex items-center gap-2 text-base font-semibold text-text line-clamp-1">
          {formattedName(user.firstName, user.lastName)}
          {user?.isPremium && (
            <MdOutlineWorkspacePremium className="size-5 text-yellow-500" />
          )}
        </h3>

        <p className="line-clamp-1 text-sm text-textMuted">
          {user?.headline || "No information"}
        </p>
      </div>

      {/* Stats */}
      <div className="hidden xs:flex gap-3">
        
        <div className="flex flex-col items-center rounded-md bg-bg px-3 py-1.5">
          <p className="text-sm font-semibold text-text">
            {requestCount?.followers != null
              ? abbreviateNumber(requestCount.followers)
              : "NA"}
          </p>
          <p className="text-xs text-textMuted">Followers</p>
        </div>

        <div className="flex flex-col items-center rounded-md bg-bg px-3 py-1.5">
          <p className="text-sm font-semibold text-text">
            {requestCount?.following != null
              ? abbreviateNumber(requestCount.following)
              : "NA"}
          </p>
          <p className="text-xs text-textMuted">Following</p>
        </div>

      </div>
    </Link>

  </div>
);
};

export default SearchProfileCard;