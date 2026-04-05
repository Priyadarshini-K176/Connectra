import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import NetworkCard from "../../components/NetworkCard";
import {
  addInterestedRequests,
  setCurrentPage,
  setTotalPages,
  setTotalRequest,
} from "../../utils/interestedRequestsSlice";

const Interested = () => {
  const dispatch = useDispatch();
  const interestedState = useSelector((store) => store.interested);
  const {
    data: interested,
    totalPages,
    currentPage,
    totalRequest,
  } = interestedState;
  const [isLoading, setIsLoading] = useState(false);

  const getInterestedRequest = async (page) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BackendURL}/request/received?page=${page}&limit=10`,
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
      } else {
        dispatch(addInterestedRequests(res.data.user));
        dispatch(setTotalPages(res.data.pagination.totalPages));
        dispatch(setCurrentPage(page));
        dispatch(setTotalRequest(res.data.pagination.total));
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (interested.length === 0) {
      getInterestedRequest(1);
    }
  }, [dispatch, interested.length]);

  const loadMoreInterested = () => {
    if (currentPage < totalPages) {
      getInterestedRequest(currentPage + 1);
    }
  };

 return (
  <div className="rounded-md bg-bgSecondary">
    
    <h2 className="px-4 py-3 text-xl font-semibold text-gray-800">
      Interested ({totalRequest})
    </h2>

    <hr className="border-border" />

    <div className="flex flex-col divide-y divide-border">
      {interested?.length === 0 ? (
        <div className="py-5 text-center text-sm text-textMuted">
          No pending requests yet.{" "}
          <Link to="/feed" className="font-medium text-primary hover:underline">
            Explore profiles
          </Link>
        </div>
      ) : (
        interested?.map((request) => (
          <NetworkCard
            type="interested"
            request={request}
            key={request._id}
          />
        ))
      )}
    </div>

    {currentPage < totalPages && (
      <div className="py-4 text-center">
        <button
          onClick={loadMoreInterested}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-hover disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Show more"}
        </button>
      </div>
    )}

  </div>
);
};

export default Interested;