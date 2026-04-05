/*eslint-disable react/prop-types */
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { capitalize } from "../utils/constants";

const ProfileSearchCard = ({ userData, onClick }) => {
  return (
  <Link to={`/profile/${userData?.username}`} onClick={onClick}>
    <div className="flex items-center gap-2 rounded-md px-2 py-1 transition hover:bg-hover">
      
      <img
        src={userData?.avatar}
        alt={userData?.firstName}
        className="size-8 rounded-full object-cover"
      />

      <div className="min-w-0">
        <h3 className="line-clamp-1 text-sm font-medium text-text">
          {capitalize(userData?.firstName)}{" "}
          {capitalize(userData?.lastName)}
        </h3>

        <p className="line-clamp-1 text-xs text-textMuted">
          {userData?.headline || "No headline"}
        </p>
      </div>

    </div>
  </Link>
);
};

export default ProfileSearchCard;