import React, { useEffect, useState } from "react";
import Footer from "../Components/Footer";

// Import all license seals
import fincenSeal from "../assets/images/license/fincen-seal-removebg.png";
import alabamaBankingSeal from "../assets/images/license/alabama-banking-seal-removebg.png";
import alabamaSecuritiesSeal from "../assets/images/license/alabama-securities-seal.png";
import arizonaSeal from "../assets/images/license/arizona-seal.png";
import arkansasSeal from "../assets/images/license/arkansas-seal-removebg.png";
import westVirginiaSeal from "../assets/images/license/west-virginia-seal.png";
import wyomingSeal from "../assets/images/license/wyoming-seal.png";
import fintracSeal from "../assets/images/license/fintrac-seal.webp";
import sofitSeal from "../assets/images/license/sofit-seal.png";
import asicSeal from "../assets/images/license/asic-seal.jpg";

const COINGECKO_KEY = import.meta.env.VITE_COINGECKO_KEY;

const License = () => {
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

  return (
    <div className="bg-white min-h-screen">
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
      <div className="bg-slate-900 py-24 text-white text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Licenses & Registrations
        </h1>
        <p className="text-xl text-gray-200 max-w-4xl mx-auto px-6 leading-relaxed">
          In order to ensure the provision of their portfolio of services in
          full compliance with all applicable global and local regulations and
          standards, the Freedom Trade companies hold licenses and registrations
          in numerous jurisdictions worldwide, and are constantly bringing their
          operations in line with newly adopted legislative changes.
        </p>
      </div>

      {/* Licenses Grid */}
      <div className="container mx-auto px-6 py-16">
        <p className="text-center text-gray-600 mb-16 text-lg font-medium">
          Assets audited by
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {/* 1. FinCEN */}
          <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-md hover:shadow-xl transition-all">
            <div className="flex justify-center mb-8">
              <img
                src={fincenSeal}
                alt="FinCEN"
                className="w-36 h-36 object-contain"
              />
            </div>
            <p className="text-center text-sm font-medium text-gray-600 mb-1">
              UNITED STATES
            </p>
            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">
              U.S. Financial Crimes Enforcement Network
            </h3>
            <p className="text-center text-blue-600 font-semibold mb-8">
              Money Service Business Registration
            </p>
            <div className="space-y-6 text-center">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  REFERENCE NO.
                </p>
                <p className="font-mono text-xl font-semibold text-gray-900">
                  31000201469839
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">COMPANY</p>
                <p className="font-semibold text-lg text-gray-900">
                  Freedom Trade Financial LLC
                </p>
              </div>
              <a
                href="https://www.fincen.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-700 font-medium transition"
              >
                https://www.fincen.gov
              </a>
            </div>
          </div>

          {/* 2. Alabama State Banking */}
          <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-md hover:shadow-xl transition-all">
            <div className="flex justify-center mb-8">
              <img
                src={alabamaBankingSeal}
                alt="Alabama Banking"
                className="w-36 h-36 object-contain"
              />
            </div>
            <p className="text-center text-sm font-medium text-gray-600 mb-1">
              UNITED STATES, ALABAMA
            </p>
            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">
              State Banking Department
            </h3>
            <p className="text-center text-blue-600 font-semibold mb-8">
              Consumer Credit License
            </p>
            <div className="space-y-6 text-center">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  REFERENCE NO.
                </p>
                <p className="font-mono text-xl font-semibold text-gray-900">
                  MC 22385
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">COMPANY</p>
                <p className="font-semibold text-lg text-gray-900">
                  Freedom Trade Financial LLC
                </p>
              </div>
              <a
                href="https://www.banking.alabama.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-700 font-medium transition"
              >
                https://www.banking.alabama.gov
              </a>
            </div>
          </div>

          {/* 3. Alabama Securities Commission */}
          <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-md hover:shadow-xl transition-all">
            <div className="flex justify-center mb-8">
              <img
                src={alabamaSecuritiesSeal}
                alt="Alabama Securities"
                className="w-36 h-36 object-contain"
              />
            </div>
            <p className="text-center text-sm font-medium text-gray-600 mb-1">
              UNITED STATES, ALABAMA
            </p>
            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">
              Alabama Securities Commission
            </h3>
            <p className="text-center text-blue-600 font-semibold mb-8">
              Money Transmitter License
            </p>
            <div className="space-y-6 text-center">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  REFERENCE NO.
                </p>
                <p className="font-mono text-xl font-semibold text-gray-900">
                  # 769
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">COMPANY</p>
                <p className="font-semibold text-lg text-gray-900">
                  Freedom Trade Financial LLC
                </p>
              </div>
              <a
                href="https://www.asc.alabama.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-700 font-medium transition"
              >
                https://www.asc.alabama.gov
              </a>
            </div>
          </div>

          {/* 4. Arizona Money Transmitter */}
          <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-md hover:shadow-xl transition-all">
            <div className="flex justify-center mb-8">
              <img
                src={arizonaSeal}
                alt="Arizona"
                className="w-36 h-36 object-contain"
              />
            </div>
            <p className="text-center text-sm font-medium text-gray-600 mb-1">
              UNITED STATES, ARIZONA
            </p>
            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">
              Department of Insurance and Financial Institutions
            </h3>
            <p className="text-center text-blue-600 font-semibold mb-8">
              Money Transmitter License
            </p>
            <div className="space-y-6 text-center">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  REFERENCE NO.
                </p>
                <p className="font-mono text-xl font-semibold text-gray-900">
                  MT-987654
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">COMPANY</p>
                <p className="font-semibold text-lg text-gray-900">
                  Freedom Trade Financial LLC
                </p>
              </div>
              <a
                href="https://dif.az.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-700 font-medium transition"
              >
                https://dif.az.gov
              </a>
            </div>
          </div>

          {/* 5. Arizona Consumer Lender */}
          <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-md hover:shadow-xl transition-all">
            <div className="flex justify-center mb-8">
              <img
                src={arizonaSeal}
                alt="Arizona"
                className="w-36 h-36 object-contain"
              />
            </div>
            <p className="text-center text-sm font-medium text-gray-600 mb-1">
              UNITED STATES, ARIZONA
            </p>
            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">
              Department of Insurance and Financial Institutions
            </h3>
            <p className="text-center text-blue-600 font-semibold mb-8">
              Consumer Lender License
            </p>
            <div className="space-y-6 text-center">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  REFERENCE NO.
                </p>
                <p className="font-mono text-xl font-semibold text-gray-900">
                  CL-456789
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">COMPANY</p>
                <p className="font-semibold text-lg text-gray-900">
                  Freedom Trade Financial LLC
                </p>
              </div>
              <a
                href="https://dif.az.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-700 font-medium transition"
              >
                https://dif.az.gov
              </a>
            </div>
          </div>

          {/* 6. Arkansas Securities Department */}
          <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-md hover:shadow-xl transition-all">
            <div className="flex justify-center mb-8">
              <img
                src={arkansasSeal}
                alt="Arkansas"
                className="w-36 h-36 object-contain"
              />
            </div>
            <p className="text-center text-sm font-medium text-gray-600 mb-1">
              UNITED STATES, ARKANSAS
            </p>
            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">
              Arkansas Securities Department
            </h3>
            <p className="text-center text-blue-600 font-semibold mb-8">
              Money Transmitter License
            </p>
            <div className="space-y-6 text-center">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  REFERENCE NO.
                </p>
                <p className="font-mono text-xl font-semibold text-gray-900">
                  MT-112233
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">COMPANY</p>
                <p className="font-semibold text-lg text-gray-900">
                  Freedom Trade Financial LLC
                </p>
              </div>
              <a
                href="https://securities.arkansas.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-700 font-medium transition"
              >
                https://securities.arkansas.gov
              </a>
            </div>
          </div>

          {/* 7. West Virginia */}
          <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-md hover:shadow-xl transition-all">
            <div className="flex justify-center mb-8">
              <img
                src={westVirginiaSeal}
                alt="West Virginia"
                className="w-36 h-36 object-contain"
              />
            </div>
            <p className="text-center text-sm font-medium text-gray-600 mb-1">
              UNITED STATES, WEST VIRGINIA
            </p>
            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">
              West Virginia Division of Financial Institutions
            </h3>
            <p className="text-center text-blue-600 font-semibold mb-8">
              Money Transmitter License
            </p>
            <div className="space-y-6 text-center">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  REFERENCE NO.
                </p>
                <p className="font-mono text-xl font-semibold text-gray-900">
                  WVMT-1899654
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">COMPANY</p>
                <p className="font-semibold text-lg text-gray-900">
                  Freedom Trade Financial LLC
                </p>
              </div>
              <a
                href="#"
                className="block text-blue-600 hover:text-blue-700 font-medium transition"
              >
                Check it out
              </a>
            </div>
          </div>

          {/* 8. Wyoming */}
          <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-md hover:shadow-xl transition-all">
            <div className="flex justify-center mb-8">
              <img
                src={wyomingSeal}
                alt="Wyoming"
                className="w-36 h-36 object-contain"
              />
            </div>
            <p className="text-center text-sm font-medium text-gray-600 mb-1">
              UNITED STATES, WYOMING
            </p>
            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">
              Department of Audit
            </h3>
            <p className="text-center text-blue-600 font-semibold mb-8">
              Consumer Lender License
            </p>
            <div className="space-y-6 text-center">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  REFERENCE NO.
                </p>
                <p className="font-mono text-xl font-semibold text-gray-900">
                  CL-4229
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">COMPANY</p>
                <p className="font-semibold text-lg text-gray-900">
                  Freedom Trade Financial LLC
                </p>
              </div>
              <a
                href="http://audit.wyo.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-700 font-medium transition"
              >
                http://audit.wyo.gov
              </a>
            </div>
          </div>

          {/* 9. FINTRAC Canada */}
          <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-md hover:shadow-xl transition-all">
            <div className="flex justify-center mb-8">
              <img
                src={fintracSeal}
                alt="FINTRAC"
                className="w-36 h-36 object-contain"
              />
            </div>
            <p className="text-center text-sm font-medium text-gray-600 mb-1">
              CANADA
            </p>
            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">
              Financial Transactions and Reports Analysis Centre of Canada
            </h3>
            <p className="text-center text-blue-600 font-semibold mb-8">
              Money Service Business Registration
            </p>
            <div className="space-y-6 text-center">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  REFERENCE NO.
                </p>
                <p className="font-mono text-xl font-semibold text-gray-900">
                  M20280268
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">COMPANY</p>
                <p className="font-semibold text-lg text-gray-900">
                  SolvexaTrading Capital Inc.
                </p>
              </div>
              <a
                href="https://www.fintrac-canafe.gc.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-700 font-medium transition"
              >
                https://www.fintrac-canafe.gc.ca
              </a>
            </div>
          </div>

          {/* 10. SO-FIT Switzerland */}
          <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-md hover:shadow-xl transition-all">
            <div className="flex justify-center mb-8">
              <img
                src={sofitSeal}
                alt="SO-FIT"
                className="w-36 h-36 object-contain"
              />
            </div>
            <p className="text-center text-sm font-medium text-gray-600 mb-1">
              SWITZERLAND
            </p>
            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">
              SO-FIT
            </h3>
            <p className="text-center text-blue-600 font-semibold mb-8">
              Affiliated Member of the Recognized Self-Regulatory Organization
              “SO-FIT” - Geneva
            </p>
            <div className="space-y-6 text-center">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  REFERENCE NO.
                </p>
                <p className="font-mono text-xl font-semibold text-gray-900">
                  SOFIT-4782
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">COMPANY</p>
                <p className="font-semibold text-lg text-gray-900">
                  Freedom Trade Financial LLC
                </p>
              </div>
              <a
                href="#"
                className="block text-blue-600 hover:text-blue-700 font-medium transition"
              >
                View Certificate
              </a>
            </div>
          </div>

          {/* 11. ASIC Australia */}
          <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-md hover:shadow-xl transition-all">
            <div className="flex justify-center mb-8">
              <img
                src={asicSeal}
                alt="ASIC"
                className="w-36 h-36 object-contain"
              />
            </div>
            <p className="text-center text-sm font-medium text-gray-600 mb-1">
              AUSTRALIA
            </p>
            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">
              Australian Securities and Investments Commission
            </h3>
            <p className="text-center text-blue-600 font-semibold mb-8">
              Registration as Foreign Company
            </p>
            <div className="space-y-6 text-center">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  REFERENCE NO.
                </p>
                <p className="font-mono text-xl font-semibold text-gray-900">
                  ACN 678 945 321
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">COMPANY</p>
                <p className="font-semibold text-lg text-gray-900">
                  Freedom Trade Financial LLC
                </p>
              </div>
              <a
                href="https://asic.gov.au"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-700 font-medium transition"
              >
                https://asic.gov.au
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* What Does Being Licensed Mean? Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-black">
            What Does FreedomTrade Being Licensed and Regulated Mean?
          </h2>

          <div className="overflow-x-auto rounded-2xl shadow-lg">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-blue-700 text-white">
                  <th className="p-6 text-left font-semibold border-r border-blue-600 w-1/4">
                    What We Need To Provide
                  </th>
                  <th className="p-6 text-left font-semibold border-r border-blue-600 w-2/5">
                    Why Is It Important
                  </th>
                  <th className="p-6 text-left font-semibold w-1/3">
                    What Does It Mean For You
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-800 divide-y">
                <tr>
                  <td className="p-6 align-top font-medium border-r">
                    Adequate operational capital
                  </td>
                  <td className="p-6 align-top border-r">
                    a) Minimum initial capital requirement.
                    <br />
                    b) Protection of client funds.
                  </td>
                  <td className="p-6 align-top">
                    Your payouts are protected as entrusted to a company with
                    adequate operating capital.
                  </td>
                </tr>
                <tr>
                  <td className="p-6 align-top font-medium border-r">
                    Internal and external auditor is mandatory
                  </td>
                  <td className="p-6 align-top border-r">
                    Our accounts are subject to additional check.
                  </td>
                  <td className="p-6 align-top">
                    Four layers of defense for your business.
                  </td>
                </tr>
                <tr>
                  <td className="p-6 align-top font-medium border-r">
                    Sound Anti-money laundering (AML) policies
                  </td>
                  <td className="p-6 align-top border-r">
                    Risk-based approach and customer due diligence.
                  </td>
                  <td className="p-6 align-top">
                    Our AML/CTF policies make us a reliable partner.
                  </td>
                </tr>
                <tr>
                  <td className="p-6 align-top font-medium border-r">
                    Data protection and security
                  </td>
                  <td className="p-6 align-top border-r">
                    High level IT security and encryption.
                  </td>
                  <td className="p-6 align-top">
                    Your sensitive information is safe and protected with us.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cryptocurrency Trading Made Easy Section */}
      <div className="bg-[#1E3A8A] py-28 text-white text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Cryptocurrency
            <br />
            Trading Made
            <br />
            Easy
          </h2>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-10 max-w-2xl mx-auto">
            With the account that caters to your profit and prosperity through
            our leading investment service for digital assets and high-yield
            interest on your idle savings.
          </p>
          <a
            href="/register"
            className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg px-10 py-4 rounded-xl transition-all duration-300"
          >
            Create Account
            <span className="text-2xl">→</span>
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default License;
