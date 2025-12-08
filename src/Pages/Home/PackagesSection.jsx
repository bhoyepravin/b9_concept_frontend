import React from "react";
import { motion } from "framer-motion";
import packagesData from "../../constant/Home/packagesData.json";

const PackagesSection = () => {
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
      },
    },
  };

  const popularVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        delay: 0.5,
      },
    },
    hover: {
      y: -10,
      scale: 1.05,
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
        delay: 0.3,
      },
    },
  };

  return (
    <section id="packages" className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl font-semibold font-montserrat text-deep-blue mb-4"
            variants={titleVariants}
          >
            {packagesData.title}
          </motion.h2>
          <motion.p
            className="text-base md:text-lg text-dark-gray max-w-2xl mx-auto"
            variants={textVariants}
          >
            {packagesData.subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-12 md:mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {packagesData.packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              className={`package-card-custom bg-light-gray rounded-lg shadow-xl overflow-hidden border-2 ${
                pkg.isPopular
                  ? "border-hope-gold relative transform md:scale-105"
                  : "border-transparent"
              } hover:shadow-2xl transition-all duration-300`}
              variants={pkg.isPopular ? popularVariants : itemVariants}
              whileHover="hover"
            >
              {/* Popular Badge */}
              {pkg.isPopular && (
                <motion.div
                  className="absolute top-4 -right-10 bg-hope-gold text-deep-blue font-semibold uppercase text-xs px-10 py-1 shadow-lg transform rotate-45"
                  variants={popularVariants}
                >
                  Most Popular
                </motion.div>
              )}

              {/* Header */}
              <div className="bg-deep-blue text-white p-6 md:p-8 text-center">
                <motion.h3
                  className="text-xl md:text-2xl font-bold font-montserrat mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {pkg.title}
                </motion.h3>
                <motion.p
                  className="text-4xl md:text-5xl font-bold font-montserrat text-success-green mb-3"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    delay: 0.3 + index * 0.1,
                  }}
                  viewport={{ once: true }}
                >
                  {pkg.price}
                </motion.p>
                <motion.p
                  className="font-light italic h-12 text-sm md:text-base"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {pkg.tagline}
                </motion.p>
              </div>

              {/* Features */}
              <div className="p-6 md:p-8 flex-grow">
                {pkg.features.map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    className="mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.5 + index * 0.1 + featureIndex * 0.05,
                    }}
                    viewport={{ once: true }}
                  >
                    <h4 className="flex items-center text-sm md:text-md font-semibold text-deep-blue mb-3">
                      <span className="text-success-green mr-2">✓</span>{" "}
                      {feature.title}
                    </h4>
                    <p className="text-xs md:text-sm text-medium-gray mb-2 pl-6">
                      {feature.description}
                    </p>
                    <ul className="list-disc list-outside text-xs md:text-sm text-dark-gray space-y-1 pl-8 md:pl-12">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex}>{benefit}</li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 md:p-6 bg-gray-200/50 mt-auto">
                <motion.p
                  className="text-xs text-medium-gray mb-1"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <strong>Timeline:</strong> {pkg.timeline}
                </motion.p>
                <motion.p
                  className="text-xs text-medium-gray mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <strong>Best For:</strong> {pkg.bestFor}
                </motion.p>
                <motion.a
                  href="#booking"
                  data-package-select={pkg.id}
                  className={`block w-full text-center font-montserrat font-semibold uppercase px-6 py-3 rounded-full hover:bg-opacity-90 transition transform hover:scale-105 text-sm md:text-base ${
                    pkg.isPopular
                      ? "bg-hope-gold text-deep-blue"
                      : "bg-wellness-green text-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book This Package
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PackagesSection;
