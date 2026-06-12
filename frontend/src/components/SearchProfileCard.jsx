/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { MdOutlineWorkspacePremium, MdLock } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { abbreviateNumber, capitalize } from "../utils/constants";

const SearchProfileCard = ({ user }) => {
  const navigate = useNavigate();
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
        { withCredentials: true }
      );
      setRequestCount(res.data.requestCount);
    } catch (err) {
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
        {/* 1. Avatar (Put this back!) */}
        <img
          src={user?.avatar || "https://via.placeholder.com/150"}
          alt="User"
          className="size-14 rounded-full object-cover shrink-0"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* 2. Name & Premium Badge (Put this back!) */}
          <h3 className="flex items-center gap-2 text-base font-semibold text-text line-clamp-1">
            {formattedName(user.firstName, user.lastName)}
            {user?.isPremium && (
              <MdOutlineWorkspacePremium className="size-5 text-yellow-500" />
            )}
          </h3>

          <p className="line-clamp-1 text-sm text-textMuted">
            {user?.headline || "No information"}
          </p>

          {/* 3. Gated Bio Logic */}
          {!user.about ? (
            <span
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate("/premium");
              }}
              className="mt-1 flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:underline cursor-pointer"
            >
              <MdLock className="size-3" />
              Upgrade to see bio & contact info
            </span>
          ) : (
            <p className="mt-1 line-clamp-1 text-[11px] italic text-textMuted">
              {user.about}
            </p>
          )}
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
