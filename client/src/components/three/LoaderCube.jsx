import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useT } from "../../i18n";

/**
 * Colorful neon loader.
 * - Always stays visible for 2 seconds, then calls onDone.
 * - Does not wait for `ready`, so a slow/stuck readiness flag cannot trap users.
 * - Keeps the existing { ready, onDone } prop signature for compatibility.
 */
export default function LoaderCube({ onDone }) {
  const reduceMotion = useReducedMotion();
  const { t } = useT();
  const [pct, setPct] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const duration = 2000;
    const startedAt = performance.now();
    let intervalId;

    const updateProgress = () => {
      const elapsed = performance.now() - startedAt;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out progress, reaching 100% at the 2-second mark.
      const eased = 1 - Math.pow(1 - progress, 2);
      setPct(Math.min(100, Math.round(eased * 100)));

      if (progress >= 1) {
        window.clearInterval(intervalId);
        doneRef.current?.();
      }
    };

    intervalId = window.setInterval(updateProgress, 20);
    updateProgress();

    return () => window.clearInterval(intervalId);
  }, []);

  const spinTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 5, ease: "linear", repeat: Infinity };

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label={t("loading")}
      className="fixed inset-0 z-[200] grid place-items-center overflow-hidden bg-[#07051a] text-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.035, filter: "blur(8px)" }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      {/* Ambient neon glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(105, 45, 255, .22), transparent 32%), radial-gradient(circle at 20% 75%, rgba(0, 245, 255, .12), transparent 28%), radial-gradient(circle at 82% 22%, rgba(255, 0, 170, .13), transparent 26%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        {/* Neon 3D core */}
        <div
          className="relative grid h-48 w-48 place-items-center sm:h-56 sm:w-56"
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-4 rounded-full"
            animate={
              reduceMotion
                ? undefined
                : { scale: [0.92, 1.08, 0.92], opacity: [0.35, 0.7, 0.35] }
            }
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(circle, rgba(124,58,237,.45), rgba(6,182,212,.08) 58%, transparent 72%)",
              filter: "blur(10px)",
            }}
          />

          <motion.div
            className="absolute h-36 w-36 rounded-[30%] border-2 border-cyan-300/90 sm:h-40 sm:w-40"
            style={{
              transformStyle: "preserve-3d",
              boxShadow:
                "0 0 12px #22d3ee, inset 0 0 18px rgba(34,211,238,.35)",
            }}
            animate={
              reduceMotion
                ? undefined
                : {
                    rotateX: [0, 180, 360],
                    rotateY: [0, 180, 360],
                    rotateZ: [0, 90, 180],
                  }
            }
            transition={spinTransition}
          />

          <motion.div
            className="absolute h-32 w-32 rounded-[28%] border-2 border-fuchsia-400/90 sm:h-36 sm:w-36"
            style={{
              transformStyle: "preserve-3d",
              boxShadow:
                "0 0 14px #e879f9, inset 0 0 18px rgba(232,121,249,.28)",
            }}
            animate={
              reduceMotion
                ? undefined
                : {
                    rotateX: [360, 180, 0],
                    rotateY: [0, 360],
                    rotateZ: [0, -180],
                  }
            }
            transition={{ duration: 4.2, ease: "linear", repeat: Infinity }}
          />

          <motion.div
            className="absolute h-24 w-24 rounded-full border border-violet-300/90 sm:h-28 sm:w-28"
            style={{
              boxShadow:
                "0 0 22px rgba(167,139,250,.85), inset 0 0 18px rgba(139,92,246,.45)",
              background:
                "radial-gradient(circle at 30% 25%, rgba(255,255,255,.95), rgba(129,140,248,.75) 18%, rgba(124,58,237,.45) 48%, rgba(7,5,26,.9) 75%)",
            }}
            animate={
              reduceMotion
                ? undefined
                : { scale: [0.9, 1.08, 0.9], rotate: [0, 180, 360] }
            }
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Orbiting neon particles */}
          {[0, 1, 2, 3].map((item) => (
            <motion.span
              key={item}
              className="absolute h-3 w-3 rounded-full"
              style={{
                background: ["#22d3ee", "#f472b6", "#a3e635", "#c4b5fd"][item],
                boxShadow: [
                  "0 0 14px #22d3ee",
                  "0 0 14px #f472b6",
                  "0 0 14px #a3e635",
                  "0 0 14px #c4b5fd",
                ][item],
                top: "50%",
                left: "50%",
                marginTop: -6,
                marginLeft: -6,
                transformOrigin: ["0 -78px", "0 -92px", "0 -68px", "0 -84px"][
                  item
                ],
              }}
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{
                duration: [2.2, 3, 2.6, 3.4][item],
                ease: "linear",
                repeat: Infinity,
              }}
            />
          ))}
        </div>

        <div className="w-64 text-center sm:w-72">
          <motion.p
            className="text-xs font-semibold uppercase tracking-[0.42em] text-cyan-200"
            animate={reduceMotion ? undefined : { opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            ZUBAYER
          </motion.p>

          <h2
            className="mt-2 bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-violet-300 bg-clip-text text-xl font-bold tracking-wide text-transparent sm:text-2xl"
            style={{ filter: "drop-shadow(0 0 12px rgba(167,139,250,.35))" }}
          >
            {t("loading")}
          </h2>

          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-400"
              style={{
                width: `${pct}%`,
                boxShadow: "0 0 16px rgba(217,70,239,.75)",
              }}
              transition={{ duration: 0.08, ease: "linear" }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between font-mono text-xs text-white/55">
            <span>INITIALIZING</span>
            <span className="tabular-nums">
              {String(pct).padStart(2, "0")}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
