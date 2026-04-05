import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { capitalize } from "../../utils/constants";

const RequestDataCard = ({ request }) => {
  const formattedName = (firstName, lastName) => {
    const truncatedLastName =
      lastName?.length > 14 ? `${lastName.slice(0, 14)}...` : lastName;
    return `${capitalize(firstName)} ${capitalize(truncatedLastName)}`;
  };

  const renderButtons = {
    interested: (
      <div className="rounded-md bg-blue-500 px-2 py-1 font-semibold hover:cursor-pointer">
        Interested
      </div>
    ),
    accepted: (
      <>
        <div className="rounded-md bg-green-500 px-2 py-1 font-semibold hover:cursor-pointer">
          Accepted
        </div>
      </>
    ),
    rejected: (
      <div className="rounded-md bg-red-500 px-2 py-1 font-semibold hover:cursor-pointer">
        Rejected
      </div>
    ),
    ignored: (
      <>
        <button className="rounded-md bg-gray-500 px-2 py-1 font-semibold hover:cursor-pointer">
          Ignored
        </button>
      </>
    ),
  };

 return (
  <div className="relative w-full sm:w-2/3">
    <div className="flex flex-col items-center">

      {/* From User */}
      <div className="flex w-full items-center justify-between gap-3 rounded-t-lg bg-cardBg px-4 py-2">
        <div className="flex items-center gap-3">
          
          <div className="size-16 rounded-full overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src={request.fromUserId.avatar}
              alt="User Profile"
            />
          </div>

          <div className="w-5/12 sm:w-7/12 md:w-8/12">
            <h3 className="text-md font-semibold sm:text-lg">
              {formattedName(
                request.fromUserId.firstName,
                request.fromUserId.lastName
              )}
            </h3>
            <p className="text-sm text-textMuted">
              {request.fromUserId?.username || "No info"}
            </p>
            <p className="line-clamp-1 text-sm text-gray-600">
              {request.fromUserId?.headline || "No info"}
            </p>
          </div>
        </div>

        <Link
          to={`/profile/${request.fromUserId.username}`}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white transition hover:bg-hover"
        >
          View
        </Link>
      </div>

      {/* Status */}
      <div className="z-10 -my-2">
        {renderButtons[request?.status]}
      </div>

      {/* To User */}
      <div className="flex w-full items-center justify-between gap-3 rounded-b-lg bg-cardBg px-4 py-2">
        <div className="flex items-center gap-3">
          
          <div className="size-16 rounded-full overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src={request.toUserId.avatar}
              alt="User Profile"
            />
          </div>

          <div className="w-5/12 sm:w-7/12 md:w-8/12">
            <h3 className="text-md font-semibold sm:text-lg">
              {formattedName(
                request.toUserId.firstName,
                request.toUserId.lastName
              )}
            </h3>
            <p className="text-sm text-textMuted">
              {request.toUserId?.username || "No info"}
            </p>
            <p className="line-clamp-1 text-sm text-gray-600">
              {request.toUserId?.headline || "No info"}
            </p>
          </div>
        </div>

        <Link
          to={`/profile/${request.toUserId.username}`}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white transition hover:bg-hover"
        >
          View
        </Link>
      </div>

    </div>
  </div>
);

};

RequestDataCard.propTypes = {
  request: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    fromUserId: PropTypes.shape({
      username: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    }).isRequired,
    toUserId: PropTypes.shape({
      username: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    }).isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default RequestDataCard;