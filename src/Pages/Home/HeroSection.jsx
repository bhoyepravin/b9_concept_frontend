import React from "react";
import { motion } from "framer-motion";
import heroContent from "../../constant/Home/heroContent.json";

const HeroSection = () => {
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
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <main className="pt-40">
      <section
        id="home"
        className=" md:h-screen w-full relative flex flex-col items-center justify-center text-white text-center overflow-hidden -mt-60 pt-20"
      >
        {/* Background Video */}
        <div className="absolute inset-0 z-0 ">
          <div className="w-full h-full relative">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover"
            >
              <source src={heroContent.videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-20"></div>

        {/* Content */}
        <motion.div
          className="z-20 p-4 md:p-8 bg-deep-blue/80 w-full flex-grow flex flex-col items-center justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat leading-tight mb-4 md:mb-6 px-2"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-white to-hope-gold bg-clip-text text-transparent text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 block">
              {heroContent.headline}
            </span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl font-montserrat font-light max-w-3xl mx-auto mb-6 md:mb-8 px-4 leading-relaxed"
            variants={itemVariants}
          >
            {heroContent.subheadline}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-6 md:mb-8"
            variants={itemVariants}
          >
            <motion.a
              href="#solution"
              className="inline-block bg-wellness-green text-white font-montserrat font-semibold uppercase px-6 py-3 md:px-8 md:py-4 rounded-full hover:bg-opacity-90 text-sm md:text-base w-full sm:w-auto text-center"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {heroContent.buttons.discoverSolution}
            </motion.a>
            <motion.a
              href="#booking"
              className="inline-block bg-hope-gold text-deep-blue font-montserrat font-semibold uppercase px-6 py-3 md:px-8 md:py-4 rounded-full hover:bg-opacity-90 text-sm md:text-base w-full sm:w-auto text-center"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {heroContent.buttons.bookYourFreedom}
            </motion.a>
          </motion.div>

          <motion.p
            className="text-base md:text-lg font-semibold mt-4 md:mt-8  text-white bg-deep-blue/50 py-2 px-6 rounded-full"
            variants={itemVariants}
          >
            {heroContent.stats}
          </motion.p>
        </motion.div>
      </section>
    </main>
  );
};

export default HeroSection;
