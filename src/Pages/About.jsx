import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";

// Import all images
import heroBg from "../assets/images/about/hero-bg.png";
import teamMan from "../assets/images/about/team-man.png";
import step1 from "../assets/images/about/step1.png";
import step2 from "../assets/images/about/step2.png";
import step3 from "../assets/images/about/step3.png";
import subtlePattern from "../assets/images/about/subtle-pattern.png";
import whatWeDoBg from "../assets/images/about/what-we-do-bg.png";

// New icons
import highlightIcon from "../assets/images/about/highlight-icon.png";
import specializedIcon from "../assets/images/about/specialized-icon.png";
import purposeIcon from "../assets/images/about/purpose-icon.png";

const COINGECKO_KEY = import.meta.env.VITE_COINGECKO_KEY;

const About = () => {
  // Crypto Prices Ticker
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      if (!COINGECKO_KEY) {
        setError("API key missing");
        setLoading(false);
        return;
      }

      try {
        const ids =
          "bitcoin,ethereum,solana,cardano,binancecoin,ripple,dogecoin,polkadot";
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&x_cg_demo_api_key=${COINGECKO_KEY}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch prices");
        const data = await res.json();

        const format = (obj) => ({
          price: `$${obj.usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          change: `${obj.usd_24h_change >= 0 ? "+" : ""}${obj.usd_24h_change.toFixed(2)}%`,
        });

        const coinList = [
          { id: "bitcoin", name: "Bitcoin (BTC)" },
          { id: "ethereum", name: "Ethereum (ETH)" },
          { id: "solana", name: "Solana (SOL)" },
          { id: "cardano", name: "Cardano (ADA)" },
          { id: "binancecoin", name: "BNB (BNB)" },
          { id: "ripple", name: "XRP (XRP)" },
          { id: "dogecoin", name: "Dogecoin (DOGE)" },
          { id: "polkadot", name: "Polkadot (DOT)" },
        ];

        const formatted = coinList.map((coin) => ({
          name: coin.name,
          ...format(data[coin.id]),
        }));

        setCoins(formatted);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const id = setInterval(fetchPrices, 60000);
    return () => clearInterval(id);
  }, []);

  const marqueeCoins = coins.length > 0 ? [...coins, ...coins] : [];

  return (
    <div className="bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 min-h-screen">
      {/* Crypto Prices Ticker */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-3 overflow-hidden border-b border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            {loading ? (
              <p className="text-gray-400 text-xs md:text-sm whitespace-nowrap">
                Loading live prices...
              </p>
            ) : error ? (
              <p className="text-red-400 text-xs md:text-sm whitespace-nowrap">
                {error}
              </p>
            ) : (
              <div className="flex animate-marquee whitespace-nowrap">
                {marqueeCoins.map((coin, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 mx-6 text-xs md:text-sm text-white"
                  >
                    <span className="font-medium">{coin.name}</span>
                    <span className="font-bold text-green-400">
                      {coin.price}
                    </span>
                    <span
                      className={
                        coin.change.startsWith("+")
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {coin.change}
                    </span>
                    <span className="text-gray-600">•</span>
                  </div>
                ))}
              </div>
            )}
            <span className="ml-6 text-xs text-gray-500 whitespace-nowrap">
              Powered by CoinGecko
            </span>
          </div>
        </div>
      </section>

      {/* Marquee Animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Hero Section */}
      <div
        className="relative h-[580px] md:h-[650px] bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            About Us
          </h1>
          <p className="text-2xl text-gray-200 max-w-xl">
            Connecting traders with excellence since 2022
          </p>
        </div>
      </div>

      {/* About Freedom Trade Section */}
      <div className="bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src={teamMan}
                alt="Freedom Trade Expert"
                className="rounded-3xl shadow-2xl w-full"
              />
            </div>
            <div>
              <p className="text-blue-600 font-semibold mb-3 tracking-widest">
                ABOUT FREEDOM TRADE
              </p>
              <h2 className="text-5xl font-bold mb-8 text-gray-900 leading-tight">
                Connect with the right Trading Platform.
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Whether you are experienced or a beginner, connecting with the
                right platform is everything. Freedom Trade is a leading trade
                and investment company with years of industry experience.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg">
                {[
                  "High Frequency Trading",
                  "Guaranteed ROIs",
                  "Fast and Secure",
                  "Instant Withdrawals",
                  "Multiple Funding Options",
                  "Learn from customer feedback",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">
                      ✓
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What We Do Section */}
      <div
        className="relative py-32 bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${whatWeDoBg})` }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <p className="text-blue-400 font-semibold tracking-widest text-xl">
              WHAT WE DO
            </p>
            <h2 className="text-5xl md:text-6xl font-bold mt-5 leading-tight">
              We create solutions
              <br />
              for your investment needs
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-14 max-w-7xl mx-auto">
            <div className="flex gap-7">
              <img
                src={highlightIcon}
                alt=""
                className="w-16 h-16 flex-shrink-0 mt-1"
              />
              <div>
                <h3 className="text-3xl font-semibold mb-5">
                  Highlight & Capabilities
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Sound Management Practices; Competent & Credible Traders; User
                  Friendly Policies, Procedures and Systems; Proactive Service
                  Philosophy and Strategy; Multiple Support Channels.
                </p>
              </div>
            </div>

            <div className="flex gap-7">
              <img
                src={specializedIcon}
                alt=""
                className="w-16 h-16 flex-shrink-0 mt-1"
              />
              <div>
                <h3 className="text-3xl font-semibold mb-5">
                  Specialized in Industry
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  We are specialized in all four major investment sectors:
                  Forex, Crypto, Stocks, & Real Estates.
                </p>
              </div>
            </div>

            <div className="flex gap-7">
              <img
                src={purposeIcon}
                alt=""
                className="w-16 h-16 flex-shrink-0 mt-1"
              />
              <div>
                <h3 className="text-3xl font-semibold mb-5">
                  Our Strategic Purpose
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Our purpose follows the competitive advantage through the
                  strategic use of resources, to accommodate a changing trend in
                  the market and make the best out of it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div
        className="relative py-24 bg-cover bg-center"
        style={{ backgroundImage: `url(${subtlePattern})` }}
      >
        <div className="absolute inset-0 bg-slate-100/95 dark:bg-slate-900/95" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <p className="text-blue-600 font-semibold mb-4">HOW IT WORKS</p>
          <h2 className="text-5xl font-bold mb-16">
            Three Simple Steps To Start Earning
          </h2>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl">
              <img
                src={step1}
                alt="Step 1"
                className="mx-auto mb-8 w-28 h-28"
              />
              <h3 className="text-3xl font-semibold mb-4">Create Account</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Create and verify your account for free to get started.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl">
              <img
                src={step2}
                alt="Step 2"
                className="mx-auto mb-8 w-28 h-28"
              />
              <h3 className="text-3xl font-semibold mb-4">Make Deposit</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                After account verification, simply make deposits from the
                funding page in your dashboard.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl">
              <img
                src={step3}
                alt="Step 3"
                className="mx-auto mb-8 w-28 h-28"
              />
              <h3 className="text-3xl font-semibold mb-4">Earn & Get Paid</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                You can make withdrawals as soon as you start making profits.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-700 to-emerald-600 py-20 text-white text-center">
        <h3 className="text-4xl font-bold mb-6">Ready to Start Trading?</h3>
        <Link
          to="/register"
          className="inline-block bg-white text-blue-700 font-bold px-12 py-5 rounded-2xl hover:bg-gray-100 transition text-xl"
        >
          Get Started Now →
        </Link>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
