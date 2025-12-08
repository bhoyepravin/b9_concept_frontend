import React from "react";

const Footer = () => {
  const footerLinks = [
    { href: "#home", label: "HOME" },
    { href: "#suffering", label: "YOUR SUFFERING" },
    { href: "#solution", label: "THE SOLUTION" },
    { href: "#stories", label: "SUCCESS STORIES" },
    { href: "#about", label: "ABOUT" },
    { href: "#packages", label: "PACKAGES" },
    { href: "#booking", label: "Book a Call" },
  ];

  const socialLinks = [
    {
      href: "#",
      ariaLabel: "Instagram",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919 4.919 1.266-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z" />
        </svg>
      ),
    },
    {
      href: "#",
      ariaLabel: "Facebook",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
        </svg>
      ),
    },
  ];

  const policyLinks = [
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-dark-gray text-white pt-16 pb-8">
      <div className="container mx-auto px-4 text-center">
        {/* Logo */}
        <a
          href="#home"
          className="text-3xl font-bold font-montserrat mb-8 inline-block hover:text-hope-gold transition duration-300"
          onClick={scrollToTop}
        >
          B9CONCEPT
        </a>

        {/* Navigation Links */}
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 md:space-x-8 mb-8">
          {footerLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="hover:text-hope-gold transition duration-300 font-open-sans font-medium"
              onClick={scrollToTop}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 mb-8">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              aria-label={social.ariaLabel}
              className="hover:text-hope-gold transition duration-300"
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Disclaimer and Copyright */}
        <div className="border-t border-gray-700 pt-8 mt-8 max-w-4xl mx-auto">
          <p className="text-xs text-gray-500 mb-4 font-open-sans leading-relaxed">
            DISCLAIMER: The information on this site is not intended or implied
            to be a substitute for professional medical advice, diagnosis or
            treatment. All content, including text, graphics, images and
            information, contained on or available through this web site is for
            general information purposes only.
          </p>
          <p className="text-sm text-gray-400 font-open-sans">
            &copy; 2025 B9Concept. All Rights Reserved.{" "}
            {policyLinks.map((policy, index) => (
              <span key={index}>
                <a
                  href={policy.href}
                  className="underline hover:text-white transition duration-300"
                >
                  {policy.label}
                </a>
                {index < policyLinks.length - 1 ? " | " : ""}
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
