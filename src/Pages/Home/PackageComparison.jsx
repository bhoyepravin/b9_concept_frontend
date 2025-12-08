import React from "react";
import { motion } from "framer-motion";
import packageComparisonData from "../../constant/Home/packageComparisonData.json";

const PackageComparison = () => {
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
    hidden: { opacity: 0, y: -30 },
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

  const headerCellVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className={packageComparisonData.section.containerClasses}
    >
      {/* Title */}
      <motion.h3
        variants={titleVariants}
        className={packageComparisonData.section.titleClasses}
      >
        {packageComparisonData.section.title}
      </motion.h3>

      {/* Table Container */}
      <motion.div variants={tableVariants}>
        <motion.table className={packageComparisonData.table.classes}>
          {/* Table Header */}
          <motion.thead>
            <motion.tr
              variants={rowVariants}
              className={packageComparisonData.table.header.rowClasses}
            >
              {packageComparisonData.table.header.columns.map(
                (column, index) => (
                  <motion.th
                    key={index}
                    variants={headerCellVariants}
                    whileHover="hover"
                    className={column.classes}
                  >
                    {column.label}
                  </motion.th>
                )
              )}
            </motion.tr>
          </motion.thead>

          {/* Table Body */}
          <motion.tbody className="divide-y divide-gray-200">
            {packageComparisonData.table.rows.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                custom={rowIndex}
                variants={rowVariants}
                className={row.rowClass}
                whileHover={{
                  backgroundColor: "rgba(247, 250, 252, 0.8)",
                  transition: { duration: 0.2 },
                }}
              >
                {/* Feature Column */}
                <motion.td
                  variants={cellVariants}
                  className="p-4 font-semibold text-dark-gray"
                >
                  {row.feature}
                </motion.td>

                {/* Cognitive Package */}
                <motion.td
                  variants={cellVariants}
                  whileHover="hover"
                  className="p-4 text-center text-medium-gray"
                >
                  {row.packages[0]}
                </motion.td>

                {/* Complete Package */}
                <motion.td
                  variants={cellVariants}
                  whileHover="hover"
                  className="p-4 text-center text-medium-gray"
                >
                  {row.packages[1]}
                </motion.td>

                {/* Executive Package */}
                <motion.td
                  variants={cellVariants}
                  whileHover="hover"
                  className="p-4 text-center text-medium-gray"
                >
                  {row.packages[2]}
                </motion.td>
              </motion.tr>
            ))}
          </motion.tbody>
        </motion.table>
      </motion.div>
    </motion.div>
  );
};

export default PackageComparison;
