import React, { useState } from "react";
import { motion } from "framer-motion";
import formData from "../../constant/Home/formData.json";

const ContactSection = () => {
  const [contactFormState, setContactFormState] = useState({});

  const handleContactInputChange = (fieldId, value) => {
    setContactFormState((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", contactFormState);
    // Handle contact form submission logic here
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-semibold font-montserrat text-gray-800">
            Let's Connect: Your First Step to Freedom
          </h2>
          <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
            Take the first step by providing your details below, or use our
            comprehensive assessment form to begin your transformation journey
            immediately.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            variants={itemVariants}
            className="bg-white p-8 rounded-lg shadow-md"
          >
            <h3 className="text-2xl font-semibold text-blue-800 mb-6">
              Contact Information
            </h3>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Address:</strong>
                <br />
                {formData.contactInfo.address}
              </p>
              <p>
                <strong>Phone:</strong>
                <br />
                <a
                  href={`tel:${formData.contactInfo.phone}`}
                  className="text-green-600 hover:underline"
                >
                  {formData.contactInfo.phone}
                </a>
              </p>
              <p>
                <strong>Email:</strong>
                <br />
                <a
                  href={`mailto:${formData.contactInfo.email}`}
                  className="text-green-600 hover:underline"
                >
                  {formData.contactInfo.email}
                </a>
              </p>
              <p>
                <strong>Hours:</strong>
                <br />
                {formData.contactInfo.hours}
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <form className="space-y-6" onSubmit={handleContactSubmit}>
              <div>
                <label
                  htmlFor="contact-name"
                  className="block mb-2 font-semibold"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="contact-name"
                  className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
                  onChange={(e) =>
                    handleContactInputChange("contact-name", e.target.value)
                  }
                  value={contactFormState["contact-name"] || ""}
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="block mb-2 font-semibold"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="contact-email"
                  className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
                  onChange={(e) =>
                    handleContactInputChange("contact-email", e.target.value)
                  }
                  value={contactFormState["contact-email"] || ""}
                />
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="block mb-2 font-semibold"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows="5"
                  className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
                  onChange={(e) =>
                    handleContactInputChange("contact-message", e.target.value)
                  }
                  value={contactFormState["contact-message"] || ""}
                ></textarea>
              </div>
              <div className="text-right">
                <motion.button
                  type="submit"
                  className="bg-gray-600 text-white font-montserrat font-semibold uppercase px-8 py-3 rounded-full hover:bg-opacity-90 transition-transform hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Send Message
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
