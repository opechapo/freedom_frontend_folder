import React from "react";
import { Link } from "react-router-dom";

// Import Logo Image
import tradenixPro from "../assets/Images/landingpage/tradenixpro.png";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-gray-400">
      <div className="container mx-auto px-6 pt-20 pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Company Info with Logo */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <img
                src={tradenixPro}
                alt="Freedom Trade"
                className="h-22 w-auto"
              />
            </Link>
            <p className="leading-relaxed text-lg max-w-md">
              A premier global trading and investment platform committed to
              excellence, transparency, and delivering consistent results for
              our clients worldwide.
            </p>

            <div className="mt-8 flex gap-5 text-2xl">
              <a href="#" className="hover:text-white transition">
                📘
              </a>
              <a href="#" className="hover:text-white transition">
                𝕏
              </a>
              <a href="#" className="hover:text-white transition">
                📷
              </a>
              <a href="#" className="hover:text-white transition">
                🔗
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">
              Quick Links
            </h4>
            <ul className="space-y-3 text-lg">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <a
                  href="https://www.blockchain.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  Buy Crypto
                </a>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">
              Our Services
            </h4>
            <ul className="space-y-3 text-lg">
              <li>Forex Trading</li>
              <li>Cryptocurrency Investments</li>
              <li>Stock & Commodities</li>
              <li>Real Estate Investment</li>
              <li>Market Research & Analysis</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">
              Contact Us
            </h4>
            <div className="space-y-4 text-lg">
              <p>support@TradeNixPro.com</p>
              {/* <p>+44 20 7946 0958</p> */}
              <p>London, United Kingdom</p>
            </div>

            <div className="mt-10 text-sm">
              <p>© 2026 TradeNixPro. All Rights Reserved.</p>
              <p className="text-xs mt-2 text-gray-500">
                Trading involves risk. For educational purposes only.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-6 text-center text-sm">
        <p>
          Trading involves substantial risk of loss and is not suitable for all
          investors.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
