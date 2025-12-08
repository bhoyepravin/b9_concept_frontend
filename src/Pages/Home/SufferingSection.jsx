import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import sufferingData from "../../constant/Home/sufferingData.json";
import sufferingBreakdownData from "../../constant/Home/sufferingBreakdownData.json";

const SufferingSection = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCondition, setActiveCondition] = useState(0);
  const [flippedCards, setFlippedCards] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const tabsRef = useRef(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleCardClick = (index) => {
    if (isMobile) {
      // On mobile, toggle flip on tap
      setFlippedCards((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    }
    // On desktop, hover handles it automatically
  };

  const handleShowDetails = (categoryIndex) => {
    const category = sufferingData.categories[categoryIndex];

    const breakdownCategory =
      sufferingBreakdownData.categories.find(
        (cat) => cat.title.toLowerCase() === category.title.toLowerCase()
      ) ||
      sufferingBreakdownData.categories[categoryIndex] ||
      sufferingBreakdownData.categories[0];

    setSelectedCategory({
      ...category,
      breakdown: breakdownCategory,
    });
    setActiveCondition(0);
    setIsModalOpen(true);
  };

  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      const scrollAmount = 200;
      if (direction === "left") {
        tabsRef.current.scrollLeft -= scrollAmount;
      } else {
        tabsRef.current.scrollLeft += scrollAmount;
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setActiveCondition(0);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const flipCardVariants = {
    hover: {
      rotateY: 180,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
    tap: {
      rotateY: 180,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  };

  const contentVariants = {
    front: {
      rotateY: 0,
    },
    back: {
      rotateY: 180,
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.3,
      },
    },
  };

  const overlayVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <>
      <section id="suffering" className="py-12 md:py-20 bg-white">
        <div className="container mx-auto text-center px-4">
          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl font-semibold font-montserrat text-deep-blue mb-8 md:mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            We See You Struggling
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {sufferingData.categories.map((category, index) => (
              <motion.div
                key={index}
                className="flip-card h-56 md:h-64 cursor-pointer"
                variants={itemVariants}
                whileHover={!isMobile ? "hover" : undefined}
                onClick={() => handleCardClick(index)}
              >
                <motion.div
                  className="flip-card-inner rounded-lg shadow-lg md:shadow-xl md:w-full md:h-full"
                  variants={flipCardVariants}
                  animate={
                    flippedCards[index] ? { rotateY: 180 } : { rotateY: 0 }
                  }
                >
                  {/* Front Side */}
                  <motion.div
                    className="flip-card-front absolute inset-0 md:w-full md:h-full bg-gradient-to-br from-deep-blue to-blue-900 text-white p-3 md:p-4 flex flex-col items-center justify-center"
                    variants={contentVariants}
                  >
                    <h3 className="text-base md:text-lg font-semibold uppercase leading-tight mb-2 md:mb-4 text-center">
                      {category.title}
                    </h3>
                    <div className="mt-1 md:mt-2 text-xs md:text-sm w-full px-1 md:px-2 space-y-2 md:space-y-3">
                      <div>
                        <p className="font-bold text-hope-gold text-xs md:text-sm">
                          Population Affected:
                        </p>
                        <p className="text-sm md:text-base">
                          {category.population}
                        </p>
                      </div>
                      <div>
                        <p className="font-bold text-hope-gold text-xs md:text-sm">
                          Key Finding:
                        </p>
                        <p className="text-sm md:text-base">
                          {category.keyFinding}
                        </p>
                      </div>
                    </div>
                    {/* Mobile instruction */}
                    {isMobile && (
                      <p className="text-xs text-hope-gold mt-2 italic">
                        Tap to see details
                      </p>
                    )}
                  </motion.div>

                  {/* Back Side */}
                  <motion.div
                    className="flip-card-back absolute inset-0 w-full h-full bg-gradient-to-br from-hope-gold to-yellow-600 text-deep-blue p-3 md:p-4 flex flex-col items-center justify-center"
                    variants={contentVariants}
                  >
                    <p className="text-xs md:text-sm font-semibold text-center mb-2 md:mb-4">
                      {category.description}
                    </p>
                    <motion.button
                      className="bg-deep-blue text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-300 text-sm md:text-base"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowDetails(index);
                      }}
                    >
                      Show More Details
                    </motion.button>
                    {/* Mobile instruction */}
                    {isMobile && (
                      <p className="text-xs text-deep-blue mt-2 italic">
                        Tap again to flip back
                      </p>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <style jsx>{`
          .flip-card {
            perspective: 1000px;
          }
          .flip-card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            text-align: center;
            transition: transform 0.6s;
            transform-style: preserve-3d;
          }
          .flip-card-front,
          .flip-card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            border-radius: 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            overflow: hidden;
          }
          .flip-card-back {
            transform: rotateY(180deg);
          }
        `}</style>
      </section>

      {/* Updated Modal with Optimized Layout */}
      <AnimatePresence>
        {isModalOpen && selectedCategory && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeModal}
          >
            <motion.div
              className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden border border-gray-200"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header - Compact */}
              <div className="bg-gradient-to-r from-deep-blue to-blue-800 text-white">
                <div className="flex justify-between items-center p-3 md:p-4 lg:p-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold font-montserrat mb-1 truncate">
                      {selectedCategory.title}
                    </h3>
                    <p className="text-blue-200 text-xs md:text-sm font-light truncate">
                      Comprehensive Analysis & Solutions
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-white hover:text-hope-gold transition-colors duration-200 text-xl md:text-2xl ml-2 flex-shrink-0"
                  >
                    ×
                  </button>
                </div>

                {/* Condition Tabs Navigation - Compact */}
                {selectedCategory.breakdown && (
                  <div className="relative px-2 md:px-4">
                    <button
                      onClick={() => scrollTabs("left")}
                      className="absolute left-0 top-0 bottom-0 flex items-center z-10 bg-gradient-to-r from-deep-blue to-transparent pr-4 md:pr-6 hover:bg-blue-700 transition-colors duration-200 rounded-l-lg"
                    >
                      <svg
                        className="w-3 h-3 md:w-4 md:h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={() => scrollTabs("right")}
                      className="absolute right-0 top-0 bottom-0 flex items-center z-10 bg-gradient-to-l from-deep-blue to-transparent pl-4 md:pl-6 hover:bg-blue-700 transition-colors duration-200 rounded-r-lg"
                    >
                      <svg
                        className="w-3 h-3 md:w-4 md:h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>

                    <div
                      ref={tabsRef}
                      className="flex overflow-x-auto scrollbar-hide px-6 md:px-8 py-1 md:py-2"
                    >
                      {selectedCategory.breakdown.conditions.map(
                        (condition, index) => (
                          <button
                            key={index}
                            className={`px-2 md:px-4 py-1 md:py-2 font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 mx-0.5 md:mx-1 rounded-lg text-xs md:text-sm ${
                              activeCondition === index
                                ? "bg-hope-gold text-deep-blue shadow-md md:shadow-lg transform scale-105"
                                : "text-blue-100 hover:text-white hover:bg-blue-700"
                            }`}
                            onClick={() => setActiveCondition(index)}
                          >
                            {condition.name.length > 20
                              ? `${condition.name.substring(0, 20)}...`
                              : condition.name}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Condition Content - Optimized Layout */}
              <div className="p-2 sm:p-3 md:p-4 lg:p-6 max-h-[60vh] overflow-y-auto">
                {selectedCategory.breakdown &&
                  selectedCategory.breakdown.conditions[activeCondition] && (
                    <div className="w-full">
                      <motion.div
                        key={activeCondition}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Condition Title */}
                        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-center text-deep-blue mb-3 md:mb-4 uppercase tracking-wide font-montserrat">
                          {
                            selectedCategory.breakdown.conditions[
                              activeCondition
                            ].name
                          }
                        </h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                          {/* Left Column */}
                          <div className="space-y-3 md:space-y-4">
                            {/* Medical Definition */}
                            <div className="bg-blue-50 rounded-lg md:rounded-xl p-2 md:p-3 border border-blue-100">
                              <h4 className="text-sm md:text-base font-bold text-deep-blue mb-2 uppercase tracking-wider text-xs md:text-sm flex items-center">
                                <span className="mr-1 md:mr-2">🩺</span>
                                Medical Definition
                              </h4>
                              <p className="text-gray-700 leading-relaxed text-xs md:text-sm">
                                {
                                  selectedCategory.breakdown.conditions[
                                    activeCondition
                                  ].medicalDefinition
                                }
                              </p>
                            </div>

                            {/* Trauma Connection */}
                            <div className="bg-purple-50 rounded-lg md:rounded-xl p-2 md:p-3 border border-purple-100">
                              <h4 className="text-sm md:text-base font-bold text-deep-blue mb-2 uppercase tracking-wider text-xs md:text-sm flex items-center">
                                <span className="mr-1 md:mr-2">💔</span>
                                Trauma Connection
                              </h4>
                              <p className="text-gray-700 leading-relaxed text-xs md:text-sm">
                                {
                                  selectedCategory.breakdown.conditions[
                                    activeCondition
                                  ].traumaConnection
                                }
                              </p>
                            </div>

                            {/* Prevalence */}
                            <div className="bg-green-50 rounded-lg md:rounded-xl p-2 md:p-3 border border-green-100">
                              <h4 className="text-sm md:text-base font-bold text-deep-blue mb-2 uppercase tracking-wider text-xs md:text-sm flex items-center">
                                <span className="mr-1 md:mr-2">📊</span>
                                Prevalence & Statistics
                              </h4>
                              <p className="text-gray-700 leading-relaxed text-xs md:text-sm">
                                {
                                  selectedCategory.breakdown.conditions[
                                    activeCondition
                                  ].prevalence
                                }
                              </p>
                            </div>
                          </div>

                          {/* Right Column */}
                          <div className="space-y-3 md:space-y-4">
                            {/* Symptoms */}
                            {selectedCategory.breakdown.conditions[
                              activeCondition
                            ].symptoms && (
                              <div className="bg-orange-50 rounded-lg md:rounded-xl p-2 md:p-3 border border-orange-100">
                                <h4 className="text-sm md:text-base font-bold text-deep-blue mb-2 uppercase tracking-wider text-xs md:text-sm flex items-center">
                                  <span className="mr-1 md:mr-2">🔍</span>
                                  Common Symptoms
                                </h4>
                                <ul className="text-gray-700 leading-relaxed text-xs md:text-sm space-y-1 md:space-y-2">
                                  {selectedCategory.breakdown.conditions[
                                    activeCondition
                                  ].symptoms.map((symptom, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
                                      <span className="text-orange-500 mr-1 md:mr-2 mt-0.5 md:mt-1">
                                        •
                                      </span>
                                      <span>{symptom}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Risk Factors */}
                            {selectedCategory.breakdown.conditions[
                              activeCondition
                            ].riskFactors && (
                              <div className="bg-red-50 rounded-lg md:rounded-xl p-2 md:p-3 border border-red-100">
                                <h4 className="text-sm md:text-base font-bold text-deep-blue mb-2 uppercase tracking-wider text-xs md:text-sm flex items-center">
                                  <span className="mr-1 md:mr-2">⚠️</span>
                                  Risk Factors
                                </h4>
                                <ul className="text-gray-700 leading-relaxed text-xs md:text-sm space-y-1 md:space-y-2">
                                  {selectedCategory.breakdown.conditions[
                                    activeCondition
                                  ].riskFactors.map((factor, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
                                      <span className="text-red-500 mr-1 md:mr-2 mt-0.5 md:mt-1">
                                        •
                                      </span>
                                      <span>{factor}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Treatment Limitations */}
                            <div className="bg-gray-50 rounded-lg md:rounded-xl p-2 md:p-3 border border-gray-200">
                              <h4 className="text-sm md:text-base font-bold text-deep-blue mb-2 uppercase tracking-wider text-xs md:text-sm flex items-center">
                                <span className="mr-1 md:mr-2">💊</span>
                                Current Treatment Limitations
                              </h4>
                              <p className="text-gray-700 leading-relaxed text-xs md:text-sm">
                                {
                                  selectedCategory.breakdown.conditions[
                                    activeCondition
                                  ].treatmentLimitations
                                }
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Solution Box - Compact */}
                        <motion.div
                          className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl shadow-md md:shadow-lg border border-blue-600 mt-3 md:mt-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <h4 className="text-base md:text-lg lg:text-xl font-bold text-hope-gold text-center mb-2 md:mb-3 font-montserrat">
                            {selectedCategory.breakdown.conditions[
                              activeCondition
                            ].solution?.title || "THE BECONCEPT SOLUTION"}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
                            <div>
                              <h5 className="font-semibold text-hope-gold mb-1 md:mb-2 text-xs md:text-sm uppercase">
                                Key Benefits:
                              </h5>
                              <ul className="space-y-1 md:space-y-2">
                                {selectedCategory.breakdown.conditions[
                                  activeCondition
                                ].solution?.points?.map((point, i) => (
                                  <motion.li
                                    key={i}
                                    className="flex items-start text-xs md:text-sm"
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + i * 0.05 }}
                                  >
                                    <span className="text-hope-gold mr-1 md:mr-2 mt-0.5 md:mt-1 flex-shrink-0">
                                      •
                                    </span>
                                    <span className="leading-relaxed">
                                      {point}
                                    </span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-semibold text-hope-gold mb-1 md:mb-2 text-xs md:text-sm uppercase">
                                Expected Outcomes:
                              </h5>
                              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
                                <li className="flex items-start">
                                  <span className="text-green-400 mr-1 md:mr-2 mt-0.5 md:mt-1">
                                    ✓
                                  </span>
                                  <span>Improved symptom management</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="text-green-400 mr-1 md:mr-2 mt-0.5 md:mt-1">
                                    ✓
                                  </span>
                                  <span>Enhanced quality of life</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="text-green-400 mr-1 md:mr-2 mt-0.5 md:mt-1">
                                    ✓
                                  </span>
                                  <span>Reduced treatment resistance</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="text-green-400 mr-1 md:mr-2 mt-0.5 md:mt-1">
                                    ✓
                                  </span>
                                  <span>Sustainable recovery outcomes</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </motion.div>

                        {/* Additional Data Sections - Only show if data exists */}
                        {(selectedCategory.breakdown.conditions[activeCondition]
                          .impactOnLife ||
                          selectedCategory.breakdown.conditions[activeCondition]
                            .comorbidConditions) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-3 md:mt-4">
                            {/* Impact on Daily Life */}
                            {selectedCategory.breakdown.conditions[
                              activeCondition
                            ].impactOnLife && (
                              <div className="bg-yellow-50 rounded-lg md:rounded-xl p-2 md:p-3 border border-yellow-100">
                                <h4 className="text-sm md:text-base font-bold text-deep-blue mb-2 uppercase tracking-wider text-xs md:text-sm flex items-center">
                                  <span className="mr-1 md:mr-2">🌍</span>
                                  Impact on Daily Life
                                </h4>
                                <p className="text-gray-700 leading-relaxed text-xs md:text-sm">
                                  {
                                    selectedCategory.breakdown.conditions[
                                      activeCondition
                                    ].impactOnLife
                                  }
                                </p>
                              </div>
                            )}

                            {/* Comorbid Conditions */}
                            {selectedCategory.breakdown.conditions[
                              activeCondition
                            ].comorbidConditions && (
                              <div className="bg-indigo-50 rounded-lg md:rounded-xl p-2 md:p-3 border border-indigo-100">
                                <h4 className="text-sm md:text-base font-bold text-deep-blue mb-2 uppercase tracking-wider text-xs md:text-sm flex items-center">
                                  <span className="mr-1 md:mr-2">🔄</span>
                                  Common Comorbid Conditions
                                </h4>
                                <ul className="text-gray-700 leading-relaxed text-xs md:text-sm space-y-1 md:space-y-2">
                                  {selectedCategory.breakdown.conditions[
                                    activeCondition
                                  ].comorbidConditions.map(
                                    (condition, index) => (
                                      <li
                                        key={index}
                                        className="flex items-start"
                                      >
                                        <span className="text-indigo-500 mr-1 md:mr-2 mt-0.5 md:mt-1">
                                          •
                                        </span>
                                        <span>{condition}</span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    </div>
                  )}
              </div>

              {/* Modal Footer - Compact */}
              <div className="bg-gray-50 px-2 sm:px-3 md:px-4 lg:px-6 py-2 md:py-3 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                  <div className="text-xs text-gray-500 font-medium">
                    {selectedCategory.breakdown && (
                      <>
                        Condition {activeCondition + 1} of{" "}
                        {selectedCategory.breakdown.conditions.length}
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 md:gap-2 justify-center sm:justify-end">
                    <button
                      onClick={() =>
                        setActiveCondition((prev) =>
                          prev === 0
                            ? selectedCategory.breakdown.conditions.length - 1
                            : prev - 1
                        )
                      }
                      className="bg-gray-200 text-gray-700 px-2 md:px-3 py-1 md:py-1.5 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300 text-xs md:text-sm flex items-center"
                    >
                      <svg
                        className="w-3 h-3 md:w-4 md:h-4 mr-0.5 md:mr-1"
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
                      Prev
                    </button>
                    <button
                      onClick={() =>
                        setActiveCondition((prev) =>
                          prev ===
                          selectedCategory.breakdown.conditions.length - 1
                            ? 0
                            : prev + 1
                        )
                      }
                      className="bg-gray-200 text-gray-700 px-2 md:px-3 py-1 md:py-1.5 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300 text-xs md:text-sm flex items-center"
                    >
                      Next
                      <svg
                        className="w-3 h-3 md:w-4 md:h-4 ml-0.5 md:ml-1"
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
                    <button
                      onClick={closeModal}
                      className="bg-deep-blue text-white px-3 md:px-4 py-1 md:py-1.5 rounded-lg font-medium hover:bg-blue-800 transition-all duration-300 text-xs md:text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default SufferingSection;

// import React, { useState, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import sufferingData from "../../constant/Home/sufferingData.json";
// import sufferingBreakdownData from "../../constant/Home/sufferingBreakdownData.json";

// const SufferingSection = () => {
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeCondition, setActiveCondition] = useState(0);
//   const tabsRef = useRef(null);

//   const handleShowDetails = (categoryIndex) => {
//     const category = sufferingData.categories[categoryIndex];

//     const breakdownCategory =
//       sufferingBreakdownData.categories.find(
//         (cat) => cat.title.toLowerCase() === category.title.toLowerCase()
//       ) ||
//       sufferingBreakdownData.categories[categoryIndex] ||
//       sufferingBreakdownData.categories[0];

//     setSelectedCategory({
//       ...category,
//       breakdown: breakdownCategory,
//     });
//     setActiveCondition(0);
//     setIsModalOpen(true);
//   };

//   const scrollTabs = (direction) => {
//     if (tabsRef.current) {
//       const scrollAmount = 200;
//       if (direction === "left") {
//         tabsRef.current.scrollLeft -= scrollAmount;
//       } else {
//         tabsRef.current.scrollLeft += scrollAmount;
//       }
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedCategory(null);
//     setActiveCondition(0);
//   };

//   // Rest of your existing animation variants...
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         duration: 0.8,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 50, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         duration: 0.6,
//         ease: "easeOut",
//       },
//     },
//   };

//   const flipCardVariants = {
//     hover: {
//       rotateY: 180,
//       transition: {
//         duration: 0.6,
//         ease: "easeInOut",
//       },
//     },
//   };

//   const contentVariants = {
//     front: {
//       rotateY: 0,
//     },
//     back: {
//       rotateY: 180,
//     },
//   };

//   const modalVariants = {
//     hidden: {
//       opacity: 0,
//       scale: 0.8,
//       y: 50,
//     },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       y: 0,
//       transition: {
//         duration: 0.4,
//         ease: "easeOut",
//       },
//     },
//     exit: {
//       opacity: 0,
//       scale: 0.8,
//       y: 50,
//       transition: {
//         duration: 0.3,
//       },
//     },
//   };

//   const overlayVariants = {
//     hidden: {
//       opacity: 0,
//     },
//     visible: {
//       opacity: 1,
//       transition: {
//         duration: 0.3,
//       },
//     },
//     exit: {
//       opacity: 0,
//       transition: {
//         duration: 0.2,
//       },
//     },
//   };

//   return (
//     <>
//       <section id="suffering" className="py-20 bg-white">
//         <div className="container mx-auto text-center px-4">
//           <motion.h2
//             className="text-3xl md:text-4xl font-semibold font-montserrat text-deep-blue mb-12"
//             initial={{ opacity: 0, y: 50 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//           >
//             We See You Struggling
//           </motion.h2>

//           <motion.div
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
//             variants={containerVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-50px" }}
//           >
//             {sufferingData.categories.map((category, index) => (
//               <motion.div
//                 key={index}
//                 className="flip-card h-64 cursor-pointer"
//                 variants={itemVariants}
//                 whileHover="hover"
//               >
//                 <motion.div
//                   className="flip-card-inner rounded-lg shadow-xl w-full h-full"
//                   variants={flipCardVariants}
//                 >
//                   {/* Front Side */}
//                   <motion.div
//                     className="flip-card-front absolute inset-0 w-full h-full bg-gradient-to-br from-deep-blue to-blue-900 text-white p-4 flex flex-col items-center justify-center"
//                     variants={contentVariants}
//                   >
//                     <h3 className="text-lg font-semibold uppercase leading-tight mb-4">
//                       {category.title}
//                     </h3>
//                     <div className="mt-2 text-sm w-full px-2 space-y-3">
//                       <div>
//                         <p className="font-bold text-hope-gold">
//                           Population Affected:
//                         </p>
//                         <p>{category.population}</p>
//                       </div>
//                       <div>
//                         <p className="font-bold text-hope-gold">Key Finding:</p>
//                         <p>{category.keyFinding}</p>
//                       </div>
//                     </div>
//                   </motion.div>

//                   {/* Back Side */}
//                   <motion.div
//                     className="flip-card-back absolute inset-0 w-full h-full bg-gradient-to-br from-hope-gold to-yellow-600 text-deep-blue p-4 flex flex-col items-center justify-center"
//                     variants={contentVariants}
//                   >
//                     <p className="text-sm font-semibold text-center mb-4">
//                       {category.description}
//                     </p>
//                     <motion.button
//                       className="bg-deep-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-300"
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleShowDetails(index);
//                       }}
//                     >
//                       Show More Details
//                     </motion.button>
//                   </motion.div>
//                 </motion.div>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>

//         <style jsx>{`
//           .flip-card {
//             perspective: 1000px;
//           }
//           .flip-card-inner {
//             position: relative;
//             width: 100%;
//             height: 100%;
//             text-align: center;
//             transition: transform 0.6s;
//             transform-style: preserve-3d;
//           }
//           .flip-card-front,
//           .flip-card-back {
//             position: absolute;
//             width: 100%;
//             height: 100%;
//             -webkit-backface-visibility: hidden;
//             backface-visibility: hidden;
//             border-radius: 0.5rem;
//             display: flex;
//             flex-direction: column;
//             justify-content: center;
//             align-items: center;
//           }
//           .flip-card-back {
//             transform: rotateY(180deg);
//           }
//         `}</style>
//       </section>

//       {/* Updated Modal with All Information */}
//       <AnimatePresence>
//         {isModalOpen && selectedCategory && (
//           <motion.div
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-60"
//             variants={overlayVariants}
//             initial="hidden"
//             animate="visible"
//             exit="exit"
//             onClick={closeModal}
//           >
//             <motion.div
//               className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-gray-200"
//               variants={modalVariants}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Modal Header */}
//               <div className="bg-gradient-to-r from-deep-blue to-blue-800 text-white relative">
//                 <div className="flex justify-between items-center p-6">
//                   <div>
//                     <h3 className="text-2xl font-bold font-montserrat mb-2">
//                       {selectedCategory.title}
//                     </h3>
//                     <p className="text-blue-200 text-sm font-light">
//                       Comprehensive Analysis & Solutions
//                     </p>
//                   </div>
//                   <button
//                     onClick={closeModal}
//                     className="text-white transition-colors duration-200 text-2xl bg-opacity-10 rounded-full w-8 h-8 flex items-center justify-center"
//                   >
//                     ×
//                   </button>
//                 </div>

//                 {/* Category Overview */}
//                 {/* <div className="px-6 pb-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                     <div className="bg-blue-700 bg-opacity-50 rounded-lg p-3">
//                       <p className="font-semibold text-hope-gold">
//                         Population Affected:
//                       </p>
//                       <p className="text-white">
//                         {selectedCategory.population}
//                       </p>
//                     </div>
//                     <div className="bg-blue-700 bg-opacity-50 rounded-lg p-3">
//                       <p className="font-semibold text-hope-gold">
//                         Key Finding:
//                       </p>
//                       <p className="text-white">
//                         {selectedCategory.keyFinding}
//                       </p>
//                     </div>
//                   </div>
//                 </div> */}

//                 {/* Condition Tabs Navigation */}
//                 {selectedCategory.breakdown && (
//                   <div className="relative px-4">
//                     <button
//                       onClick={() => scrollTabs("left")}
//                       className="absolute left-0 top-0 bottom-0 flex items-center z-10 bg-gradient-to-r from-deep-blue to-transparent pr-6 hover:bg-blue-700 transition-colors duration-200 rounded-l-lg"
//                     >
//                       <svg
//                         className="w-4 h-4 text-white"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={3}
//                           d="M15 19l-7-7 7-7"
//                         />
//                       </svg>
//                     </button>

//                     <button
//                       onClick={() => scrollTabs("right")}
//                       className="absolute right-0 top-0 bottom-0 flex items-center z-10 bg-gradient-to-l from-deep-blue to-transparent pl-6 hover:bg-blue-700 transition-colors duration-200 rounded-r-lg"
//                     >
//                       <svg
//                         className="w-4 h-4 text-white"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={3}
//                           d="M9 5l7 7-7 7"
//                         />
//                       </svg>
//                     </button>

//                     <div
//                       ref={tabsRef}
//                       className="flex overflow-x-auto scrollbar-hide px-8 py-2"
//                     >
//                       {selectedCategory.breakdown.conditions.map(
//                         (condition, index) => (
//                           <button
//                             key={index}
//                             className={`px-4 py-2 font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 mx-1 rounded-lg text-sm ${
//                               activeCondition === index
//                                 ? "bg-hope-gold text-deep-blue shadow-lg transform scale-105"
//                                 : "text-blue-100 hover:text-white hover:bg-blue-700"
//                             }`}
//                             onClick={() => setActiveCondition(index)}
//                           >
//                             {condition.name}
//                           </button>
//                         )
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Condition Content */}
//               <div className="p-6 max-h-[60vh] overflow-y-auto">
//                 {selectedCategory.breakdown &&
//                   selectedCategory.breakdown.conditions[activeCondition] && (
//                     <div className="max-w-5xl mx-auto">
//                       <motion.div
//                         key={activeCondition}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.4 }}
//                       >
//                         {/* Condition Title */}
//                         <h3 className="text-2xl font-bold text-center text-deep-blue mb-6 uppercase tracking-wide font-montserrat">
//                           {
//                             selectedCategory.breakdown.conditions[
//                               activeCondition
//                             ].name
//                           }
//                         </h3>

//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                           {/* Left Column */}
//                           <div className="space-y-6">
//                             {/* Medical Definition */}
//                             <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
//                               <h4 className="text-base font-bold text-deep-blue mb-3 uppercase tracking-wider text-sm flex items-center">
//                                 <span className="mr-2">🩺</span>
//                                 Medical Definition
//                               </h4>
//                               <p className="text-gray-700 leading-relaxed text-sm">
//                                 {
//                                   selectedCategory.breakdown.conditions[
//                                     activeCondition
//                                   ].medicalDefinition
//                                 }
//                               </p>
//                             </div>

//                             {/* Trauma Connection */}
//                             <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
//                               <h4 className="text-base font-bold text-deep-blue mb-3 uppercase tracking-wider text-sm flex items-center">
//                                 <span className="mr-2">💔</span>
//                                 Trauma Connection
//                               </h4>
//                               <p className="text-gray-700 leading-relaxed text-sm">
//                                 {
//                                   selectedCategory.breakdown.conditions[
//                                     activeCondition
//                                   ].traumaConnection
//                                 }
//                               </p>
//                             </div>

//                             {/* Prevalence */}
//                             <div className="bg-green-50 rounded-xl p-4 border border-green-100">
//                               <h4 className="text-base font-bold text-deep-blue mb-3 uppercase tracking-wider text-sm flex items-center">
//                                 <span className="mr-2">📊</span>
//                                 Prevalence & Statistics
//                               </h4>
//                               <p className="text-gray-700 leading-relaxed text-sm">
//                                 {
//                                   selectedCategory.breakdown.conditions[
//                                     activeCondition
//                                   ].prevalence
//                                 }
//                               </p>
//                             </div>
//                           </div>

//                           {/* Right Column */}
//                           <div className="space-y-6">
//                             {/* Symptoms */}
//                             {selectedCategory.breakdown.conditions[
//                               activeCondition
//                             ].symptoms && (
//                               <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
//                                 <h4 className="text-base font-bold text-deep-blue mb-3 uppercase tracking-wider text-sm flex items-center">
//                                   <span className="mr-2">🔍</span>
//                                   Common Symptoms
//                                 </h4>
//                                 <ul className="text-gray-700 leading-relaxed text-sm space-y-2">
//                                   {selectedCategory.breakdown.conditions[
//                                     activeCondition
//                                   ].symptoms.map((symptom, index) => (
//                                     <li
//                                       key={index}
//                                       className="flex items-start"
//                                     >
//                                       <span className="text-orange-500 mr-2 mt-1">
//                                         •
//                                       </span>
//                                       <span>{symptom}</span>
//                                     </li>
//                                   ))}
//                                 </ul>
//                               </div>
//                             )}

//                             {/* Risk Factors */}
//                             {selectedCategory.breakdown.conditions[
//                               activeCondition
//                             ].riskFactors && (
//                               <div className="bg-red-50 rounded-xl p-4 border border-red-100">
//                                 <h4 className="text-base font-bold text-deep-blue mb-3 uppercase tracking-wider text-sm flex items-center">
//                                   <span className="mr-2">⚠️</span>
//                                   Risk Factors
//                                 </h4>
//                                 <ul className="text-gray-700 leading-relaxed text-sm space-y-2">
//                                   {selectedCategory.breakdown.conditions[
//                                     activeCondition
//                                   ].riskFactors.map((factor, index) => (
//                                     <li
//                                       key={index}
//                                       className="flex items-start"
//                                     >
//                                       <span className="text-red-500 mr-2 mt-1">
//                                         •
//                                       </span>
//                                       <span>{factor}</span>
//                                     </li>
//                                   ))}
//                                 </ul>
//                               </div>
//                             )}

//                             {/* Treatment Limitations */}
//                             <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//                               <h4 className="text-base font-bold text-deep-blue mb-3 uppercase tracking-wider text-sm flex items-center">
//                                 <span className="mr-2">💊</span>
//                                 Current Treatment Limitations
//                               </h4>
//                               <p className="text-gray-700 leading-relaxed text-sm">
//                                 {
//                                   selectedCategory.breakdown.conditions[
//                                     activeCondition
//                                   ].treatmentLimitations
//                                 }
//                               </p>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Solution Box - Full Width */}
//                         <motion.div
//                           className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 rounded-xl shadow-lg border border-blue-600 mt-6"
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: 0.2 }}
//                         >
//                           <h4 className="text-xl font-bold text-hope-gold text-center mb-4 font-montserrat">
//                             {selectedCategory.breakdown.conditions[
//                               activeCondition
//                             ].solution?.title || "THE BECONCEPT SOLUTION"}
//                           </h4>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <h5 className="font-semibold text-hope-gold mb-3 text-sm uppercase">
//                                 Key Benefits:
//                               </h5>
//                               <ul className="space-y-2">
//                                 {selectedCategory.breakdown.conditions[
//                                   activeCondition
//                                 ].solution?.points?.map((point, i) => (
//                                   <motion.li
//                                     key={i}
//                                     className="flex items-start text-sm"
//                                     initial={{ opacity: 0, x: -10 }}
//                                     animate={{ opacity: 1, x: 0 }}
//                                     transition={{ delay: 0.3 + i * 0.1 }}
//                                   >
//                                     <span className="text-hope-gold mr-3 mt-1 flex-shrink-0 text-lg">
//                                       •
//                                     </span>
//                                     <span className="leading-relaxed">
//                                       {point}
//                                     </span>
//                                   </motion.li>
//                                 ))}
//                               </ul>
//                             </div>
//                             <div>
//                               <h5 className="font-semibold text-hope-gold mb-3 text-sm uppercase">
//                                 Expected Outcomes:
//                               </h5>
//                               <ul className="space-y-2 text-sm">
//                                 <li className="flex items-start">
//                                   <span className="text-green-400 mr-2 mt-1">
//                                     ✓
//                                   </span>
//                                   <span>Improved symptom management</span>
//                                 </li>
//                                 <li className="flex items-start">
//                                   <span className="text-green-400 mr-2 mt-1">
//                                     ✓
//                                   </span>
//                                   <span>Enhanced quality of life</span>
//                                 </li>
//                                 <li className="flex items-start">
//                                   <span className="text-green-400 mr-2 mt-1">
//                                     ✓
//                                   </span>
//                                   <span>Reduced treatment resistance</span>
//                                 </li>
//                                 <li className="flex items-start">
//                                   <span className="text-green-400 mr-2 mt-1">
//                                     ✓
//                                   </span>
//                                   <span>Sustainable recovery outcomes</span>
//                                 </li>
//                               </ul>
//                             </div>
//                           </div>
//                         </motion.div>

//                         {/* Additional Data Sections */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//                           {/* Impact on Daily Life */}
//                           {selectedCategory.breakdown.conditions[
//                             activeCondition
//                           ].impactOnLife && (
//                             <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
//                               <h4 className="text-base font-bold text-deep-blue mb-3 uppercase tracking-wider text-sm flex items-center">
//                                 <span className="mr-2">🌍</span>
//                                 Impact on Daily Life
//                               </h4>
//                               <p className="text-gray-700 leading-relaxed text-sm">
//                                 {
//                                   selectedCategory.breakdown.conditions[
//                                     activeCondition
//                                   ].impactOnLife
//                                 }
//                               </p>
//                             </div>
//                           )}

//                           {/* Comorbid Conditions */}
//                           {selectedCategory.breakdown.conditions[
//                             activeCondition
//                           ].comorbidConditions && (
//                             <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
//                               <h4 className="text-base font-bold text-deep-blue mb-3 uppercase tracking-wider text-sm flex items-center">
//                                 <span className="mr-2">🔄</span>
//                                 Common Comorbid Conditions
//                               </h4>
//                               <ul className="text-gray-700 leading-relaxed text-sm space-y-2">
//                                 {selectedCategory.breakdown.conditions[
//                                   activeCondition
//                                 ].comorbidConditions.map((condition, index) => (
//                                   <li key={index} className="flex items-start">
//                                     <span className="text-indigo-500 mr-2 mt-1">
//                                       •
//                                     </span>
//                                     <span>{condition}</span>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                           )}
//                         </div>
//                       </motion.div>
//                     </div>
//                   )}
//               </div>

//               {/* Modal Footer */}
//               <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
//                 <div className="flex justify-between items-center">
//                   <div className="text-xs text-gray-500 font-medium">
//                     {selectedCategory.breakdown && (
//                       <>
//                         Condition {activeCondition + 1} of{" "}
//                         {selectedCategory.breakdown.conditions.length}
//                         {selectedCategory.breakdown.conditions[activeCondition]
//                           .resources && (
//                           <span className="ml-4">
//                             📚 Resources Available:{" "}
//                             {
//                               selectedCategory.breakdown.conditions[
//                                 activeCondition
//                               ].resources.length
//                             }
//                           </span>
//                         )}
//                       </>
//                     )}
//                   </div>
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() =>
//                         setActiveCondition((prev) =>
//                           prev === 0
//                             ? selectedCategory.breakdown.conditions.length - 1
//                             : prev - 1
//                         )
//                       }
//                       className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300 text-sm flex items-center"
//                     >
//                       <svg
//                         className="w-4 h-4 mr-1"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M15 19l-7-7 7-7"
//                         />
//                       </svg>
//                       Previous
//                     </button>
//                     <button
//                       onClick={() =>
//                         setActiveCondition((prev) =>
//                           prev ===
//                           selectedCategory.breakdown.conditions.length - 1
//                             ? 0
//                             : prev + 1
//                         )
//                       }
//                       className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300 text-sm flex items-center"
//                     >
//                       Next
//                       <svg
//                         className="w-4 h-4 ml-1"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M9 5l7 7-7 7"
//                         />
//                       </svg>
//                     </button>
//                     <button
//                       onClick={closeModal}
//                       className="bg-deep-blue text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition-all duration-300 text-sm"
//                     >
//                       Close
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <style jsx>{`
//         .scrollbar-hide {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }
//       `}</style>
//     </>
//   );
// };

// export default SufferingSection;
