import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

const GlobalPresenceSection = () => {
  const [selectedLocation, setSelectedLocation] = useState(0);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sliderRef = useRef(null);
  const mapRef = useRef(null);
  const autoPlayRef = useRef(null);
  const mapInitializedRef = useRef(false);

  const locations = [
    {
      country: "USA",
      city: "Chicago",
      address: "123 Lake Shore Dr Chicago, IL 60601",
      phone: "‪+1 (312) 555-0101‬",
      lat: 41.8781,
      lng: -87.6298,
      flag: "🇺🇸",
    },
    {
      country: "USA",
      city: "Los Angeles",
      address: "456 Rodeo Dr Beverly Hills, CA 90210",
      phone: "‪+1 (310) 555-0102‬",
      lat: 34.0736,
      lng: -118.4004,
      flag: "🇺🇸",
    },
    {
      country: "USA",
      city: "New Jersey",
      address: "789 Boardwalk Atlantic City, NJ 08401",
      phone: "‪+1 (609) 555-0103‬",
      lat: 39.3643,
      lng: -74.4229,
      flag: "🇺🇸",
    },
    {
      country: "USA",
      city: "Dallas",
      address: "101 Big Tex Way Dallas, TX 75210",
      phone: "‪+1 (214) 555-0104‬",
      lat: 32.7767,
      lng: -96.797,
      flag: "🇺🇸",
    },
    {
      country: "United Kingdom",
      city: "London",
      address: "1 Baker Street London, NW1 6XE, UK",
      phone: "‪+44 20 7946 0105‬",
      lat: 51.5074,
      lng: -0.1278,
      flag: "🇬🇧",
    },
    {
      country: "Canada",
      city: "Vancouver",
      address: "234 Stanley Park Dr Vancouver, BC V6G 3E2, CA",
      phone: "‪+1 (604) 555-0106‬",
      lat: 49.2827,
      lng: -123.1207,
      flag: "🇨🇦",
    },
    {
      country: "India",
      city: "Nashik",
      address: "567 Sula Vineyards Rd Nashik, MH 422222, IN",
      phone: "‪+91 253 555 0107‬",
      lat: 19.9975,
      lng: 73.7898,
      flag: "🇮🇳",
    },
    {
      country: "India",
      city: "Noida",
      address: "890 Film City, Sector 16A Noida, UP 201301, IN",
      phone: "‪+91 120 555 0108‬",
      lat: 28.5355,
      lng: 77.391,
      flag: "🇮🇳",
    },
    {
      country: "UAE",
      city: "Dubai",
      address: "1 Burj Khalifa Blvd Dubai, UAE",
      phone: "‪+971 4 555 0109‬",
      lat: 25.2048,
      lng: 55.2708,
      flag: "🇦🇪",
    },
    {
      country: "Singapore",
      city: "Singapore",
      address: "10 Bayfront Ave Singapore 018956",
      phone: "‪+65 6688 8888‬",
      lat: 1.28,
      lng: 103.85,
      flag: "🇸🇬",
    },
    {
      country: "Australia",
      city: "Melbourne",
      address: "12 Collins St Melbourne, VIC 3000, AU",
      phone: "‪+61 3 9000 0110‬",
      lat: -37.8136,
      lng: 144.9631,
      flag: "🇦🇺",
    },
  ];

  // Auto-play locations
  useEffect(() => {
    const initializeMap = async () => {
      // Prevent multiple initializations
      if (mapInitializedRef.current || !mapRef.current) return;

      try {
        const L = await import("leaflet");

        // Fix for default marker icons
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        // Define your fixed default zoom level
        const DEFAULT_ZOOM = 2;
        const MIN_ZOOM = DEFAULT_ZOOM; // Same as default - cannot zoom out
        const MAX_ZOOM = 18; // Maximum zoom in level

        // Create map instance with fixed zoom constraints
        const mapInstance = L.map(mapRef.current, {
          zoomControl: true, // Keep zoom control for zoom in
          zoomAnimation: true,
          attributionControl: false,
          worldCopyJump: false,
          zoomDelta: 1,
          wheelPxPerZoomLevel: 60,
          // Set minZoom equal to default zoom to prevent zooming out
          minZoom: MIN_ZOOM,
          maxZoom: MAX_ZOOM,
          maxBounds: [
            [-90, -180],
            [90, 180],
          ],
          maxBoundsViscosity: 1.0,
        }).setView([20, 0], DEFAULT_ZOOM); // Set fixed default zoom

        // Disable zoom out button in zoom control
        mapInstance.zoomControl.options.zoomOutTitle = null;

        // Add tile layer with noWrap to prevent repeating
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: MAX_ZOOM,
          minZoom: MIN_ZOOM,
          noWrap: true,
          bounds: [
            [-90, -180],
            [90, 180],
          ],
        }).addTo(mapInstance);

        // Add custom zoom control with only zoom in button
        L.control
          .zoom({
            position: "bottomright",
            zoomInTitle: "Zoom in",
            zoomOutTitle: "", // Empty string hides zoom out
          })
          .addTo(mapInstance);

        // Add attribution to bottom left
        L.control
          .attribution({
            position: "bottomleft",
          })
          .addTo(mapInstance);

        // Custom marker with your color scheme
        const customIcon = L.divIcon({
          className: "custom-marker",
          html: `
          <div class="relative">
            <div class="absolute inset-0 bg-[#4B5E5E] rounded-full animate-ping opacity-75"></div>
            <div class="relative bg-[#0B3954] w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <div class="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full"></div>
            </div>
          </div>
        `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          popupAnchor: [0, -12],
        });

        // Create markers
        const markerInstances = locations.map((location, index) => {
          const marker = L.marker([location.lat, location.lng], {
            icon: customIcon,
          }).addTo(mapInstance);

          // Create popup content
          const popupContent = `
          <div class="p-3 md:p-4 min-w-48 md:min-w-64">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xl md:text-2xl">${location.flag}</span>
              <span class="text-xs font-semibold text-[#0B3954] uppercase tracking-wider">${location.country}</span>
            </div>
            <div class="text-base md:text-lg font-bold text-gray-800 mb-2">${location.city}</div>
            <div class="text-xs md:text-sm text-gray-600 leading-relaxed mb-3">${location.address}</div>
            <div class="text-xs md:text-sm font-semibold text-[#4B5E5E]">${location.phone}</div>
          </div>
        `;

          marker.bindPopup(popupContent);

          // Add click event to marker
          marker.on("click", () => {
            setSelectedLocation(index);
            setIsAutoPlaying(false);

            // When marker is clicked, zoom in to level 4
            mapInstance.setView([location.lat, location.lng], 4);
            marker.openPopup();

            // Scroll to corresponding card
            const card = document.querySelector(`[data-index="${index}"]`);
            if (card) {
              card.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
              });
            }
          });

          return marker;
        });

        // Fit map to show all markers with padding (but maintain min zoom constraint)
        if (markerInstances.length > 0) {
          const group = L.featureGroup(markerInstances);
          const bounds = group.getBounds();
          mapInstance.fitBounds(bounds.pad(0.1), {
            maxZoom: DEFAULT_ZOOM, // Don't zoom in automatically on initialization
            minZoom: DEFAULT_ZOOM, // Don't zoom out automatically
          });
        }

        // Disable zoom out via mouse wheel and double click
        mapInstance.touchZoom.disable();
        mapInstance.doubleClickZoom.disable();

        // Handle zoom events to prevent zooming out
        mapInstance.on("zoomstart", function (e) {
          if (mapInstance.getZoom() <= MIN_ZOOM) {
            mapInstance.options.zoomSnap = 0;
          }
        });

        mapInstance.on("zoomend", function (e) {
          // Force minimum zoom level
          if (mapInstance.getZoom() < MIN_ZOOM) {
            mapInstance.setZoom(MIN_ZOOM);
          }
        });

        // Set state and mark as initialized
        setMap(mapInstance);
        setMarkers(markerInstances);
        setIsMapLoaded(true);
        mapInitializedRef.current = true;
      } catch (error) {
        console.error("Error initializing map:", error);
        setIsMapLoaded(true);
      }
    };

    // Only initialize if not already initialized
    if (!mapInitializedRef.current) {
      initializeMap();
    }

    // Cleanup function
    return () => {
      if (map) {
        map.remove();
        setMap(null);
        setMarkers([]);
        mapInitializedRef.current = false;
      }
    };
  }, []);

  // Update handleLocationClick to maintain zoom constraints
  const handleLocationClick = (index) => {
    setSelectedLocation(index);
    setIsAutoPlaying(false);

    if (map && markers[index]) {
      const location = locations[index];
      // Zoom to level 4 when clicking location (only zoom in from default)
      map.setView([location.lat, location.lng], 4);
      markers[index].openPopup();

      // Close other popups
      markers.forEach((marker, i) => {
        if (i !== index && marker.isPopupOpen()) {
          marker.closePopup();
        }
      });
    }
  };

  // Scroll handlers for slider
  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 280 : 320;
      sliderRef.current.scrollLeft += direction * scrollAmount;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="min-h-screen bg-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-[#0B3954] mb-4 md:mb-6"
          >
            Our Global Presence
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-[#4B5E5E] max-w-2xl mx-auto leading-relaxed px-4"
          >
            Serving clients across{" "}
            <span className="font-bold text-[#0B3954]">{locations.length}</span>{" "}
            strategic locations worldwide
          </motion.p>
        </motion.div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg overflow-hidden border border-gray-100">
          {/* Locations Slider Section */}
          <div className="py-8 md:py-12 px-4 sm:px-6 md:px-8 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0B3954] mb-2">
                  Our Locations
                </h2>
                <p className="text-[#4B5E5E] text-sm md:text-base">
                  Click on any location to explore our facilities
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-end gap-3 md:gap-4">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className={`p-2 md:p-3 rounded-full transition-all duration-300 ${
                    isAutoPlaying
                      ? "bg-[#4B5E5E] text-white"
                      : "bg-gray-100 text-[#4B5E5E]"
                  }`}
                >
                  {isAutoPlaying ? (
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => scrollSlider(-1)}
                    className="p-2 md:p-3 bg-[#0B3954] rounded-full hover:bg-[#4B5E5E] transition-all duration-300 hover:scale-110 text-white"
                  >
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
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
                    onClick={() => scrollSlider(1)}
                    className="p-2 md:p-3 bg-[#0B3954] rounded-full hover:bg-[#4B5E5E] transition-all duration-300 hover:scale-110 text-white"
                  >
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
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
              </div>
            </div>

            {/* Slider Container */}
            <div className="relative">
              {/* Slider Track */}
              <div
                ref={sliderRef}
                className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-4 md:py-6 px-2 -mx-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <AnimatePresence mode="wait">
                  {locations.map((location, index) => (
                    <motion.div
                      key={index}
                      data-index={index}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        borderColor:
                          selectedLocation === index ? "#4B5E5E" : "#E5E7EB",
                        backgroundColor:
                          selectedLocation === index ? "#F8FAFC" : "#FFFFFF",
                      }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-shrink-0 w-[280px] sm:w-80 bg-white rounded-xl p-4 md:p-6 cursor-pointer border-2 transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-md"
                      whileHover={{
                        y: -4,
                        backgroundColor: "#F8FAFC",
                        transition: { duration: 0.3 },
                      }}
                      onClick={() => handleLocationClick(index)}
                    >
                      {/* Selection Indicator */}
                      {selectedLocation === index && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute top-3 right-3 md:top-4 md:right-4"
                        >
                          <div className="w-2 h-2 md:w-3 md:h-3 bg-[#4B5E5E] rounded-full ring-2 ring-[#4B5E5E]/30" />
                        </motion.div>
                      )}

                      {/* Flag and Country */}
                      <div className="flex items-center gap-2 mb-3 md:mb-4">
                        <span className="text-xl md:text-2xl">
                          {location.flag}
                        </span>
                        <span className="text-xs font-semibold text-[#4B5E5E] uppercase tracking-wider">
                          {location.country}
                        </span>
                      </div>

                      {/* City Name */}
                      <h3 className="text-lg md:text-xl font-bold text-[#0B3954] mb-2 md:mb-3 group-hover:text-[#4B5E5E] transition-colors">
                        {location.city}
                      </h3>

                      {/* Address */}
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 line-clamp-2">
                        {location.address}
                      </p>

                      {/* Phone */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm font-semibold text-[#0B3954]">
                          {location.phone}
                        </span>
                        <motion.div
                          whileHover={{ x: 4 }}
                          className="text-[#4B5E5E] group-hover:text-[#0B3954] transition-colors"
                        >
                          <svg
                            className="w-4 h-4 md:w-5 md:h-5"
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
                        </motion.div>
                      </div>

                      {/* Hover Border Effect */}
                      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[#4B5E5E] transition-colors duration-300 -z-10" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Slider Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-1 mt-4 md:mt-6">
                <motion.div
                  className="bg-[#4B5E5E] h-1 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{
                    width: isAutoPlaying
                      ? `${((selectedLocation + 1) / locations.length) * 100}%`
                      : "0%",
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Slider Dots - Hide on mobile, show on tablet+ */}
              <div className="hidden sm:flex justify-center gap-2 mt-3 md:mt-4">
                {locations.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleLocationClick(index)}
                    className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${
                      selectedLocation === index
                        ? "bg-[#4B5E5E] w-4 md:w-6"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="py-8 md:py-16 px-4 sm:px-6 md:px-8 bg-gray-50">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 md:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B3954] mb-3 md:mb-4">
                Global Office Network
              </h2>
            </motion.div>

            {/* Map Container */}
            <div className="relative rounded-lg md:rounded-xl overflow-hidden shadow-lg border border-gray-200 ">
              <div
                ref={mapRef}
                className="h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] w-full z-10"
              />

              {!isMapLoaded && (
                <div className="absolute inset-0 bg-gray-50 flex items-center justify-center ">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                  >
                    <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-t-2 border-b-2 border-[#4B5E5E] mx-auto mb-3 md:mb-4"></div>
                    <p className="text-[#4B5E5E] font-semibold text-sm md:text-base">
                      Loading Global Map...
                    </p>
                  </motion.div>
                </div>
              )}

              {/* Map Overlay Info */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 sm:p-3 md:p-4 border border-gray-200">
                <div className="text-xs sm:text-sm font-semibold text-[#0B3954]">
                  Interactive Map
                </div>
                <div className="text-xs text-[#4B5E5E]">
                  Click markers for details
                </div>
              </div>
            </div>

            {/* Map Attribution */}
            <div className="mt-4 md:mt-6 text-center">
              <p className="text-gray-500 text-xs md:text-sm">
                Leaflet | © OpenStreetMap contributors
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default GlobalPresenceSection;
