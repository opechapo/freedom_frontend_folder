// components/HeroCarousel.jsx
import { useState, useEffect } from "react";

const slides = [
  {
    img: "/hero-slide-1.jpg", // You'll replace with generated images
    title: "Manage and Grow Your Investments",
    subtitle:
      "Trade crypto with confidence using real-time data and expert tools.",
    cta: "Open Account",
  },
  {
    img: "/hero-slide-2.jpg",
    title: "Join Thousands Earning Daily",
    subtitle:
      "Chris from Slovenia just earned $16,711 – your success starts here.",
    cta: "Get Started Now!",
  },
  {
    img: "/hero-slide-3.jpg",
    title: "Secure. Fast. Transparent.",
    subtitle: "Advanced analytics, instant withdrawals, and 24/7 support.",
    cta: "Start Trading",
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.img}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white px-6 max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                {slide.subtitle}
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition">
                {slide.cta}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-colors ${
              i === current ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
