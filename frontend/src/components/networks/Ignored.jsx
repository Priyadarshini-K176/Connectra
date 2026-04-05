import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import NetworkCard from "../../components/NetworkCard";
import {
  addIgnoredRequests,
  setCurrentPage,
  setTotalPages,
  setTotalRequest,
} from "../../utils/ignoredRequestsSlice";

const Ignored = () => {
  const dispatch = useDispatch();
  const ignoredState = useSelector((store) => store.ignored);
  const { data: ignored, totalPages, currentPage, totalRequest } = ignoredState;

  const [isLoading, setIsLoading] = useState(false);

  const getIgnoredRequest = async (page) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BackendURL}/request/ignored?page=${page}&limit=10`,
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res.data.message || "An error occurred");
      } else {
        dispatch(addIgnoredRequests(res.data.user));
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
    if (ignored.length === 0) {
      getIgnoredRequest(1);
    }
  }, [dispatch, ignored.length]);

  const loadMoreIgnored = () => {
    if (currentPage < totalPages) {
      getIgnoredRequest(currentPage + 1);
    }
  };

 return (
  <div className="rounded-md bg-bgSecondary">
    
    <h2 className="px-4 py-3 text-xl font-semibold text-gray-800">
      Ignored ({totalRequest})
    </h2>

    <hr className="border-border" />

    <div className="flex flex-col divide-y divide-border">
      {ignored.length === 0 ? (
        <div className="py-5 text-center text-sm text-textMuted">
          You haven’t ignored any profiles.{" "}
          <Link to="/feed" className="font-medium text-primary hover:underline">
            Explore profiles
          </Link>
        </div>
      ) : (
        ignored.map((request) => (
          <NetworkCard
            type="ignored"
            request={request}
            key={request._id}
          />
        ))
      )}
    </div>

    {currentPage < totalPages && (
      <div className="py-4 text-center">
        <button
          onClick={loadMoreIgnored}
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

export default Ignored;