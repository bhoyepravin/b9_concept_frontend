import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logo } from "../../assets";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  // Handle scroll effect for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking on a link
  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: "#home", label: "HOME" },
    { href: "#suffering", label: "YOUR SUFFERING" },
    { href: "#solution", label: "THE SOLUTION" },
    { href: "#stories", label: "SUCCESS STORIES" },
    { href: "#about", label: "ABOUT" },
    { href: "#packages", label: "PACKAGES" },
  ];

  // Animation variants
  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.5,
      },
    },
  };

  const logoVariants = {
    hover: {
      scale: 1.05,
      rotateY: 10,
      transition: { type: "spring", stiffness: 300 },
    },
    tap: { scale: 0.95 },
  };

  const navLinkVariants = {
    hover: {
      scale: 1.1,
      color: "#D4AF37",
      y: -2,
      transition: { type: "spring", stiffness: 400 },
    },
    tap: { scale: 0.95 },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(212, 175, 55, 0.3)",
      transition: { type: "spring", stiffness: 400 },
    },
    tap: { scale: 0.95 },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const mobileLinkVariants = {
    closed: { x: -50, opacity: 0 },
    open: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  const hamburgerVariants = {
    open: { rotate: 90 },
    closed: { rotate: 0 },
  };

  return (
    <motion.header
      id="header"
      className={`fixed w-full top-0 z-50 transition-shadow duration-300 ${
        isScrolled
          ? "shadow-lg bg-deep-blue/95 backdrop-blur-sm"
          : "shadow-none bg-deep-blue"
      }`}
      initial="hidden"
      animate="visible"
      variants={headerVariants}
    >
      <div className="text-white">
        <div className="container mx-auto flex justify-between items-center p-2">
          {/* Logo and Brand */}
          <motion.a
            href="#home"
            className="flex items-center"
            onClick={handleNavClick}
            variants={logoVariants}
            //whileHover="hover"
            //whileTap="tap"
          >
            <motion.img
              src={logo}
              alt="B9Concept Logo"
              className="h-16 md:h-28 w-auto"
              //whileHover={{ rotate: [0, -5, 0] }}
              //transition={{ duration: 0.5 }}
            />
            {/* Added margin-left for gap between logo and name */}
            <div className="flex flex-col ml-2 md:ml-4 lg:ml-6">
              {" "}
              {/* Changed from -ml-4 md:-ml-8 */}
              <motion.span
                className="text-2xl md:text-2xl mr-6 font-bold font-montserrat"
                whileHover={{ textShadow: "0 0 10px rgba(212, 175, 55, 0.5)" }}
              >
                B9CONCEPT
              </motion.span>
              <motion.span
                className="text-xs md:text-sm font-light tracking-wider text-hope-gold -mt-1"
                whileHover={{ scale: 1.05 }}
              >
                <span className="hidden lg:inline text-xs ">
                  A Revolution in Natural, Scientific Restoration
                </span>
                <span className="md:hidden">
                  A Revolution in Natural, <br />
                  Scientific Restoration
                </span>
              </motion.span>
            </div>
          </motion.a>

          {/* Desktop Navigation - All in one line */}
          <nav className="hidden lg:flex items-center space-x-2 xl:space-x-10">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                className="relative"
                onHoverStart={() => setHoveredLink(index)}
                onHoverEnd={() => setHoveredLink(null)}
              >
                <motion.a
                  href={link.href}
                  className="nav-link hover:text-hope-gold transition duration-300 pb-1 relative z-10 text-sm xl:text-base whitespace-nowrap"
                  variants={navLinkVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {link.label}
                </motion.a>
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-hope-gold"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hoveredLink === index ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
            <motion.a
              href="#booking"
              className="bg-hope-gold text-deep-blue font-montserrat font-semibold uppercase px-4 xl:px-6 py-2 rounded-full hover:bg-opacity-90 whitespace-nowrap text-sm xl:text-base ml-2"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              initial="initial"
            >
              Book Now
            </motion.a>
          </nav>

          {/* Tablet Navigation - Compact version */}
          <nav className="hidden md:flex lg:hidden items-center space-x-2">
            {navLinks.slice(0, 4).map((link, index) => (
              <motion.div
                key={link.href}
                className="relative"
                onHoverStart={() => setHoveredLink(index)}
                onHoverEnd={() => setHoveredLink(null)}
              >
                <motion.a
                  href={link.href}
                  className="nav-link hover:text-hope-gold transition duration-300 pb-1 relative z-10 text-xs whitespace-nowrap"
                  variants={navLinkVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {link.label.split(" ")[0]}
                </motion.a>
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-hope-gold"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hoveredLink === index ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
            <motion.a
              href="#booking"
              className="bg-hope-gold text-deep-blue font-montserrat font-semibold uppercase px-3 py-2 rounded-full hover:bg-opacity-90 whitespace-nowrap text-xs ml-1"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Book
            </motion.a>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            id="mobile-menu-button"
            className="md:hidden focus:outline-none p-3 relative z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            variants={hamburgerVariants}
            animate={isMobileMenuOpen ? "open" : "closed"}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="w-6 h-6 flex flex-col justify-between"
              animate={isMobileMenuOpen ? "open" : "closed"}
            >
              <motion.span
                className="w-full h-0.5 bg-white block"
                animate={{
                  rotate: isMobileMenuOpen ? 45 : 0,
                  y: isMobileMenuOpen ? 8 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="w-full h-0.5 bg-white block"
                animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="w-full h-0.5 bg-white block"
                animate={{
                  rotate: isMobileMenuOpen ? -45 : 0,
                  y: isMobileMenuOpen ? -8 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            className="md:hidden bg-deep-blue/95 backdrop-blur-sm overflow-hidden absolute w-full top-full left-0"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            style={{ height: "auto" }}
          >
            <div className="p-6 space-y-4">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="block py-4 px-6 text-lg text-white font-medium hover:bg-hope-gold/20 rounded-lg transition duration-200 border-l-4 border-transparent hover:border-hope-gold hover:pl-8"
                  onClick={handleNavClick}
                  variants={mobileLinkVariants}
                  custom={index}
                  initial="closed"
                  animate="open"
                  whileHover={{
                    x: 10,
                    backgroundColor: "rgba(212, 175, 55, 0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#booking"
                className="block py-4 px-6 text-lg bg-hope-gold text-deep-blue text-center font-bold rounded-lg mt-4 hover:bg-opacity-90 transition duration-200"
                onClick={handleNavClick}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: navLinks.length * 0.1 + 0.1,
                  duration: 0.3,
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 5px 15px rgba(212, 175, 55, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                BOOK NOW
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Particles Background */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isScrolled ? 0.3 : 0.1 }}
        transition={{ duration: 0.5 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-hope-gold rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>
    </motion.header>
  );
};

export default Navbar;
