import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";

// Import Hero Background
import contactHeroBg from "../assets/Images/contact/contact-hero-bg.png";

const COINGECKO_KEY = import.meta.env.VITE_COINGECKO_KEY;

const Contact = () => {
  // CoinGecko Ticker
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      if (!COINGECKO_KEY) {
        setError("CoinGecko API key missing");
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

        const coinList = [
          { id: "bitcoin", name: "Bitcoin (BTC)" },
          { id: "ethereum", name: "Ethereum (ETH)" },
          { id: "solana", name: "Solana (SOL)" },
          { id: "cardano", name: "Cardano (ADA)" },
          { id: "binancecoin", name: "BNB" },
          { id: "ripple", name: "XRP" },
          { id: "dogecoin", name: "Dogecoin (DOGE)" },
          { id: "polkadot", name: "Polkadot (DOT)" },
        ];

        const formatted = coinList.map((coin) => {
          const info = data[coin.id];
          return {
            name: coin.name,
            price: info ? `$${info.usd.toLocaleString()}` : "N/A",
            change:
              info && info.usd_24h_change != null
                ? `${info.usd_24h_change >= 0 ? "+" : ""}${info.usd_24h_change.toFixed(2)}%`
                : "0.00%",
          };
        });

        setCoins(formatted);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load live prices");
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const marqueeCoins = coins.length > 0 ? [...coins, ...coins] : [];

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen">
      {/* CoinGecko Live Ticker */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-3 overflow-hidden border-b border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            {loading ? (
              <p className="text-gray-400 text-sm">Loading live prices...</p>
            ) : error ? (
              <p className="text-amber-400 text-sm">{error}</p>
            ) : (
              <div className="flex animate-marquee whitespace-nowrap">
                {marqueeCoins.map((coin, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 mx-8 text-white text-sm"
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
                  </div>
                ))}
              </div>
            )}
            <span className="ml-auto text-xs text-gray-500 hidden sm:block">
              Live • CoinGecko
            </span>
          </div>
        </div>
      </section>

      {/* Marquee Animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Hero Section with Background Image */}
      <div
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${contactHeroBg})` }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to our support team.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500"
                />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Subject"
                className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <textarea
                placeholder="Your Message"
                rows="6"
                className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-10">
            <div>
              <h3 className="text-2xl font-semibold mb-6">
                Contact Information
              </h3>
              <div className="space-y-6 text-lg">
                <p>
                  <strong>Email:</strong> support@freedomtrade.com
                </p>
                <p>
                  <strong>Phone:</strong> +44 20 7946 0958
                </p>
                <p>
                  <strong>Address:</strong> 123 Trading Street, London, United
                  Kingdom
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6">Business Hours</h3>
              <p className="text-gray-600">
                Monday - Friday: 8:00 AM - 6:00 PM (GMT)
              </p>
              <p className="text-gray-600">Saturday: 9:00 AM - 3:00 PM (GMT)</p>
              <p className="text-gray-600">Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
