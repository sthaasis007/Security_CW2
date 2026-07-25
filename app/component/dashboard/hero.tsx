export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-2 md:items-center">
      <div className="w-full">
        <div className="aspect-[4/2] w-full overflow-hidden rounded-3xl border border-slate-00 bg-white">
          <img
            src="/images/dashpic.png"
            alt="Dashboard hero"
            className="h-full w-full object-contain object-center"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold leading-tight text-slate-900">
          EverBlue <br /> CLOTHING
        </h1>
        <p className="text-slate-600">
          Pay only for what suits you and what you like!
        </p>

        <div className="flex gap-3">
          <button className="rounded-full bg-amber-300 px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-200">
            For Men
          </button>
          <button className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
            For Women
          </button>
        </div>
      </div>
    </section>
  );
}
