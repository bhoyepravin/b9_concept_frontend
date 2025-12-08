import React from "react";
import { motion } from "framer-motion";
import solutionData from "../../constant/Home/solutionData.json";

const SolutionSection = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <section id="solution" className="py-12 md:py-20 bg-light-gray">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold font-montserrat text-deep-blue mb-3 md:mb-4">
            {solutionData.title}
          </h2>
          <motion.p
            className="text-base sm:text-lg text-dark-gray max-w-3xl mx-auto px-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            {solutionData.description}
          </motion.p>
        </motion.div>

        {/* Steps Container */}
        <motion.div
          className="max-w-4xl mx-auto space-y-8 md:space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {solutionData.steps.map((step, index) => (
            <motion.div
              key={index}
              className={`bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 ${
                index % 2 === 1 ? "md:bg-gray-50" : ""
              }`}
              variants={itemVariants}
            >
              <div
                className={`grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-8 ${
                  index % 2 === 1 ? "md:grid-flow-dense" : ""
                }`}
              >
                {/* Image Section - Mobile: Always first, Desktop: Alternating */}
                <motion.div
                  className={`${index % 2 === 1 ? "md:col-start-2" : ""}`}
                  variants={imageVariants}
                  whileHover="hover"
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    className="rounded-lg shadow-md w-full h-48 sm:h-64 md:h-80 object-cover"
                  />
                </motion.div>

                {/* Content Section */}
                <motion.div
                  className={`${
                    index % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Step Number Badge */}
                  <div className="flex items-center mb-3 md:mb-4">
                    <span className="bg-hope-gold text-deep-blue font-bold text-sm md:text-base px-3 py-1 rounded-full">
                      Step {index + 1}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-semibold text-deep-blue mb-3 md:mb-4 leading-tight">
                    {step.title}
                  </h3>

                  <motion.p
                    className="text-dark-gray text-sm sm:text-base leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    {step.description}
                  </motion.p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-8 md:mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <a
            href="#booking"
            className="inline-block bg-hope-gold text-deep-blue font-montserrat font-semibold uppercase px-6 py-3 md:px-8 md:py-4 rounded-full hover:bg-opacity-90 transition-all duration-300 text-sm md:text-base"
          >
            Start Your Transformation Journey
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionSection;
