const Hero = () => {
  return (
    <section className="py-20 px-4 text-center bg-gradient-to-b from-slate-900 to-blue-900/10 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-100 mb-6">
          Professional Investment
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Investment services tailored to meet your individual needs.
        </p>
        <div className="space-x-4">
          <button className="bg-green-400 text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors">
            Sign Up
          </button>
          <button className="border border-gray-300 text-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 hover:text-slate-900 transition-colors">
            Log In
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
