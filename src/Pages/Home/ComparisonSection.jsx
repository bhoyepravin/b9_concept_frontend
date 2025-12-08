import React, { useState } from "react";
import { motion } from "framer-motion";
import comparisonData from "../../constant/Home/comparisonData.json";

const ComparisonSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const tableVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (custom) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        delay: custom * 0.1,
        ease: "easeOut",
      },
    }),
  };

  const cellVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    hover: {
      scale: 1.02,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <section
      className={comparisonData.section.classes}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="container mx-auto px-4"
      >
        {/* Title */}
        <motion.h2
          variants={titleVariants}
          className="text-3xl md:text-4xl font-semibold font-montserrat text-deep-blue text-center mb-12"
        >
          {comparisonData.section.title}
        </motion.h2>

        {/* Table Container - Dynamic overflow based on hover state */}
        <motion.div
          variants={tableVariants}
          className={`max-w-4xl mx-auto ${
            isHovered ? "overflow-x-visible" : "overflow-x-auto"
          } md:overflow-x-visible`}
        >
          <motion.table className="w-full text-left border-collapse min-w-full">
            {/* Table Header */}
            <motion.thead>
              <motion.tr variants={rowVariants}>
                {comparisonData.table.headers.map((header, index) => (
                  <motion.th
                    key={index}
                    variants={cellVariants}
                    className={header.classes}
                  >
                    {header.textClasses ? (
                      <h3 className={header.textClasses}>{header.label}</h3>
                    ) : (
                      header.label
                    )}
                  </motion.th>
                ))}
              </motion.tr>
            </motion.thead>

            {/* Table Body */}
            <motion.tbody variants={containerVariants} className="bg-white">
              {comparisonData.table.rows.map((row, index) => (
                <motion.tr
                  key={index}
                  custom={index}
                  variants={rowVariants}
                  whileHover="hover"
                >
                  {/* Category Cell */}
                  <motion.td
                    variants={cellVariants}
                    className="p-4 border-b font-bold"
                  >
                    {row.category}
                  </motion.td>

                  {/* Traditional Approach Cell */}
                  <motion.td
                    variants={cellVariants}
                    className="p-4 border-b text-center"
                  >
                    {row.traditional}
                  </motion.td>

                  {/* B9Concept Cell */}
                  <motion.td
                    variants={cellVariants}
                    className={`p-4 border-b text-center ${
                      row.b9conceptClasses || ""
                    }`}
                  >
                    {row.b9concept}
                  </motion.td>
                </motion.tr>
              ))}
            </motion.tbody>
          </motion.table>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ComparisonSection;
