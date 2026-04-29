import React from "react";
import { Link } from "react-router-dom";
import tradenixPro from "../assets/Images/landingpage/tradenixpro.png";

// ==================== SOCIAL ICONS ====================
import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTelegramPlane,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-gray-400">
      <div className="container mx-auto px-6 sm:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-5">
            <Link to="/" className="inline-block mb-6">
              <img
                src={tradenixPro}
                alt="TradeNixPro"
                className="h-12 md:h-14 w-auto"
              />
            </Link>

            <p className="leading-relaxed text-base md:text-lg max-w-md mb-8">
              A premier global trading and investment platform committed to
              excellence, transparency, and delivering consistent results for
              our clients worldwide.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4 text-2xl">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-all hover:scale-110 p-3 hover:bg-slate-800 rounded-2xl"
              >
                <FaTwitter />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-all hover:scale-110 p-3 hover:bg-slate-800 rounded-2xl"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-all hover:scale-110 p-3 hover:bg-slate-800 rounded-2xl"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-all hover:scale-110 p-3 hover:bg-slate-800 rounded-2xl"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-all hover:scale-110 p-3 hover:bg-slate-800 rounded-2xl"
              >
                <FaYoutube />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-all hover:scale-110 p-3 hover:bg-slate-800 rounded-2xl"
              >
                <FaTelegramPlane />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold text-xl mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3.5 text-base">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-white transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold text-xl mb-6">
              Our Services
            </h4>
            <ul className="space-y-3.5 text-base">
              <li>Forex Trading</li>
              <li>Cryptocurrency Investments</li>
              <li>Stock & Commodities</li>
              <li>Real Estate Investment</li>
              <li>Market Research & Analysis</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-semibold text-xl mb-6">
              Get In Touch
            </h4>
            <div className="space-y-4 text-base">
              <p className="flex items-center gap-3">
                📧{" "}
                <a
                  href="mailto:support@TradeNixPro.com"
                  className="hover:text-white transition-colors"
                >
                  support@TradeNixPro.com
                </a>
              </p>
              <p>📍 London, United Kingdom</p>
              <p>📞 +44 20 7946 0958</p>
            </div>

            <div className="mt-10 text-sm">
              <p className="font-medium text-white">
                © 2026 TradeNixPro. All Rights Reserved.
              </p>
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                Trading involves substantial risk of loss and is not suitable
                for all investors. For educational purposes only.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-6 text-center text-sm bg-slate-900/50">
        <p className="max-w-3xl mx-auto px-6">
          Trading involves substantial risk of loss. Past performance is not
          indicative of future results.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
