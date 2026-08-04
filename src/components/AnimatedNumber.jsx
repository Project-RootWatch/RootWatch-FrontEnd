import { useEffect, useRef } from "react";
import { useMotionValue, useTransform, animate, motion } from "motion/react";

export default function AnimatedNumber({ value, decimals = 0, className }) {
  const numericValue = Number(value);
  const motionValue = useMotionValue(numericValue);
  const rounded = useTransform(motionValue, (v) => v.toFixed(decimals));
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      motionValue.set(numericValue);
      isFirstRender.current = false;
      return;
    }
    const controls = animate(motionValue, numericValue, { duration: 0.6, ease: "easeOut" });
    return () => controls.stop();
  }, [numericValue, motionValue]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
