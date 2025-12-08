import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import truthData from "../../constant/Home/truthData.json";

const Counter = ({ target, prefix = "", suffix = "", duration = 2000 }) => {
  const [count, setCount] = React.useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          let start = 0;
          const increment = target / (duration / 16);

          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [target, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {target.toString().includes(".") ? count.toFixed(1) : count}
      {suffix}
    </span>
  );
};

const TruthSection = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 0.8,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.3,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.4,
      },
    },
  };

  return (
    <section className="py-12 md:py-20 bg-deep-blue text-white">
      <div className="container mx-auto text-center px-4">
        <motion.h2
          className="text-2xl md:text-3xl lg:text-4xl font-semibold font-montserrat mb-4"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {truthData.title}
        </motion.h2>

        <motion.p
          className="max-w-3xl mx-auto text-medium-gray mb-8 md:mb-12 text-base md:text-lg"
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {truthData.subtitle}
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {truthData.stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-dark-gray p-6 md:p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              variants={itemVariants}
              whileHover="hover"
            >
              <motion.p
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                style={{ color: stat.color }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  delay: 0.5 + index * 0.2,
                  duration: 0.8,
                }}
                viewport={{ once: true }}
              >
                {stat.prefix}
                <Counter
                  target={stat.value}
                  prefix={stat.numberPrefix}
                  suffix={stat.numberSuffix}
                />
                {stat.suffix}
              </motion.p>

              <motion.h3
                className="text-xl md:text-2xl font-semibold mb-2 md:mb-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                {stat.title}
              </motion.h3>

              <motion.p
                className="text-medium-gray text-sm md:text-base leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1.0 + index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                {stat.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TruthSection;
