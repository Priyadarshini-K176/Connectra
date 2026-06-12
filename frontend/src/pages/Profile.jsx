/* eslint-disable react/prop-types */
import axios from "axios";
import MarkdownIt from "markdown-it";
import { useEffect, useRef, useState } from "react";
import { IoMdCloseCircle, IoMdSettings } from "react-icons/io";
import { MdEdit, MdOutlineWorkspacePremium } from "react-icons/md";
import MdEditor from "react-markdown-editor-lite";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Card from "../components/Card";
import Model from "../components/Model";
import { abbreviateNumber, capitalize } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { cacheResults } from "../utils/skillsSlice";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../utils/userSlice";

// import style manually
import "react-markdown-editor-lite/lib/index.css";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState(null);
  const [requestCount, setRequestCount] = useState(null);
  const [isBannerModelShow, setIsBannerModelShow] = useState(false);
  const [isAvatarModelShow, setIsAvatarModelShow] = useState(false);

  const defaultBanner = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&fit=crop";
  const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&h=400&fit=crop";

  const [tempBanner, setTempBanner] = useState("");
  const [tempAvatar, setTempAvatar] = useState("");

  const [skills, setSkills] = useState(null);
  const skillsCache = useSelector((store) => store.skills);
  const [suggestions, setSuggestions] = useState([]);
  const [inputSkillQuery, setInputSkillQuery] = useState("");
  const skillRef = useRef(null);

  const mdParser = new MarkdownIt();
  const [writing, setWriting] = useState(true);

  const [showSettingMenu, setShowSettingMenu] = useState(false);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const settingRef = useRef(null);
  const settingMenu = useRef(null);

  useEffect(() => {
    if (user) {
      setProfileData(user);
      setTempBanner(user.banner || defaultBanner);
      setTempAvatar(user.avatar || defaultAvatar);
    }
  }, [user]);

  const updateProfile = async () => {
    try {
      const updatedData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        about: profileData.about,
        skills: profileData.skills,
        avatar: profileData.avatar,
        banner: profileData.banner,
        headline: profileData.headline,
      };

      const res = await axios.patch(
        import.meta.env.VITE_BackendURL + "/profile/edit",
        updatedData,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Profile Updated!");
        dispatch(addUser(res.data.user));
        setIsEditProfile(false);
      } else {
        toast.error(res.data.message || "Update failed");
      }

    } catch (err) {
      console.error("UPDATE ERROR:", err);
      setProfileData(user);
      toast.error(err.response?.data?.error || "Something went wrong!");
    }
  };

  const getRequestCount = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BackendURL + "/user/totalStatus",
        { withCredentials: true },
      );
      setRequestCount(res.data.requestCount);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { getRequestCount(); }, []);

  // Update the change handler to ONLY update the input state
  const handleInputChange = (e) => {
    setInputSkillQuery(e.target.value);
  };

  useEffect(() => {
    if (!inputSkillQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const queryLower = inputSkillQuery.toLowerCase();

      if (skillsCache[queryLower]) {
        setSuggestions(skillsCache[queryLower]);
        return;
      }

      try {
        const res = await axios.get(
          import.meta.env.VITE_BackendURL + `/api/skills?query=${inputSkillQuery}&limit=10`,
          { withCredentials: true }
        );

        if (res.data.success) {
          const newSuggestions = res.data.skills.filter(
            (s) => !profileData?.skills?.includes(s)
          );

          setSuggestions(newSuggestions);

          dispatch(cacheResults({ [queryLower]: newSuggestions }));
        }
      } catch (err) {
        console.error("Error fetching skills:", err);
      }
    }, 300); 

    return () => clearTimeout(timer); // Cleanup timer if user types fast
  }, [inputSkillQuery, profileData?.skills, skillsCache, dispatch]);



  const handleSkillSelect = (skill) => {
    if (!skill || profileData?.skills?.includes(skill) || profileData?.skills?.length >= 15) return;
    setProfileData({ ...profileData, skills: [...profileData.skills, skill.trim()] });
    setInputSkillQuery("");
    setSuggestions([]);
  };

  const handleRemoveSkill = (skill) => {
    setProfileData({ ...profileData, skills: profileData.skills.filter(s => s !== skill) });
  };

  const handleSave = () => updateProfile();
  const handleCancel = () => { setIsEditProfile(false); setProfileData(user); };

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_BackendURL + "/logout",
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Session Ended");
        dispatch(removeUser());
        navigate("/login");
      }
    } catch (err) {
      console.error("Logout failed", err);
      toast.error("Failed to end session");
    }
  };

  if (!user || !profileData) return <div className="flex h-screen items-center justify-center font-black text-primary animate-pulse uppercase tracking-[0.5em]">Loading DevRoot...</div>;

  return (
    <div className="bg-bg min-h-screen text-text selection:bg-primary/20">

      <Model isModelShow={isBannerModelShow}>
        <div className="bg-cardBg p-6 rounded-2xl border border-border">
          <label className="block mb-2 font-black uppercase text-xs tracking-widest text-textMuted">Banner Image URL</label>
          <input type="text" value={tempBanner} className="w-full rounded-xl bg-bg p-4 outline-none border border-border focus:border-primary transition-all" onChange={(e) => setTempBanner(e.target.value)} />
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={() => setIsBannerModelShow(false)} className="px-4 py-2 font-bold text-textMuted hover:text-text transition-colors">Cancel</button>
            <button onClick={() => { setProfileData({ ...profileData, banner: tempBanner }); setIsBannerModelShow(false); }} className="rounded-xl bg-primary px-6 py-2 font-black text-white shadow-lg shadow-primary/30 active:scale-95 transition-all">Update Banner</button>
          </div>
        </div>
      </Model>

      <Model isModelShow={isAvatarModelShow}>
        <div className="bg-cardBg p-6 rounded-2xl border border-border">
          <label className="block mb-2 font-black uppercase text-xs tracking-widest text-textMuted">Avatar Image URL</label>
          <input type="text" value={tempAvatar} className="w-full rounded-xl bg-bg p-4 outline-none border border-border focus:border-primary transition-all" onChange={(e) => setTempAvatar(e.target.value)} />
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={() => setIsAvatarModelShow(false)} className="px-4 py-2 font-bold text-textMuted hover:text-text transition-colors">Cancel</button>
            <button onClick={() => { setProfileData({ ...profileData, avatar: tempAvatar }); setIsAvatarModelShow(false); }} className="rounded-xl bg-primary px-6 py-2 font-black text-white shadow-lg shadow-primary/30 active:scale-95 transition-all">Update Avatar</button>
          </div>
        </div>
      </Model>

      {/* --- CHANGED: Reduced Width from 11/12 to 10/12 and max-width from 6xl to 4xl --- */}
      <div className="mx-auto w-full py-6 sm:w-10/12 lg:w-4/5 xl:max-w-4xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-bgSecondary border border-border/40 shadow-2xl shadow-black/20">

          {/* --- CHANGED: Reduced Banner Height from h-48/64/80 to h-32/48/56 --- */}
          <div className="relative h-32 sm:h-48 lg:h-56 group">
            <img
              className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
              src={profileData?.banner || defaultBanner}
              alt="banner"
              onError={(e) => e.target.src = defaultBanner}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bgSecondary/80 via-transparent to-transparent" />
            {isEditProfile && (
              <button onClick={() => setIsBannerModelShow(true)} className="absolute right-4 top-4 flex items-center gap-2 rounded-xl bg-cardBg/90 p-2 px-4 font-black text-[10px] uppercase tracking-widest text-text shadow-2xl backdrop-blur-md transition-all hover:scale-105 border border-border">
                <MdEdit className="text-primary text-base" /> Edit Cover
              </button>
            )}
          </div>

          <div className="relative px-6 pb-8 sm:px-10">
            {/* --- CHANGED: Reduced Avatar Size from size-44/52/60 to size-32/40/48 --- */}
            <div className="relative -mt-16 mb-8 flex flex-col items-start gap-6 lg:flex-row lg:items-end">
              <div className="relative size-32 shrink-0 overflow-hidden rounded-[2rem] border-[6px] border-bgSecondary bg-cardBg shadow-xl sm:size-40 lg:size-48">
                <img
                  className="h-full w-full object-cover"
                  src={profileData?.avatar || defaultAvatar}
                  alt="avatar"
                  onError={(e) => e.target.src = defaultAvatar}
                />
                {isEditProfile && (
                  <div onClick={() => setIsAvatarModelShow(true)} className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100 backdrop-blur-sm">
                    <MdEdit className="text-3xl text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                  {isEditProfile ? (
                    <div className="flex flex-wrap gap-2">
                      <input className="rounded-xl border border-border bg-bg px-4 py-2 text-xl font-black outline-none" value={profileData.firstName} onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })} />
                      <input className="rounded-xl border border-border bg-bg px-4 py-2 text-xl font-black outline-none" value={profileData.lastName} onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })} />
                    </div>
                  ) : (
                    <h1 className="text-3xl font-black tracking-tighter sm:text-4xl text-text">
                      {capitalize(profileData.firstName)} <span className="text-primary">{capitalize(profileData.lastName)}</span>
                      {user.isPremium && <MdOutlineWorkspacePremium className="inline ml-3 text-yellow-500" />}
                    </h1>
                  )}
                </div>
                <p className="text-lg font-black text-accent1/90 lowercase tracking-tighter">@{profileData.username}</p>
              </div>

              <div className="lg:mb-4">
                <span className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-widest shadow-lg border border-border/20 ${profileData.status === 'active' ? 'bg-accent1/10 text-accent1' : 'bg-accent3/10 text-accent3'}`}>
                  <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${profileData.status === 'active' ? 'bg-accent1' : 'bg-accent3'}`}></span>
                  {profileData.status}
                </span>
              </div>
            </div>

            {/* --- CHANGED: Grid gap reduced from 16 to 10 --- */}
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7 space-y-8">
                <section>
                  <h3 className="mb-2 text-[9px] font-black uppercase tracking-widest text-textMuted">Current Status</h3>
                  {isEditProfile ? (
                    <textarea className="w-full rounded-2xl border border-border bg-bg p-4 text-lg font-bold outline-none" rows="2" value={profileData.headline} onChange={(e) => setProfileData({ ...profileData, headline: e.target.value })} />
                  ) : (
                    <p className="text-xl font-black leading-tight text-text/80 italic tracking-tight">"{profileData.headline || "Writing code..."}"</p>
                  )}
                </section>

                <section>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[9px] font-black uppercase tracking-widest text-textMuted">The Story</h3>
                  </div>
                  <div className="rounded-[1.5rem] border border-border/30 bg-cardBg/40 p-4 shadow-inner backdrop-blur-sm">
                    <MdEditor
                      value={profileData.about || ""}
                      view={{ menu: isEditProfile, md: isEditProfile, html: true }}
                      onChange={({ text }) => setProfileData({ ...profileData, about: text })}
                      renderHTML={(text) => mdParser.render(text)}
                      style={{ height: "300px", border: "none", backgroundColor: "transparent", color: "var(--color-text)" }}
                      className="custom-md-editor no-scrollbar font-medium"
                    />
                  </div>
                </section>
              </div>

              <div className="lg:col-span-5 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/networks/followers" className="rounded-2xl bg-cardBg border border-border/40 p-4 text-center transition-all hover:scale-105 shadow-lg">
                    <p className="text-3xl font-black text-text tracking-tighter">{abbreviateNumber(requestCount?.following || 0)}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-textMuted mt-1">Followers</p>
                  </Link>
                  <Link to="/networks/following" className="rounded-2xl bg-cardBg border border-border/40 p-4 text-center transition-all hover:scale-105 shadow-lg">
                    <p className="text-3xl font-black text-text tracking-tighter">{abbreviateNumber(requestCount?.followers || 0)}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-textMuted mt-1">Following</p>
                  </Link>
                </div>

                <section className="rounded-[1.5rem] bg-cardBg/30 border border-border/20 p-6 shadow-xl">
                  <h3 className="mb-4 text-[9px] font-black uppercase tracking-widest text-textMuted">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {profileData?.skills?.map((skill) => (
                      <span key={skill} className="flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/20 px-4 py-2 text-[10px] font-black text-primary transition-all">
                        {skill}
                        {isEditProfile && <IoMdCloseCircle className="cursor-pointer text-accent3 size-4" onClick={() => handleRemoveSkill(skill)} />}
                      </span>
                    ))}
                  </div>
                  {isEditProfile && (
                    <div className="relative" ref={skillRef}>
                      <input type="text" placeholder="Add tech..." className="w-full rounded-xl border border-border bg-bg p-3 text-xs font-bold outline-none" value={inputSkillQuery} onChange={handleInputChange} />
                      {suggestions.length > 0 && (
                        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-cardBg shadow-2xl">
                          <ul className="max-h-48 overflow-y-auto p-2 no-scrollbar">
                            {suggestions.map((skill) => (
                              <li
                                key={skill}
                                className="cursor-pointer rounded-lg p-3 text-sm font-bold text-text hover:bg-primary/20 hover:text-primary transition-all"
                                onClick={() => handleSkillSelect(skill)}
                              >
                                {skill}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              </div>
            </div>

            {isEditProfile && (
              <div className="mt-10 flex justify-center gap-6 border-t border-border/40 pt-8">
                <button onClick={handleCancel} className="rounded-xl bg-accent3/10 px-8 py-4 font-black uppercase tracking-widest text-accent3 text-[9px]">Cancel</button>
                <button onClick={handleSave} className="rounded-xl bg-primary px-8 py-4 font-black uppercase tracking-widest text-white shadow-lg text-[9px]">Commit Profile</button>
              </div>
            )}
          </div>
        </div>

        {/* --- CHANGED: Reduced Visualizer Spacing --- */}
        <div className="mt-16 flex flex-col items-center">
          <h2 className="mb-8 text-2xl font-black tracking-tighter">Live Feed Visualizer</h2>
          <div className="hover:scale-105 transition-transform duration-500">
            <Card user={profileData} />
          </div>
        </div>
      </div>

      <div className="fixed bottom-10 right-10 z-50" ref={settingRef}>
        <button onClick={() => setShowSettingMenu(!showSettingMenu)} className="rounded-2xl bg-slate-900 p-5 text-white shadow-2xl transition-all hover:rotate-45 border border-white/10 ring-8 ring-primary/5">
          <IoMdSettings size={28} />
        </button>
        {showSettingMenu && (
          <div className="absolute bottom-24 right-0 w-56 rounded-2xl bg-cardBg p-3 shadow-2xl border border-border">
            <ul className="flex flex-col gap-1">
              <li onClick={() => { setIsEditProfile(true); setShowSettingMenu(false) }} className="cursor-pointer rounded-xl p-4 text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Edit Experience</li>
              <li onClick={handleLogout} className="cursor-pointer rounded-xl p-4 text-[9px] font-black uppercase tracking-widest text-accent3 hover:bg-accent3/10 transition-all border-t border-border mt-2">End Session</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;