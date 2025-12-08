import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import heroVideosData from "../../constant/Home/heroVideosData.json";

// Import your video files directly
import video1 from "../../assets/videos/B9_Split_VDO_Center_LOGO_FINAL.mp4";
import video2 from "../../assets/videos/FINAL_B9_Philosiphy_VDO_Transperent_Logo_FINAL.mp4";

const VideoHeroSection = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState(0);
  const [videoError, setVideoError] = useState(false);

  // Auto-slide videos
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentVideoIndex(
        (prevIndex) => (prevIndex + 1) % heroVideosData.videos.length
      );
      setVideoError(false);
    }, heroVideosData.slideDuration);

    return () => clearInterval(interval);
  }, [isPlaying, heroVideosData.videos.length, heroVideosData.slideDuration]);

  // Manual slide navigation
  const goToSlide = (index) => {
    const newDirection = index > currentVideoIndex ? 1 : -1;
    setDirection(newDirection);
    setCurrentVideoIndex(index);
    setIsPlaying(false);
    setVideoError(false);
    setTimeout(() => setIsPlaying(true), 3000);
  };

  // Get video source based on index
  const getVideoSource = () => {
    switch (currentVideoIndex) {
      case 0:
        return video1;
      case 1:
        return video2;
      // case 2:
      //   return ""; // Empty source for 3rd video
      // case 3:
      //   return "";
      default:
        return "";
    }
  };

  // Animation variants
  const videoVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    }),
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.5,
      },
    },
  };

  const dotVariants = {
    inactive: {
      scale: 1,
      opacity: 0.7,
      transition: { duration: 0.2 },
    },
    active: {
      scale: 1.2,
      opacity: 1,
      transition: { duration: 0.2 },
    },
    hover: {
      scale: 1.3,
      opacity: 1,
      transition: { duration: 0.1 },
    },
  };

  const currentVideo = heroVideosData.videos[currentVideoIndex];
  const videoSource = getVideoSource();

  return (
    <section className="relative w-full md:h-screen h-80  overflow-hidden">
      {/* Video Slideshow */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentVideoIndex}
            custom={direction}
            variants={videoVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full h-full relative"
          >
            {/* Video or Background */}
            {videoSource && !videoError ? (
              <video
                key={`video-${currentVideoIndex}`}
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-28 left-0 h-50 w-90 md:w-full md:h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={() => setVideoError(true)}
              >
                <source src={videoSource} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              // Gradient background for slides without video
              <div className="absolute top-0 left-0 w-full h-full object-cover">
                {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"></div> */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_50%)]"></div>
              </div>
            )}

            {/* Video Overlay */}
            <div className="absolute inset-0 bg-black/50 z-10"></div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center text-white text-center px-4">
        {/* <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentVideoIndex}`}
            className="max-w-4xl mx-auto"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold font-montserrat mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {currentVideo.title}
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl lg:text-3xl font-light font-montserrat mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              {currentVideo.subtitle}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <motion.a
                href="#solution"
                className="bg-wellness-green text-white font-montserrat font-semibold uppercase px-8 py-4 rounded-full hover:bg-opacity-90 transition-all duration-300 text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Discover Solution
              </motion.a>
              <motion.a
                href="#booking"
                className="bg-hope-gold text-deep-blue font-montserrat font-semibold uppercase px-8 py-4 rounded-full hover:bg-opacity-90 transition-all duration-300 text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Your Freedom
              </motion.a>
            </motion.div>
          </motion.div>
        </AnimatePresence> */}

        {/* Slide Indicators */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          {heroVideosData.videos.map((_, index) => (
            <motion.button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentVideoIndex ? "bg-hope-gold" : "bg-white/50"
              }`}
              variants={dotVariants}
              initial="inactive"
              animate={index === currentVideoIndex ? "active" : "inactive"}
              whileHover="hover"
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </motion.div>

        {/* Navigation Arrows */}
        <motion.button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-300 z-30 backdrop-blur-sm"
          onClick={() =>
            goToSlide(
              (currentVideoIndex - 1 + heroVideosData.videos.length) %
                heroVideosData.videos.length
            )
          }
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Previous slide"
        >
          <svg
            className="w-6 h-6 text-white"
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
        </motion.button>

        <motion.button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-300 z-30 backdrop-blur-sm"
          onClick={() =>
            goToSlide((currentVideoIndex + 2) % heroVideosData.videos.length)
          }
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Next slide"
        >
          <svg
            className="w-6 h-6 text-white"
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
        </motion.button>

        {/* Play/Pause Button */}
        <motion.button
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-300 z-30 backdrop-blur-sm"
          onClick={() => setIsPlaying(!isPlaying)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? (
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 9v6m4-6v6"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
            </svg>
          )}
        </motion.button>

        {/* Slide Counter */}
        <motion.div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white/80 text-sm font-medium bg-black/30 px-3 py-1 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="font-bold text-hope-gold">
            {currentVideoIndex + 1}
          </span>
          <span className="mx-1">/</span>
          <span>{heroVideosData.videos.length}</span>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoHeroSection;
