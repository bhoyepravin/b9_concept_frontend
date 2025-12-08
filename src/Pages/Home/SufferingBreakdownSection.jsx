import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import breakdownData from "../../constant/Home/sufferingBreakdownData.json";

const SufferingBreakdownSection = () => {
  const [activeCategory, setActiveCategory] = useState("category-1");
  const [conditions, setConditions] = useState([]);

  // Initialize conditions when component mounts
  useEffect(() => {
    const initialCategory = breakdownData.categories.find(
      (cat) => cat.id === "category-1"
    );
    setConditions(initialCategory?.conditions || []);
  }, []);

  // Handle category filter click
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    const category = breakdownData.categories.find(
      (cat) => cat.id === categoryId
    );
    setConditions(category?.conditions || []);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
      },
    },
  };

  const conditionVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="suffering-breakdown" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-semibold font-montserrat text-deep-blue text-center mb-12">
          A Definitive Solution For...
        </h2>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {breakdownData.categories.map((category) => (
            <button
              key={category.id}
              className={`category-filter font-semibold px-4 py-2 rounded-full text-sm md:text-base ${
                activeCategory === category.id
                  ? "bg-hope-gold text-deep-blue"
                  : "bg-gray-200 text-dark-gray"
              }`}
              data-target={category.id}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.title}
            </button>
          ))}
        </div>

        <motion.div
          id="conditions-container"
          className="horizontal-scroll-container flex overflow-x-auto space-x-8 pb-4 bg-gray-200 p-4 rounded-lg min-h-48"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {conditions.map((condition, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg min-w-80 flex-shrink-0"
              variants={conditionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="text-lg font-semibold text-deep-blue mb-2">
                {condition.name}
              </h4>
              <p className="text-dark-gray text-sm">{condition.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SufferingBreakdownSection;
