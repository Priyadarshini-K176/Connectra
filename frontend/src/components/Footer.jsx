import { FileUser, Mail, MapPinHouse } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import SocialLinks from "./SocialLinks";

const FOOTER_SECTIONS = {
  "About Us": [{ Home: "/" }, { "Meet the Team": "/team" }],
  "Our Services": [
    { Feed: "/feed" },
    { Network: "/networks" },
    { Profile: "/profile" },
  ],
  "Helpful Links": [
    { "Community in Numbers": "/#community" },
    { FAQs: "/#faqs" },
    { Support: "/#support" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-blue-50 border-t border-blue-100">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">

          {/* Logo + Brand Description */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-5">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Connectra logo" className="h-12 w-12 object-contain" />
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tighter text-slate-900">Connectra</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                  Connect. Collaborate. Grow.
                </span>
              </div>
            </div>

            <p className="max-w-xs text-sm font-medium leading-relaxed text-slate-500">
              Helping developers find collaborators, build meaningful connections,
              and grow together through shared projects and ideas.
            </p>

            <div className="pt-2">
              <SocialLinks />
            </div>
          </div>

          {/* Navigation Links Grid */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-2">
            {Object.keys(FOOTER_SECTIONS).map((section) => (
              <div key={section}>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-5">
                  {section}
                </p>

                <nav>
                  <ul className="space-y-3">
                    {FOOTER_SECTIONS[section].map((link) => {
                      const href = Object.values(link)[0];
                      const label = Object.keys(link)[0];

                      const linkClass = "text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600";

                      return href.includes("#") ? (
                        <li key={href}>
                          <a href={href} className={linkClass}>
                            {label}
                          </a>
                        </li>
                      ) : (
                        <li key={href}>
                          <Link to={href} className={linkClass}>
                            {label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            ))}

            {/* Contact Section */}
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-5">
                Contact
              </p>

              <ul className="space-y-4">
                <li>
                  <a
                    href="mailto:connectra@gmail.com"
                    className="flex items-center gap-3 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600"
                  >
                    <Mail className="size-4 text-blue-500" />
                    connectra@gmail.com
                  </a>
                </li>

                <li>
                  <Link
                    to="/contact-form"
                    className="flex items-center gap-3 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600"
                  >
                    <FileUser className="size-4 text-blue-500" />
                    Support Form
                  </Link>
                </li>

                <li className="flex items-center gap-3 text-sm font-semibold text-slate-400">
                  <MapPinHouse className="size-4 text-blue-500" />
                  <span>Based in India</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Legal Section */}
        <div className="mt-16 border-t border-blue-100 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            © {new Date().getFullYear()} Connectra — Built for Developers
          </p>

          <div className="flex gap-6">
            <a href="#terms" className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
              Terms
            </a>
            <a href="#privacy" className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;