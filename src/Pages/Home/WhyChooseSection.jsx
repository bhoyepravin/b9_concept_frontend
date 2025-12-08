import React from "react";
import { motion } from "framer-motion";
import whyChooseData from "../../constant/Home/whyChooseData.json";

const WhyChooseSection = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
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

  return (
    <section className="py-12 md:py-20 bg-deep-blue text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          className="text-2xl md:text-3xl lg:text-4xl font-semibold font-montserrat mb-8 md:mb-12"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {whyChooseData.title}
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {whyChooseData.reasons.map((reason, index) => (
            <motion.div
              key={index}
              className="bg-dark-gray/50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              variants={itemVariants}
              whileHover="hover"
            >
              <motion.h3
                className="text-xl md:text-2xl font-bold text-hope-gold mb-3 md:mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                {reason.title}
              </motion.h3>
              <motion.p
                className="text-sm md:text-base leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                {reason.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
