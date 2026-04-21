import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";

// Import images
import faqHeroBg from "../assets/images/faq/faq-hero-bg.png";

const COINGECKO_KEY = import.meta.env.VITE_COINGECKO_KEY;

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // CoinGecko Ticker
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

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Bitcoin?",
      answer:
        "Bitcoin is a form of digital currency which is based on an open source code that was created and is held electronically. Bitcoin is a decentralized form of currency, meaning that it does not belong to any form of government and is not controlled by anyone.",
    },
    {
      question: "Who Developed Bitcoin?",
      answer:
        "The original Bitcoin code was designed by Satoshi Nakamoto under MIT open source credentials. In 2008 Nakamoto outlined the idea behind Bitcoin in his White Paper.",
    },
    {
      question: "What is Bitcoin Mining?",
      answer:
        "Bitcoin mining is analogous to the mining of gold, but its digital form. The process involves specialized computers solving algorithmic equations or hash functions.",
    },
    {
      question: "Is Bitcoin Used For Illegal Activities?",
      answer:
        "While Bitcoin offers a high degree of anonymity, it is also widely used for legitimate purposes. Like any currency, it can be misused, but the vast majority of Bitcoin transactions are legal.",
    },
    {
      question: "Can Bitcoin Be Regulated In Any Way?",
      answer:
        "Bitcoin is a decentralized network. However, governments can regulate exchanges and businesses that deal with Bitcoin.",
    },
    {
      question: "Is Bitcoin anonymous?",
      answer:
        "Bitcoin is pseudonymous. All transactions are recorded on a public ledger, but users are identified only by their wallet addresses.",
    },
    {
      question: "How Can I Sell Bitcoins?",
      answer:
        "You can sell Bitcoins on exchanges, peer-to-peer platforms like LocalBitcoins, Bitcoin ATMs, or directly to individuals who have a Bitcoin address.",
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
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${faqHeroBg})` }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-2xl text-gray-200">Do you have any Questions?</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-gray-50 dark:bg-slate-950">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-slate-700"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                >
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  <span
                    className="text-2xl text-blue-600 transition-transform duration-300"
                    style={{
                      transform:
                        openIndex === index ? "rotate(45deg)" : "rotate(0)",
                    }}
                  >
                    +
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-8 pb-8 text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-700 to-emerald-600 py-20 text-white text-center">
        <h3 className="text-4xl font-bold mb-6">Still Have Questions?</h3>
        <Link
          to="/contact"
          className="inline-block bg-white text-blue-700 font-bold px-12 py-5 rounded-2xl hover:bg-gray-100 transition text-xl"
        >
          Contact Our Support Team →
        </Link>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FAQ;
