"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Globe, Mail, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setEmail("");
        setShowModal(true);
        // Play welcome sound
        const audio = new Audio("/sound/welcome.mp3");
        audio.play().catch((e) => console.log("Audio play failed:", e));
      } else {
        const data = await response.json();
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!isReady ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-4xl font-extrabold bg-rose-500 tracking-tighter px-8 py-3 text-white rounded-full  mb-8 shadow-2xl shadow-rose-500/20"
          >
            stoqle
          </motion.div>
          <div className="w-48 h-1 bg-zinc-100 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 bg-rose-500"
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold"
          >
            Initializing Future
          </motion.p>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative min-h-screen flex flex-col items-center justify-center bg-white text-zinc-900 overflow-hidden selection:bg-rose-500/20 font-sans"
        >
          {/* Background Accents */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

          {/* Navigation / Logo */}
          <nav className="absolute top-0 left-0 right-0 p-8 flex justify-center md:justify-start md:px-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold bg-rose-500 tracking-tighter px-5 py-2 text-white rounded-full shadow-lg shadow-rose-500/10"
            >
              stoqle
            </motion.div>
          </nav>

          <main className="relative z-10 container mx-auto px-6 py-20 flex flex-col items-center text-center">
            {/* Staggered Bouncing Coming Soon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex gap-4 mb-12"
            >
              {["COMING", "SOON"].map((word, wordIdx) => (
                <motion.div
                  key={wordIdx}
                  className="flex gap-1"
                >
                  {word.split("").map((letter, letterIdx) => (
                    <motion.span
                      key={letterIdx}
                      initial={{ y: 0 }}
                      animate={{ y: [-15, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: (wordIdx * word.length + letterIdx) * 0.1 + 0.6,
                      }}
                      className="text-4xl md:text-6xl font-black text-rose-500 tracking-tighter"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.div>
              ))}
            </motion.div>

            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="max-w-4xl"
            >
              <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-6 text-zinc-900">
                Social Commerce <span className="relative inline-block px-1">
                  Redefined
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1.5, duration: 0.8, ease: "easeInOut" }}
                    className="absolute top-1/2 left-0 h-[6px] md:h-[12px] bg-rose-500/80 rounded-full -translate-y-1/2 -rotate-1"
                  />
                </span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-12 leading-relaxed">
                Discover, connect, and shop like never before.
              </p>
            </motion.div>

            {/* Waitlist Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="w-full max-w-md"
            >
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onSubmit={handleSubmit}
                    className="relative flex flex-col sm:flex-row gap-3"
                  >
                    <div className="relative flex-grow">
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-6 py-4 rounded-full bg-zinc-50 border border-zinc-200 focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/5 focus:outline-none transition-all text-sm disabled:opacity-50 shadow-sm caret-rose-500"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="relative">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-4 rounded-full bg-rose-500 text-white font-semibold text-sm hover:bg-rose-600 shadow-xl shadow-rose-500/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 active:scale-95"
                      >
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
                          />
                        ) : (
                          <>
                            Join Waitlist
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>

                      {/* Animated Hand Pointer */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: [0, 10, 0] }}
                        transition={{
                          opacity: { duration: 0.3 },
                          x: { repeat: Infinity, duration: 1, ease: "easeInOut" }
                        }}
                        className="absolute -left-12 lg:-left-16 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
                      >
                        <img
                          src="/hand.png"
                          alt="Point"
                          className="w-12 h-12 rotate-90 drop-shadow-xl"
                        />
                      </motion.div>
                    </div>
                  </motion.form>
                ) : (
                  <div className="p-6 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 font-semibold flex items-center justify-center gap-3">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Success! Welcome to stoqle.</span>
                  </div>
                )}
              </AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-xs text-red-500 font-medium"
                >
                  {error}
                </motion.p>
              )}
              <p className="mt-4 text-[10px] text-zinc-400 font-medium">
                * Early adopters get exclusive status and zero-fee trading for 6 months.
              </p>
            </motion.div>
          </main>

          {/* Footer / Socials */}
          <footer className="absolute bottom-8 left-0 right-0 z-10 flex flex-col items-center gap-6">
            <div className="flex items-center gap-6">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-rose-500 transition-colors" title="Website">
                <Globe className="w-5 h-5" />
              </a>
              <a href="https://wa.me/2348127494994?text=Hi%20Stoqle!%20I'm%20interested%20in%20learning%20more%20about%20the%20future%20of%20social%20commerce." target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#25D366] transition-colors" title="WhatsApp">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396 0 12.032c0 2.122.554 4.197 1.61 6.011l-1.71 6.242 6.384-1.674a11.845 11.845 0 005.759 1.492h.005c6.633 0 12.03-5.398 12.033-12.034a11.841 11.841 0 00-3.468-8.483z" />
                </svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#1877F2] transition-colors" title="Facebook">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-rose-500 transition-colors" title="Contact">
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-[10px] tracking-[0.1em] text-zinc-400 font-semibold">
              &copy; 2027 stoqle - All Rights Reserved. Kaduna state, Nigeria.
            </p>
          </footer>

          {/* Custom Success Modal */}
          <AnimatePresence>
            {showModal && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center border border-zinc-100"
                >
                  <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-rose-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2">Joined Successfully!</h3>
                  <p className="text-zinc-500 mb-8 leading-relaxed">
                    Welcome to the inner circle. We've sent a confirmation to your email.
                  </p>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-rose-500/20"
                  >
                    Awesome!
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Decorative Lines */}
          <div className="absolute top-1/2 left-0 w-32 h-[1px] bg-gradient-to-r from-transparent via-rose-500/10 to-transparent rotate-45 pointer-events-none" />
          <div className="absolute top-1/3 right-0 w-48 h-[1px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent -rotate-45 pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
