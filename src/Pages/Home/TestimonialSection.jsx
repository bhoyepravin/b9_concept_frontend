import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import testimonialData from "../../constant/Home/testimonialData.json";

const TestimonialSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(
        (prev) => (prev + 1) % testimonialData.testimonials.length
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const sliderVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    }),
  };

  const imageVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
      },
    },
  };

  const dotVariants = {
    inactive: {
      scale: 0.8,
      opacity: 0.5,
      transition: {
        duration: 0.2,
      },
    },
    active: {
      scale: 1.2,
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonialData.testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? testimonialData.testimonials.length - 1 : prev - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section
      id={testimonialData.section.id}
      className={testimonialData.section.classes}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="container mx-auto px-4"
      >
        {/* Title */}
        <motion.h2
          variants={titleVariants}
          className="text-3xl md:text-4xl font-semibold font-montserrat text-deep-blue text-center mb-12"
        >
          {testimonialData.section.title}
        </motion.h2>

        {/* Testimonial Slider */}
        <motion.div
          variants={sliderVariants}
          className={testimonialData.styles.container}
        >
          {/* Slider Container */}
          <div className="relative h-80 md:h-72">
            <AnimatePresence mode="wait" custom={1}>
              <motion.div
                key={currentSlide}
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className={testimonialData.styles.slide}
              >
                {/* Testimonial Image */}
                <motion.img
                  variants={imageVariants}
                  src={testimonialData.testimonials[currentSlide].image}
                  alt={testimonialData.testimonials[currentSlide].name}
                  className={testimonialData.styles.image}
                  width={100}
                  height={100}
                />

                {/* Testimonial Text */}
                <motion.p
                  variants={textVariants}
                  className={testimonialData.styles.text}
                >
                  {testimonialData.testimonials[currentSlide].testimonial}
                </motion.p>

                {/* Testimonial Name */}
                <motion.h4
                  variants={textVariants}
                  className={testimonialData.styles.name}
                >
                  {testimonialData.testimonials[currentSlide].name}
                </motion.h4>

                {/* Condition */}
                <motion.p
                  variants={textVariants}
                  className={testimonialData.styles.condition}
                >
                  {testimonialData.testimonials[currentSlide].condition}
                </motion.p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200"
              aria-label="Previous testimonial"
            >
              <svg
                className="w-6 h-6 text-deep-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200"
              aria-label="Next testimonial"
            >
              <svg
                className="w-6 h-6 text-deep-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Dots Indicator */}
          <motion.div
            variants={containerVariants}
            className={testimonialData.styles.dotsContainer}
          >
            {testimonialData.testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                variants={dotVariants}
                animate={currentSlide === index ? "active" : "inactive"}
                whileHover={{ scale: 1.3 }}
                className={`w-3 h-3 rounded-full ${
                  currentSlide === index ? "bg-hope-gold" : "bg-medium-gray"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TestimonialSection;
