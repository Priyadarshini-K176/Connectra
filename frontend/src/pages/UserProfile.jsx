/* eslint-disable react/prop-types */
import axios from "axios";
import MarkdownIt from "markdown-it";
import { useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { abbreviateNumber, capitalize } from "../utils/constants";

const UserProfile = () => {
  const { userId } = useParams();
  const user = useSelector((store) => store.user);
  const [profileData, setProfileData] = useState(null);
  const [requestCount, setRequestCount] = useState(null);
  const [connection, setConnection] = useState(null);
  const menuRef = useRef();
  const [showConnection, setShowConnection] = useState(false);
  const mdParser = new MarkdownIt();

  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BackendURL + "/profile/" + userId,
        { withCredentials: true },
      );
      if (res.data.success === false) {
        setProfileData(res?.data?.user);

        toast.error(res.data.message || "An error occurred");
        return navigate("/feed");
      }
      setProfileData(res?.data?.user);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.error || "Something went wrong!");
      } else if (err.request) {
        toast.error("No response from the server. Please try again.");
      } else {
        toast.error("An unexpected error occurred.");
      }

      console.error(err.message);
      return navigate("/feed");
    }
  };

  const getRequestCount = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BackendURL +
          "/user/totalStatus/" +
          profileData._id,
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

  const userConnection = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BackendURL}/user/connection/${profileData._id}`,
        { withCredentials: true },
      );

      if (res.data.success) {
        setConnection(res.data.connectionRequest);
      } else {
        toast.error(res.data.message || "Error fetching connection status");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "An error occurred");
    }
  };

  const sendRequest = async (status) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BackendURL}/request/send/${status}/${profileData._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Request sent successfully!");
        userConnection(); // Refresh the connection status on UI
        setShowConnection(false); // Close dropdown
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send request");
    }
  };

  useEffect(() => {
    if (user?.username === userId) {
      return navigate("/profile");
    } else {
      getUserData();
    }
  }, [user?.username, userId, navigate]);

  useEffect(() => {
    if (profileData?._id) {
      userConnection();
      getRequestCount();
    }
  }, [profileData]);

  return (
  profileData && (
    <div className="mx-auto w-full py-6 sm:w-5/6">

      <div className="relative rounded-2xl bg-white shadow-xl border border-gray-100">

        {/* Banner */}
        <img
          className="h-48 w-full rounded-t-2xl object-cover brightness-90"
          src={profileData?.banner}
          alt="banner"
        />

        <div className="relative mx-5 flex flex-col gap-10 xs:mx-10 lg:flex-row">

          {/* Avatar */}
          <div className="absolute left-1/2 z-10 flex size-48 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md xs:size-52 sm:size-60 lg:left-0 lg:translate-x-0">
            <div className="relative h-full w-full">
              <img
                className="absolute inset-0 h-full w-full rounded-full object-cover p-2 ring-4 ring-white shadow-lg"
                src={profileData?.avatar}
                alt="user profile"
              />
            </div>
          </div>

          {/* Content */}
          <div className="my-10 flex flex-col gap-6 pt-24 lg:ml-64 lg:w-[65%] lg:pt-0">

            {/* Top Section */}
            <div className="flex justify-between">

              {/* Name */}
              <div>
                <p className="flex items-center gap-2 text-3xl font-bold text-gray-800 tracking-tight">
                  {capitalize(profileData?.firstName)}{" "}
                  {capitalize(profileData?.lastName)}
                  {profileData.isPremium && (
                    <MdOutlineWorkspacePremium className="text-yellow-500" />
                  )}
                </p>

                <p className="text-sm font-medium text-gray-500">
                  @{profileData?.username}
                </p>
              </div>

              {/* Status + Connection */}
              <div className="space-y-2 text-right">

                <p>
                  Status:{" "}
                  <span className="font-medium text-green-600">
                    {capitalize(profileData?.status)}
                  </span>
                </p>

                {/* Connection UI */}
                {profileData ? (
                  connection ? (
                    connection.status === "accepted" ? (
                      <div className="rounded-lg bg-green-500/90 px-5 py-2 text-white shadow-sm transition hover:scale-105 hover:shadow-md">
                        <p className="font-semibold">Connected</p>
                      </div>
                    ) : connection.status === "interested" &&
                      connection.fromUserId?.toString() !==
                        profileData._id?.toString() ? (
                      <div className="rounded-lg bg-yellow-400/90 px-5 py-2 text-white shadow-sm transition hover:scale-105 hover:shadow-md">
                        <p className="font-semibold">Pending</p>
                      </div>
                    ) : connection.status === "interested" &&
                      connection.fromUserId?.toString() ===
                        profileData._id?.toString() ? (
                      <div className="rounded-lg bg-blue-500/90 px-5 py-2 text-white shadow-sm transition hover:scale-105 hover:shadow-md">
                        <p className="font-semibold">Interested</p>
                      </div>
                    ) : connection.status === "ignored" ? (
                      <div className="rounded-lg bg-gray-400/90 px-5 py-2 text-white shadow-sm">
                        <p className="font-semibold">Ignored</p>
                      </div>
                    ) : connection.status === "rejected" ? (
                      <div className="rounded-lg bg-red-500/90 px-5 py-2 text-white shadow-sm">
                        <p className="font-semibold">Rejected</p>
                      </div>
                    ) : null
                  ) : (
                    <div className="relative flex justify-end">
                      <BsThreeDots
                        className="size-8 cursor-pointer rounded-full bg-gray-100 p-2 transition hover:scale-105"
                        onClick={() => setShowConnection(!showConnection)}
                      />
                      {showConnection && (
                        <div className="absolute right-0 top-10 flex flex-col rounded-lg bg-white shadow-md z-50">
                          <button onClick={() => sendRequest("interested")} className="px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer">
                            Interested ?
                          </button>
                          <button onClick={() => sendRequest("ignored")} className="px-4 py-2 hover:bg-gray-100 transition-colors text-red-500 cursor-pointer">
                            Ignore User
                          </button>
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <div className="rounded-lg bg-red-400 px-5 py-2 text-white">
                    Please log in
                  </div>
                )}
              </div>
            </div>

            {/* Headline */}
            {profileData?.headline && (
              <p className="rounded-lg bg-gray-50 px-3 py-2 text-gray-700 lg:w-9/12">
                {profileData?.headline}
              </p>
            )}

            {/* Followers */}
            <div className="flex gap-5">
              <div className="rounded-xl bg-gray-50 px-6 py-3 shadow-sm transition hover:scale-105 hover:shadow-md">
                <p className="text-xl font-bold">
                  {abbreviateNumber(requestCount?.followers)}
                </p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>

              <div className="rounded-xl bg-gray-50 px-6 py-3 shadow-sm transition hover:scale-105 hover:shadow-md">
                <p className="text-xl font-bold">
                  {abbreviateNumber(requestCount?.following)}
                </p>
                <p className="text-sm text-gray-500">Following</p>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h2 className="pb-2 text-2xl font-bold">Skills</h2>
              <ul className="flex flex-wrap gap-3">
                {profileData?.skills?.length > 0 ? (
                  profileData.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 transition hover:bg-indigo-100 hover:text-indigo-600 hover:scale-105"
                    >
                      {capitalize(skill)}
                    </li>
                  ))
                ) : (
                  <li className="rounded-md bg-gray-100 px-4 py-2">
                    No Skills
                  </li>
                )}
              </ul>
            </div>

            {/* About */}
            <div>
              <h2 className="pb-2 text-2xl font-bold">About</h2>
              <div className="rounded-xl bg-gray-50 p-3">
                <MdEditor
                  value={profileData.about || "No information provided."}
                  view={{ menu: false, md: false, html: true }}
                  renderHTML={(text) => mdParser.render(text)}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
);
}

export default UserProfile;