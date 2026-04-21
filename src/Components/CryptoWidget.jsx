import { useEffect, useState } from "react";

const COINGECKO_KEY = import.meta.env.VITE_COINGECKO_KEY;

const CryptoWidget = () => {
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
        const ids = "bitcoin,ethereum,litecoin,ripple";
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&x_cg_demo_api_key=${COINGECKO_KEY}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch prices");
        const data = await res.json();

        const format = (obj) => ({
          price: `$${obj.usd.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          change: `${
            obj.usd_24h_change >= 0 ? "+" : ""
          }${obj.usd_24h_change.toFixed(2)}%`,
        });

        setCoins([
          { name: "Bitcoin (BTC)", ...format(data.bitcoin) },
          { name: "Ethereum (ETH)", ...format(data.ethereum) },
          { name: "Litecoin (LTC)", ...format(data.litecoin) },
          { name: "XRP (XRP)", ...format(data.ripple) },
        ]);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const id = setInterval(fetchPrices, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-3 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base">
          {loading && <p className="text-gray-400">Loading prices...</p>}
          {error && <p className="text-red-400">{error}</p>}
          {coins.map((coin, i) => (
            <div key={i} className="flex items-center gap-2 text-white">
              <span className="font-medium">{coin.name}</span>
              <span className="font-bold text-green-400">{coin.price}</span>
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
        <p className="text-center text-xs text-gray-500 mt-1">
          Powered by CoinGecko
        </p>
      </div>
    </section>
  );
};

export default CryptoWidget;
