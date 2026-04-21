import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";

// Import images
import servicesHeroBg from "../assets/Images/services/services-hero-bg.png";
import investIcon from "../assets/Images/services/investment-icon.png";
import cryptoIcon from "../assets/Images/services/crypto-icon.png";
import forexIcon from "../assets/Images/services/forex-icon.png";
import stockIcon from "../assets/Images/services/stock-icon.png";
import realEstateIcon from "../assets/Images/services/real-estate-icon.png";
import cannabisIcon from "../assets/Images/services/cannabis-icon.png";

const COINGECKO_KEY = import.meta.env.VITE_COINGECKO_KEY;

const Services = () => {
  // Crypto Prices Ticker
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

  const services = [
    {
      icon: investIcon,
      title: "Investment Consultancy",
      desc: "We do in-depth work on formulating clients' investment strategies, helping them fulfill their investment dreams.",
      longDesc:
        "Bullishforx Limited provides investors with investment products, advice and/or planning, do in-depth work on formulating investment strategies, helping you fulfill your needs and reach your financial goals.",
    },
    {
      icon: cryptoIcon,
      title: "Cryptocurrency Investment",
      desc: "Virtual or crypto currencies like Bitcoin and Ethereum are definitely by far the hottest investment.",
      longDesc:
        "Cryptocurrency is a form of digital money that is designed to be secure and, in many cases, anonymous.",
    },
    {
      icon: forexIcon,
      title: "Forex Trading",
      desc: 'The Forex market also referred to as the "Currency market", it is the largest and most liquid market in the world.',
      longDesc:
        "The foreign exchange market (Forex) is the place where currencies are traded.",
    },
    {
      icon: stockIcon,
      title: "Stock & Commodities",
      desc: "Diversify your portfolio with stocks and commodities. Reduce risk while maximizing long-term returns.",
      longDesc:
        "We offer access to global stock markets and commodities trading.",
    },
    {
      icon: realEstateIcon,
      title: "Real Estate Investment",
      desc: "Invest in high-value real estate opportunities with strong returns and long-term capital appreciation.",
      longDesc:
        "Our real estate investment division provides opportunities in commercial and residential properties.",
    },
    {
      icon: cannabisIcon,
      title: "Cannabis Investment",
      desc: "Strategic investment opportunities in the rapidly growing legal cannabis and hemp industry.",
      longDesc:
        "We provide access to the booming cannabis sector with high growth potential.",
    },
  ];

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

      {/* Hero Section */}
      <div
        className="relative h-[550px] bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${servicesHeroBg})` }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
            Our Services
          </h1>
          <p className="text-2xl text-gray-200 max-w-2xl mx-auto">
            Professional trading and investment solutions tailored for your
            success
          </p>
        </div>
      </div>

      {/* Services Intro */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <p className="text-blue-600 font-semibold tracking-widest mb-4">
            OUR SERVICES
          </p>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Bring to the table win-win survival
            <br />
            strategies to ensure proactive domination.
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-8"></div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-xl p-10 hover:shadow-2xl transition-all duration-300 group border border-gray-100"
              >
                <div className="mb-8">
                  <img
                    src={service.icon}
                    alt={service.title}
                    className="w-20 h-20 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-3xl font-bold mb-5 text-gray-900">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {service.desc}
                </p>
                <p className="text-gray-500 text-[15px] leading-relaxed">
                  {service.longDesc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-700 to-emerald-600 py-20 text-white text-center">
        <h3 className="text-4xl font-bold mb-6">Ready to Grow Your Wealth?</h3>
        <Link
          to="/register"
          className="inline-block bg-white text-blue-700 font-bold px-12 py-5 rounded-2xl hover:bg-gray-100 transition text-xl"
        >
          Start Investing Today →
        </Link>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Services;
