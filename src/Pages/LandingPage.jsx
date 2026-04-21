import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";

import Hero1 from "../assets/Images/hero1.jpg";
import Hero2 from "../assets/Images/hero2.jpg";
import Hero3 from "../assets/Images/hero3.jpg";
import TradeHand from "../assets/Images/tradehand.gif";
import TradingViewWidget from "../Components/TradingViewWidget";

// Service images
import ServiceInvestment from "../assets/Images/service-investment.png";
import ServiceCrypto from "../assets/Images/service-crypto.png";
import ServiceForex from "../assets/Images/service-forex.png";

const COINGECKO_KEY = import.meta.env.VITE_COINGECKO_KEY;

const LandingPage = () => {
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

  // Hero Carousel
  const heroSlides = [
    {
      img: Hero1,
      title: "Manage and Grow Your Investments",
      subtitle:
        "Trade crypto with confidence using real-time data and expert tools.",
      cta: "Get Started",
    },
    {
      img: Hero2,
      title: "Join Thousands Earning Daily",
      subtitle:
        "Chris from Slovenia just earned $16,711 – your success starts here.",
      cta: "Get Started Now!",
    },
    {
      img: Hero3,
      title: "Secure. Fast. Transparent.",
      subtitle: "Advanced analytics, instant withdrawals, and 24/7 support.",
      cta: "Start Trading",
    },
  ];

  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const heroTimerRef = useRef(null);

  useEffect(() => {
    if (heroPaused) return;
    heroTimerRef.current = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(heroTimerRef.current);
  }, [heroPaused]);

  // Dynamic Earning Notification
  const names = ["Chris", "Maria", "Alex", "Liam", "Sofia", "Noah"];
  const countries = ["Slovenia", "Germany", "Canada", "Australia", "UK", "USA"];

  const [earning, setEarning] = useState(() => ({
    name: names[Math.floor(Math.random() * names.length)],
    country: countries[Math.floor(Math.random() * countries.length)],
    amount: Math.floor(Math.random() * 20000) + 5000,
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setEarning({
        name: names[Math.floor(Math.random() * names.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
        amount: Math.floor(Math.random() * 20000) + 5000,
      });
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Testimonials
  const testimonials = [
    {
      quote:
        "The transparency and integrity of this platform are refreshing...",
      author: "Tony O'Brien",
    },
    {
      quote: "TRADENIXPRO has transformed my investment journey...",
      author: "Tolani Olushola",
    },
    {
      quote:
        "Fast withdrawals, clear analytics, and a support team that actually listens...",
      author: "Alex Diaz",
    },
  ];

  const [testSlide, setTestSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setTestSlide((s) => (s + 1) % testimonials.length),
      4000,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* CoinGecko Live Ticker */}
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

      {/* Hero Carousel */}
      <div
        className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden"
        onMouseEnter={() => setHeroPaused(true)}
        onMouseLeave={() => setHeroPaused(false)}
      >
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === heroIndex ? "opacity-100" : "opacity-0"}`}
          >
            <img
              src={slide.img}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-4xl mx-auto">
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 max-w-2xl mx-auto opacity-90">
                  {slide.subtitle}
                </p>
                <Link to="/register">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition transform hover:scale-105">
                    {slide.cta}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Connect with the Right Broker */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-7xl mx-auto">
            <div className="flex flex-col justify-center space-y-6 lg:space-y-8 text-center lg:text-left">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                ABOUT TRADENIXPRO
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Connect with the right Broker.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Whether you are experienced or a beginner, connecting with the
                right broker is everything. Freedom Trade is a leading trade and
                investment company with years of industry experience.
              </p>
              <Link
                to="/about"
                className="text-blue-600 font-medium hover:underline"
              >
                Read More →
              </Link>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img
                src={TradeHand}
                alt="Trading"
                className="w-full max-w-lg rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* OUR SERVICES SECTION */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4">
            OUR SERVICES
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 max-w-5xl mx-auto leading-tight">
            Bring to the table win-win survival strategies to ensure proactive
            domination.
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-8 mb-16"></div>

          <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            <div className="group border-4 bg-gray-100 p-10 rounded-2xl">
              <img
                src={ServiceInvestment}
                alt="Investment"
                className="w-full h-64 object-cover rounded-2xl mb-6"
              />
              <h3 className="text-2xl font-bold mb-4">
                Investment Consultancy
              </h3>
              <p className="text-gray-600 mb-6">
                We do in-depth work on formulating clients' investment
                strategies...
              </p>
              <Link
                to="/services"
                className="text-blue-600 font-semibold hover:underline"
              >
                Read More →
              </Link>
            </div>

            <div className="group border-4 bg-gray-100 p-10 rounded-2xl">
              <img
                src={ServiceCrypto}
                alt="Crypto"
                className="w-full h-64 object-cover rounded-2xl mb-6"
              />
              <h3 className="text-2xl font-bold mb-4">
                Cryptocurrency Investment
              </h3>
              <p className="text-gray-600 mb-6">
                Virtual or crypto currencies like Bitcoin and Ethereum...
              </p>
              <Link
                to="/services"
                className="text-blue-600 font-semibold hover:underline"
              >
                Read More →
              </Link>
            </div>

            <div className="group border-4 bg-gray-100 p-10 rounded-2xl">
              <img
                src={ServiceForex}
                alt="Forex"
                className="w-full h-64 object-cover rounded-2xl mb-6"
              />
              <h3 className="text-2xl font-bold mb-4">Forex Trading</h3>
              <p className="text-gray-600 mb-6">
                The Forex market also referred to as the "Currency market"...
              </p>
              <Link
                to="/services"
                className="text-blue-600 font-semibold hover:underline"
              >
                Read More →
              </Link>
            </div>
          </div>

          <Link to="/services">
            <button className="mt-16 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-lg text-lg transition transform hover:scale-105 shadow-lg">
              View All Services
            </button>
          </Link>
        </div>
      </section>

      {/* Live Trading Chart */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Live Market Chart
          </h3>
          <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 max-w-7xl mx-auto">
            <div className="h-96 md:h-[600px]">
              <TradingViewWidget />
            </div>
          </div>
        </div>
      </section>

      {/* How Does it Work */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">
            TRADENIXPRO
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
            How Does it Work?
          </h2>
          <div className="w-32 h-1 bg-blue-600 mx-auto mb-16"></div>

          <div className="max-w-4xl mx-auto">
            <div className="relative pt-[56.25%] rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/x7msE3tx8QI"
                title="Why Invest?"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            <Link to="/services">
              <button className="mt-12 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-lg text-lg transition transform hover:scale-105 shadow-lg">
                READ MORE
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials + Live Earnings */}
      <section className="py-16 px-4 bg-slate-900">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-100 mb-10">
            What Our Customers Say
          </h2>

          <div className="relative overflow-hidden rounded-xl bg-slate-800 p-8">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${testSlide * 100}%)` }}
            >
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="w-full flex-shrink-0 px-6 text-center"
                >
                  <p className="text-lg md:text-xl text-gray-300 italic mb-8 leading-relaxed">
                    "{t.quote}"
                  </p>
                  <p className="font-semibold text-green-400">- {t.author}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestSlide(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === testSlide ? "bg-green-400 w-8" : "bg-gray-600"}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-12">
            <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-6 max-w-md mx-auto text-center shadow-2xl">
              <div className="text-5xl mb-3">🎉</div>
              <p className="text-sm text-gray-300">
                <strong className="text-green-400">{earning.name}</strong> from{" "}
                <strong className="text-green-400">{earning.country}</strong>
              </p>
              <p className="text-2xl md:text-3xl font-bold text-green-400 mt-3">
                just earned ${earning.amount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default LandingPage;
