import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const BookingSection = () => {
  const [formState, setFormState] = useState({
    // Personal information fields for API
    username: "",
    email: "",
    password: "defaultPassword123",
    roleId: 4,
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    message: "",
    // Additional form data will be initialized after fetching
  });

  const [showOtherInputs, setShowOtherInputs] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);

  // New state for dynamic questions
  const [formSections, setFormSections] = useState([]);
  const [fetchingQuestions, setFetchingQuestions] = useState(true);
  const [allSteps, setAllSteps] = useState([]);

  // Personal info step (always the first step)
  const personalInfoStep = {
    title: "Personal Information",
    description: "Let's start with your basic details",
    fields: [
      {
        id: "firstName",
        label: "First Name",
        type: "text",
        required: true,
        colSpan: "md:col-span-1",
      },
      {
        id: "lastName",
        label: "Last Name",
        type: "text",
        required: true,
        colSpan: "md:col-span-1",
      },
      {
        id: "email",
        label: "Email Address",
        type: "email",
        required: true,
        colSpan: "md:col-span-1",
      },
      {
        id: "phone",
        label: "Phone Number",
        type: "tel",
        required: true,
        colSpan: "md:col-span-1",
      },
      {
        id: "address",
        label: "Full Address",
        type: "textarea",
        required: true,
        colSpan: "md:col-span-2",
      },
      {
        id: "message",
        label: "Additional Message (Optional)",
        type: "textarea",
        colSpan: "md:col-span-2",
      },
    ],
  };

  // Mock data for development (when backend is not available)
  const mockQuestionnaireData = {
    success: true,
    data: [
      {
        id: 1,
        title: "Step 1: Current Situation Assessment",
        step_number: 1,
        content: {
          fields: [
            {
              id: "problem",
              label: "What specific problem are you experiencing?",
              type: "select",
              options: [
                "Anxiety",
                "Stress",
                "Lack of Confidence",
                "Relationship Issues",
                "Career Challenges",
                "Health Issues",
                "Financial Concerns",
                "Burnout",
                "Lack of Motivation",
                "Other",
              ],
              colSpan: "md:col-span-1",
            },
            {
              id: "duration",
              label: "How long has this been persisting?",
              type: "select",
              options: [
                "Less than 1 Month",
                "1-3 Months",
                "3-6 Months",
                "6-12 Months",
                "More than 1 Year",
                "Other",
              ],
              colSpan: "md:col-span-1",
            },
            {
              id: "triggers-assessment",
              label: "Specific triggers that started/worsened this?",
              type: "select",
              options: [
                "Work Deadlines",
                "Personal Loss",
                "Conflict",
                "Health Issues",
                "Financial Crisis",
                "Pandemic-Related Stress",
                "Other",
              ],
              colSpan: "md:col-span-1",
            },
            {
              id: "medications",
              label: "Current medications for this issue?",
              type: "select",
              options: [
                "No Medications",
                "Antidepressants",
                "Anti-Anxiety Medications",
                "Sleep Aids",
                "Herbal Remedies",
                "Other",
              ],
              colSpan: "md:col-span-1",
            },
          ],
        },
        is_active: true,
      },
      {
        id: 2,
        title: "Step 2: Emotional Patterns & Triggers",
        step_number: 2,
        content: {
          fields: [
            {
              id: "distress-intensifiers",
              label: "What intensifies your distress?",
              type: "select",
              options: [
                "Deadlines",
                "Crowded Places",
                "Family Expectations",
                "Financial Pressure",
                "Negative Thoughts",
                "Public Speaking",
                "Social Interactions",
                "Other",
              ],
              colSpan: "md:col-span-1",
            },
            {
              id: "physical-sensations",
              label: "Physical sensations when distressed?",
              type: "select",
              options: [
                "Tightness in Chest",
                "Sweating",
                "Racing Thoughts",
                "Nausea",
                "Restlessness",
                "Headaches",
                "Shaking",
                "Other",
              ],
              colSpan: "md:col-span-1",
            },
            {
              id: "negative-thoughts",
              label: "Recurring negative thoughts?",
              type: "select",
              options: [
                "I can't do it",
                "I'm not good enough",
                "Things will never improve",
                "I'll always fail",
                "I'm a burden",
                "I'll be judged",
              ],
              colSpan: "md:col-span-2",
            },
          ],
        },
        is_active: true,
      },
      {
        id: 3,
        title: "Step 3: Define Your Desired Outcome",
        step_number: 3,
        content: {
          fields: [
            {
              id: "resolution",
              label: "What's your ideal resolution?",
              type: "select",
              options: [
                "Feeling Calm",
                "Improved Confidence",
                "Better Relationships",
                "Career Growth",
                "Improved Health",
                "Financial Stability",
                "Other",
              ],
              colSpan: "md:col-span-1",
            },
            {
              id: "timeline",
              label: "Timeline for seeing progress?",
              type: "select",
              options: [
                "1 Week",
                "1 Month",
                "3 Months",
                "6 Months",
                "More than 6 Months",
                "Other",
              ],
              colSpan: "md:col-span-1",
            },
            {
              id: "confidence",
              label: "Confidence in resolving this issue?",
              type: "select",
              options: [
                "Very Confident",
                "Somewhat Confident",
                "Neutral",
                "Not Very Confident",
                "Not Confident at All",
              ],
              colSpan: "md:col-span-2",
            },
          ],
        },
        is_active: true,
      },
      {
        id: 4,
        title: "Step 4: Deeper Insights",
        step_number: 4,
        content: {
          fields: [
            {
              id: "happy-memories",
              label: "In happy memories, what do you notice first?",
              type: "select",
              options: [
                "Visual (Images)",
                "Auditory (Sounds)",
                "Kinesthetic (Feelings)",
                "Smell",
                "Taste",
              ],
              colSpan: "md:col-span-1",
            },
            {
              id: "relaxation-aids",
              label: "What helps you feel relaxed?",
              type: "select",
              options: [
                "Calm Music",
                "Nature Sounds",
                "Lavender Scents",
                "Candlelight",
                "Warm Baths",
                "Other",
              ],
              colSpan: "md:col-span-1",
            },
            {
              id: "support-system",
              label: "Who supports you most?",
              type: "select",
              options: [
                "Family",
                "Friends",
                "Therapist",
                "Mentor",
                "Colleague",
                "None",
                "Other",
              ],
              colSpan: "md:col-span-1",
            },
            {
              id: "recharge-activities",
              label: "Activities that help you recharge?",
              type: "select",
              options: [
                "Exercise",
                "Meditation",
                "Reading",
                "Journaling",
                "Time Outdoors",
                "Creative Hobbies",
                "Other",
              ],
              colSpan: "md:col-span-1",
            },
          ],
        },
        is_active: true,
      },
      {
        id: 5,
        title: "Step 5: Choose Your Transformation Package",
        step_number: 5,
        content: {
          fields: [
            {
              id: "package",
              type: "select",
              options: [
                {
                  value: "1530",
                  label:
                    "Cognitive Transformation - For a specific, targeted issue. ($1,530)",
                },
                {
                  value: "6120",
                  label:
                    "Complete Transformation - For comprehensive, life-changing results. ($6,120)",
                },
                {
                  value: "12240",
                  label:
                    "Executive Package - A premium, all-inclusive package for leaders. ($12,240)",
                },
              ],
            },
          ],
        },
        is_active: true,
      },
      {
        id: 6,
        title: "Step 6: B9Concept Location",
        step_number: 6,
        content: {
          fields: [
            {
              id: "location",
              type: "select",
              options: [
                {
                  value: "",
                  label: "Please select a location...",
                  disabled: true,
                },
                {
                  value: "usa-chicago",
                  label: "USA (Chicago)",
                },
                {
                  value: "usa-los-angeles",
                  label: "USA (Los Angeles)",
                },
                {
                  value: "usa-new-jersey",
                  label: "USA (New Jersey)",
                },
                {
                  value: "usa-dallas",
                  label: "USA (Dallas)",
                },
                {
                  value: "uk-london",
                  label: "United Kingdom (London)",
                },
                {
                  value: "ca-vancouver",
                  label: "Canada (Vancouver)",
                },
                {
                  value: "in-nashik",
                  label: "India (Nashik)",
                },
                {
                  value: "in-noida",
                  label: "India (Noida)",
                },
                {
                  value: "uae-dubai",
                  label: "UAE (Dubai)",
                },
                {
                  value: "sg-singapore",
                  label: "Singapore (Singapore)",
                },
                {
                  value: "au-milburn",
                  label: "Australia (Milburn)",
                },
              ],
            },
          ],
        },
        is_active: true,
      },
      {
        id: 7,
        title: "Step 8: Secure Your Transformation",
        step_number: 8,
        content: {
          fields: [
            {
              id: "card-name",
              label: "Name on Card",
              type: "text",
              placeholder: "John M. Doe",
              colSpan: "md:col-span-1",
            },
            {
              id: "card-number",
              label: "Card Number",
              type: "text",
              placeholder: "1234 5678 9123 0000",
              colSpan: "md:col-span-1",
            },
            {
              id: "card-expiry",
              label: "Expiration (MM/YY)",
              type: "text",
              placeholder: "MM/YY",
              colSpan: "md:col-span-1",
            },
            {
              id: "card-cvc",
              label: "CVC",
              type: "text",
              placeholder: "123",
              colSpan: "md:col-span-1",
            },
          ],
        },
        is_active: true,
      },
    ],
    count: 7,
  };

  // Fetch questions from backend on component mount
  useEffect(() => {
    fetchQuestionnaireData();
  }, []);

  // Update allSteps when formSections changes
  useEffect(() => {
    if (formSections.length > 0) {
      console.log("Processing form sections:", formSections);

      // Map backend sections to frontend format
      const backendSteps = formSections
        .filter((section) => section.is_active) // Only show active sections
        .sort((a, b) => a.step_number - b.step_number) // Sort by step number
        .map((section) => {
          console.log(`Processing section ${section.id}:`, section);

          // Parse content if it's a string
          let content = section.content;
          if (typeof content === "string") {
            try {
              content = JSON.parse(content);
            } catch (e) {
              console.error(
                `Error parsing content for section ${section.id}:`,
                e
              );
              content = { fields: [] };
            }
          }

          return {
            id: section.id,
            title: section.title,
            step_number: section.step_number,
            fields: content?.fields || [],
            description: `Step ${section.step_number}: Complete this section`,
          };
        });

      console.log("Backend steps processed:", backendSteps);

      // Combine personal info step with backend steps
      const combinedSteps = [personalInfoStep, ...backendSteps];
      setAllSteps(combinedSteps);

      // Initialize form state for dynamic fields
      const dynamicFields = {};
      backendSteps.forEach((section) => {
        section.fields.forEach((field) => {
          dynamicFields[field.id] = "";
          // If it's a select field with "Other" option, add other field
          if (field.options && Array.isArray(field.options)) {
            const hasOtherOption = field.options.some((option) => {
              if (typeof option === "string") {
                return option === "Other";
              } else if (typeof option === "object" && option !== null) {
                return option.label === "Other" || option.value === "Other";
              }
              return false;
            });
            if (hasOtherOption) {
              dynamicFields[`${field.id}-other`] = "";
            }
          }
        });
      });

      console.log("Dynamic fields to initialize:", dynamicFields);

      setFormState((prev) => ({
        ...prev,
        ...dynamicFields,
      }));
    }
  }, [formSections]);

  // Fetch questionnaire data from backend
  const fetchQuestionnaireData = async () => {
    try {
      setFetchingQuestions(true);
      console.log("Fetching questionnaire data from backend...");

      // Try to fetch from backend first
      const endpoints = [
        // "http://127.0.0.1:8000/api/test",
        "http://127.0.0.1:8000/api/questionnaire/sections",
      ];

      let response = null;
      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          response = await axios.get(endpoint, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            timeout: 5000, // 5 second timeout
          });
          console.log(`Success from ${endpoint}:`, response.data);
          break; // Exit loop if successful
        } catch (err) {
          lastError = err;
          console.error(`Failed to fetch from ${endpoint}:`, err.message);
          continue; // Try next endpoint
        }
      }

      if (response && response.data.success) {
        setFormSections(response.data.data);
        setError(null); // Clear any previous errors
      } else {
        // If backend fails, use mock data
        console.log("Using mock questionnaire data for development");
        setFormSections(mockQuestionnaireData.data);
        setError(
          "Using demo data (Backend unavailable). Questions are editable from admin panel."
        );
      }
    } catch (err) {
      console.error("All endpoints failed, using mock data:", err);
      // Use mock data as fallback
      setFormSections(mockQuestionnaireData.data);
      setError("Using demo data. You can edit questions from the admin panel.");
    } finally {
      setFetchingQuestions(false);
    }
  };

  const handleInputChange = (fieldId, value) => {
    setFormState((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    // Auto-generate username from first name and last name
    if (fieldId === "firstName" || fieldId === "lastName") {
      const firstName = fieldId === "firstName" ? value : formState.firstName;
      const lastName = fieldId === "lastName" ? value : formState.lastName;
      if (firstName && lastName) {
        const generatedUsername = `${firstName}${lastName}`
          .toLowerCase()
          .replace(/\s+/g, "");
        setFormState((prev) => ({
          ...prev,
          username: generatedUsername,
        }));
      }
    }

    // Handle "Other" option selection
    if (value === "Other") {
      setShowOtherInputs((prev) => ({
        ...prev,
        [fieldId]: true,
      }));
    } else {
      setShowOtherInputs((prev) => ({
        ...prev,
        [fieldId]: false,
      }));
      // Clear the "other" field when switching away from "Other"
      setFormState((prev) => ({
        ...prev,
        [`${fieldId}-other`]: "",
      }));
    }
  };

  // Enhanced function to handle "Other" values properly
  const getFieldValue = (fieldId) => {
    const mainValue = formState[fieldId];
    const otherValue = formState[`${field.id}-other`];

    // If main value is "Other" and other value exists, return the other value
    if (mainValue === "Other" && otherValue && otherValue.trim() !== "") {
      return otherValue;
    }

    // Otherwise return the main value (even if it's "Other" but no other value provided)
    return mainValue;
  };

  // Prepare assessment data according to backend model
  const prepareAssessmentData = () => {
    const assessmentData = {};

    // Add all dynamic fields from the questionnaire
    formSections.forEach((section) => {
      let content = section.content;
      if (typeof content === "string") {
        try {
          content = JSON.parse(content);
        } catch (e) {
          console.error(`Error parsing content for assessment:`, e);
          content = { fields: [] };
        }
      }

      if (content?.fields) {
        content.fields.forEach((field) => {
          const value = formState[field.id];
          if (value !== null && value !== undefined && value !== "") {
            assessmentData[field.id] = value;
          }

          // Also store "other" value if it exists
          const otherValue = formState[`${field.id}-other`];
          if (otherValue && otherValue.trim() !== "") {
            assessmentData[`${field.id}Other`] = otherValue;
          }
        });
      }
    });

    console.log("Prepared Assessment Data:", assessmentData);
    return assessmentData;
  };

  // Enhanced validation function
  const validateCurrentStep = () => {
    if (currentStep >= allSteps.length) return false;

    const currentStepData = allSteps[currentStep];

    if (currentStepData.fields) {
      const missingRequiredFields = currentStepData.fields
        .filter((field) => field.required !== false)
        .filter((field) => {
          const value = formState[field.id];
          return !value || value.toString().trim() === "";
        });

      if (missingRequiredFields.length > 0) {
        const errorMessage = `Please fill in all required fields: ${missingRequiredFields
          .map((f) => f.label || f.id)
          .join(", ")}`;
        setError(errorMessage);
        return false;
      }
    }
    return true;
  };

  // Submit user data to create user
  const submitUserData = async () => {
    const userDataPayload = {
      username:
        formState.username ||
        `${formState.firstName}${formState.lastName}`
          .toLowerCase()
          .replace(/\s+/g, ""),
      email: formState.email ? formState.email.trim() : "",
      password: formState.password || "defaultPassword123",
      roleId: formState.roleId || 4,
      firstName: formState.firstName ? formState.firstName.trim() : "",
      lastName: formState.lastName ? formState.lastName.trim() : "",
      phone: formState.phone ? formState.phone.trim() : "",
      address: formState.address ? formState.address.trim() : "",
      message: formState.message ? formState.message.trim() : "",
    };

    // Validation
    if (
      !userDataPayload.firstName.trim() ||
      !userDataPayload.lastName.trim() ||
      !userDataPayload.email.trim()
    ) {
      const missingFields = [];
      if (!userDataPayload.firstName.trim()) missingFields.push("First Name");
      if (!userDataPayload.lastName.trim()) missingFields.push("Last Name");
      if (!userDataPayload.email.trim()) missingFields.push("Email");
      setError(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userDataPayload.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Submitting user data to /user/create:", userDataPayload);

      // Try to create user
      const response = await axios.post(
        "http://localhost:9091/api/v1/user/create",
        userDataPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("User creation response:", response.data);

      if (response.status === 200 || response.status === 201) {
        const newUserId =
          response.data.id || response.data.userId || response.data.data?.id;
        setUserId(newUserId);
        setUserData(userDataPayload);
        console.log("User created successfully. User ID:", newUserId);
        return newUserId;
      } else {
        setError("Unexpected response from server");
        return false;
      }
    } catch (err) {
      console.error("Error creating user:", err);
      console.error("Error response data:", err.response?.data);
      console.error("Error response status:", err.response?.status);

      // If user already exists, try to get existing user ID
      if (
        err.response?.status === 400 &&
        err.response?.data?.error?.includes("already exists")
      ) {
        console.log("User already exists, trying to fetch existing user...");

        try {
          // Try to get user by email
          const email = formState.email.trim();
          const userResponse = await axios.get(
            `http://localhost:9091/api/v1/user/email/${email}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (userResponse.data && userResponse.data.id) {
            const existingUserId = userResponse.data.id;
            console.log("Found existing user with ID:", existingUserId);
            setUserId(existingUserId);
            setUserData(userDataPayload);
            return existingUserId;
          }
        } catch (fetchErr) {
          console.error("Error fetching existing user:", fetchErr);
          setError(
            "User already exists but could not retrieve user information."
          );
          return false;
        }
      }

      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError(
          "Failed to create user. Please check your information and try again."
        );
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Single endpoint that accepts both user and assessment data
  const submitCombinedData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare both user and assessment data
      const userDataPayload = {
        username:
          formState.username ||
          `${formState.firstName}${formState.lastName}`
            .toLowerCase()
            .replace(/\s+/g, ""),
        email: formState.email ? formState.email.trim() : "",
        password: formState.password || "defaultPassword123",
        roleId: formState.roleId || 4,
        firstName: formState.firstName ? formState.firstName.trim() : "",
        lastName: formState.lastName ? formState.lastName.trim() : "",
        phone: formState.phone ? formState.phone.trim() : "",
        address: formState.address ? formState.address.trim() : "",
        message: formState.message ? formState.message.trim() : "",
      };

      const assessmentData = prepareAssessmentData();

      // Create combined payload matching your JSON structure
      const combinedPayload = {
        user: userDataPayload,
        assessment: assessmentData,
      };

      console.log("Submitting combined data:", combinedPayload);

      // Use the correct endpoint - your controller is at /api/v1/user-assessment/create
      const response = await axios.post(
        "http://localhost:9091/api/v1/user-assessment/create",
        combinedPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Combined submission response:", response.data);

      if (response.status === 200 || response.status === 201) {
        console.log("Combined data submitted successfully");
        return true;
      } else {
        setError("Unexpected response from server");
        return false;
      }
    } catch (err) {
      console.error("Error in combined submission:", err);

      // For debugging, log the exact error
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to submit data";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started");
    console.log("Current form state:", formState);

    // Check if questions are loaded
    if (fetchingQuestions) {
      setError("Please wait while we load the questionnaire...");
      return;
    }

    if (allSteps.length === 0) {
      setError("No questionnaire sections available. Please try again later.");
      return;
    }

    // Validate all required fields before submission
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep === allSteps.length - 1) {
      // Use combined submission
      const success = await submitCombinedData();
      if (success) {
        console.log("Form completed successfully!");
        setSuccess(true);

        // Show success message for 5 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 5000);

        // Reset form after successful submission
        const resetState = {
          username: "",
          email: "",
          password: "defaultPassword123",
          roleId: 4,
          firstName: "",
          lastName: "",
          phone: "",
          address: "",
          message: "",
        };

        // Add dynamic fields from fetched sections
        formSections.forEach((section) => {
          let content = section.content;
          if (typeof content === "string") {
            try {
              content = JSON.parse(content);
            } catch (e) {
              content = { fields: [] };
            }
          }

          if (content?.fields) {
            content.fields.forEach((field) => {
              resetState[field.id] = "";
              if (field.options && Array.isArray(field.options)) {
                const hasOtherOption = field.options.some((option) => {
                  if (typeof option === "string") {
                    return option === "Other";
                  } else if (typeof option === "object" && option !== null) {
                    return option.label === "Other" || option.value === "Other";
                  }
                  return false;
                });
                if (hasOtherOption) {
                  resetState[`${field.id}-other`] = "";
                }
              }
            });
          }
        });

        setFormState(resetState);
        setCurrentStep(0);
        setUserId(null);
        setUserData(null);
        setShowOtherInputs({});
        setCompletedSteps([]);
      }
    }
  };

  const nextStep = async () => {
    // Check if questions are loaded
    if (fetchingQuestions) {
      setError("Please wait while we load the questionnaire...");
      return;
    }

    // Validate current step before proceeding
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep === 0) {
      // Submit user data on first step
      console.log("Moving to next step, submitting user data first...");
      console.log("Form data before submission:", {
        firstName: formState.firstName,
        lastName: formState.lastName,
        email: formState.email,
        phone: formState.phone,
        address: formState.address,
      });

      const userId = await submitUserData();
      if (!userId) {
        console.log("User data submission failed, not proceeding to next step");
        return;
      }
      console.log("User data submitted successfully, proceeding to next step");
    }

    if (currentStep < allSteps.length - 1) {
      setCompletedSteps((prev) => [...prev, currentStep]);
      setCurrentStep((prev) => prev + 1);
      setError(null);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setError(null);
    }
  };

  const goToStep = (stepIndex) => {
    if (completedSteps.includes(stepIndex) || stepIndex === currentStep) {
      setCurrentStep(stepIndex);
      setError(null);
    }
  };

  const isStepCompleted = (stepIndex) => {
    return completedSteps.includes(stepIndex);
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

  const stepVariants = {
    hidden: {
      opacity: 0,
      x: 50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: {
        duration: 0.3,
      },
    },
  };

  const renderField = (field) => {
    const fieldValue = formState[field.id] || "";

    switch (field.type) {
      case "text":
      case "email":
      case "tel":
        return (
          <input
            type={field.type}
            id={field.id}
            placeholder={field.placeholder || ""}
            className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            value={fieldValue}
            required={field.required !== false}
          />
        );

      case "textarea":
        return (
          <textarea
            id={field.id}
            rows={field.rows || 3}
            className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            value={fieldValue}
            required={field.required !== false}
          ></textarea>
        );

      case "select":
        return (
          <div>
            <select
              id={field.id}
              className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              value={fieldValue}
              required={field.required !== false}
            >
              <option value="">Select an option</option>
              {field.options?.map((option, index) => {
                if (typeof option === "object") {
                  return (
                    <option
                      key={index}
                      value={option.value || option.label}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </option>
                  );
                } else {
                  return (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  );
                }
              })}
            </select>
            {showOtherInputs[field.id] && (
              <input
                type="text"
                id={`${field.id}-other`}
                className="w-full p-3 rounded border border-gray-300 mt-2 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
                placeholder="Please specify..."
                onChange={(e) =>
                  handleInputChange(`${field.id}-other`, e.target.value)
                }
                value={formState[`${field.id}-other`] || ""}
                required={field.required !== false}
              />
            )}
          </div>
        );

      default:
        return (
          <input
            type="text"
            id={field.id}
            placeholder={field.placeholder || ""}
            className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            value={fieldValue}
            required={field.required !== false}
          />
        );
    }
  };

  const renderProgressBar = () => {
    if (allSteps.length === 0) return null;

    return (
      <div className="mb-8">
        {/* Desktop Progress Bar */}
        <div className="hidden md:flex justify-between items-center mb-4">
          {allSteps.map((section, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <button
                onClick={() => goToStep(index)}
                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all duration-300 ${
                  index === currentStep
                    ? "bg-blue-600 text-white scale-110"
                    : isStepCompleted(index)
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-600"
                } ${
                  completedSteps.includes(index) || index === currentStep
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
                }`}
              >
                {isStepCompleted(index) ? "✓" : index + 1}
              </button>
              <span
                className={`text-xs mt-2 text-center ${
                  index === currentStep
                    ? "text-blue-600 font-semibold"
                    : isStepCompleted(index)
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {section.title.replace("Step", "").trim()}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile Progress Bar */}
        <div className="md:hidden mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Step {currentStep + 1} of {allSteps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / allSteps.length) * 100)}%
              Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              initial={{ width: "0%" }}
              animate={{
                width: `${((currentStep + 1) / allSteps.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const currentSection = allSteps[currentStep] || {};

  if (fetchingQuestions) {
    return (
      <section id="booking" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-gray-600">
              Loading questionnaire...
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 bg-gray-50">
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

        {/* Simple contact section - keep as is */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-12"
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
                123 Therapy Street, Healing City, HC 12345
              </p>
              <p>
                <strong>Phone:</strong>
                <br />
                <a
                  href="tel:+1234567890"
                  className="text-green-600 hover:underline"
                >
                  (123) 456-7890
                </a>
              </p>
              <p>
                <strong>Email:</strong>
                <br />
                <a
                  href="mailto:info@therapycenter.com"
                  className="text-green-600 hover:underline"
                >
                  info@therapycenter.com
                </a>
              </p>
              <p>
                <strong>Hours:</strong>
                <br />
                Mon-Fri: 9am-6pm, Sat: 10am-2pm
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <form className="space-y-6">
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

        <motion.h2
          className="text-3xl md:text-4xl font-semibold font-montserrat text-gray-800 text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Ready to Reclaim Your Life? Your Transformation Starts Here.
        </motion.h2>

        <motion.div
          className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {allSteps.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">
                No questionnaire available
              </div>
              <button
                onClick={fetchQuestionnaireData}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Reload Questionnaire
              </button>
            </div>
          ) : (
            <>
              {renderProgressBar()}

              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  <motion.fieldset
                    key={currentStep}
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="mb-8"
                  >
                    <legend className="text-2xl font-semibold text-gray-700 border-b-2 border-yellow-500 pb-2 mb-6 w-full">
                      {currentSection.title}
                    </legend>

                    {currentSection.title ===
                    "Step 7: Schedule Your Session" ? (
                      <div className="bg-white p-6 text-center text-gray-500 rounded-lg border">
                        <p>[Interactive Calendar Widget Placeholder]</p>
                        <p className="text-xs mt-2">
                          Select a date and time that works best for you.
                        </p>
                      </div>
                    ) : (
                      <div
                        className={`grid grid-cols-1 ${
                          currentSection.fields?.some(
                            (f) => f.colSpan === "md:col-span-2"
                          )
                            ? "md:grid-cols-2"
                            : ""
                        } gap-6`}
                      >
                        {currentSection.fields?.map((field, fieldIndex) => (
                          <div
                            key={fieldIndex}
                            className={field.colSpan || "md:col-span-1"}
                          >
                            {field.label && (
                              <label
                                htmlFor={field.id}
                                className="block mb-2 font-semibold"
                              >
                                {field.label}
                                {field.required !== false && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                              </label>
                            )}
                            {renderField(field)}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.fieldset>
                </AnimatePresence>

                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      currentStep === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gray-600 text-white hover:bg-gray-700"
                    }`}
                    whileHover={currentStep > 0 ? { scale: 1.05 } : {}}
                    whileTap={currentStep > 0 ? { scale: 0.95 } : {}}
                    disabled={currentStep === 0 || loading}
                  >
                    ← Previous
                  </motion.button>

                  {currentStep === allSteps.length - 1 ? (
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className={`bg-green-600 text-white font-montserrat font-semibold uppercase px-8 py-3 rounded-full hover:bg-green-700 transition-transform ${
                        loading
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:scale-105"
                      }`}
                      whileHover={!loading ? { scale: 1.05 } : {}}
                      whileTap={!loading ? { scale: 0.95 } : {}}
                    >
                      {loading
                        ? "Processing..."
                        : "Complete Booking & Begin Transformation"}
                    </motion.button>
                  ) : (
                    <motion.button
                      type="button"
                      onClick={nextStep}
                      disabled={loading}
                      className={`bg-blue-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-blue-700 transition-transform ${
                        loading
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:scale-105"
                      }`}
                      whileHover={!loading ? { scale: 1.05 } : {}}
                      whileTap={!loading ? { scale: 0.95 } : {}}
                    >
                      {loading ? "Saving..." : "Next →"}
                    </motion.button>
                  )}
                </div>

                {/* Status Messages */}
                {error && (
                  <motion.div
                    className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mt-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <strong>Note:</strong> {error}
                    </div>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    className="p-4 bg-green-100 border border-green-400 text-green-700 rounded mt-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <strong>Success!</strong> Thank you! Your booking has been
                      completed successfully. We'll contact you shortly.
                    </div>
                  </motion.div>
                )}

                {/* Step Navigation Dots for Mobile */}
                <div className="flex justify-center mt-6 md:hidden">
                  <div className="flex space-x-2">
                    {allSteps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToStep(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentStep
                            ? "bg-blue-600 scale-125"
                            : isStepCompleted(index)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default BookingSection;

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";

// const BookingSection = () => {
//   const [formState, setFormState] = useState({
//     // Personal information fields for API
//     username: "",
//     email: "",
//     password: "defaultPassword123",
//     roleId: 4,
//     firstName: "",
//     lastName: "",
//     phone: "",
//     address: "",
//     message: "",

//     // Additional form data will be initialized after fetching
//   });

//   const [showOtherInputs, setShowOtherInputs] = useState({});
//   const [currentStep, setCurrentStep] = useState(0);
//   const [completedSteps, setCompletedSteps] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [userId, setUserId] = useState(null);
//   const [userData, setUserData] = useState(null);

//   // New state for dynamic questions
//   const [formSections, setFormSections] = useState([]);
//   const [fetchingQuestions, setFetchingQuestions] = useState(true);
//   const [allSteps, setAllSteps] = useState([]);

//   // Fetch questions from backend on component mount
//   useEffect(() => {
//     fetchQuestionnaireData();
//   }, []);

//   // Update allSteps when formSections changes
//   useEffect(() => {
//     if (formSections.length > 0) {
//       const personalInfoStep = {
//         title: "Personal Information",
//         description: "Let's start with your basic details",
//         fields: [
//           {
//             id: "firstName",
//             label: "First Name",
//             type: "text",
//             required: true,
//             colSpan: "md:col-span-1",
//           },
//           {
//             id: "lastName",
//             label: "Last Name",
//             type: "text",
//             required: true,
//             colSpan: "md:col-span-1",
//           },
//           {
//             id: "email",
//             label: "Email Address",
//             type: "email",
//             required: true,
//             colSpan: "md:col-span-1",
//           },
//           {
//             id: "phone",
//             label: "Phone Number",
//             type: "tel",
//             required: true,
//             colSpan: "md:col-span-1",
//           },
//           {
//             id: "address",
//             label: "Full Address",
//             type: "textarea",
//             required: true,
//             colSpan: "md:col-span-2",
//           },
//           {
//             id: "message",
//             label: "Additional Message (Optional)",
//             type: "textarea",
//             colSpan: "md:col-span-2",
//           },
//         ],
//       };

//       // Map backend sections to frontend format
//       const backendSteps = formSections
//         .filter((section) => section.is_active) // Only show active sections
//         .sort((a, b) => a.step_number - b.step_number) // Sort by step number
//         .map((section) => ({
//           id: section.id,
//           title: section.title,
//           step_number: section.step_number,
//           fields: section.content?.fields || [],
//           description: `Step ${section.step_number}: Complete this section`,
//         }));

//       // Combine personal info step with backend steps
//       const combinedSteps = [personalInfoStep, ...backendSteps];
//       setAllSteps(combinedSteps);

//       // Initialize form state for dynamic fields
//       const dynamicFields = {};
//       backendSteps.forEach((section) => {
//         section.fields.forEach((field) => {
//           dynamicFields[field.id] = "";
//           // If it's a select field with "Other" option, add other field
//           if (field.options && field.options.includes("Other")) {
//             dynamicFields[`${field.id}-other`] = "";
//           }
//         });
//       });

//       setFormState((prev) => ({
//         ...prev,
//         ...dynamicFields,
//       }));
//     }
//   }, [formSections]);

//   // Fetch questionnaire data from backend
//   const fetchQuestionnaireData = async () => {
//     try {
//       setFetchingQuestions(true);
//       console.log("Fetching questionnaire data from backend...");

//       const response = await axios.get(
//         "http://127.0.0.1:8000/questionnaire-sections",
//         {
//           headers: {
//             Accept: "application/json",
//           },
//         }
//       );

//       console.log("Backend response:", response.data);

//       if (response.data.success) {
//         setFormSections(response.data.data);
//         console.log("Fetched sections:", response.data.data);
//       } else {
//         setError("Failed to fetch questionnaire data from backend");
//         console.error("Backend returned error:", response.data);
//       }
//     } catch (err) {
//       console.error("Error fetching questionnaire data:", err);
//       setError(`Failed to load questionnaire: ${err.message}`);
//     } finally {
//       setFetchingQuestions(false);
//     }
//   };

//   const handleInputChange = (fieldId, value) => {
//     setFormState((prev) => ({
//       ...prev,
//       [fieldId]: value,
//     }));

//     // Auto-generate username from first name and last name
//     if (fieldId === "firstName" || fieldId === "lastName") {
//       const firstName = fieldId === "firstName" ? value : formState.firstName;
//       const lastName = fieldId === "lastName" ? value : formState.lastName;
//       if (firstName && lastName) {
//         const generatedUsername = `${firstName}${lastName}`
//           .toLowerCase()
//           .replace(/\s+/g, "");
//         setFormState((prev) => ({
//           ...prev,
//           username: generatedUsername,
//         }));
//       }
//     }

//     // Handle "Other" option selection
//     if (value === "Other") {
//       setShowOtherInputs((prev) => ({
//         ...prev,
//         [fieldId]: true,
//       }));
//     } else {
//       setShowOtherInputs((prev) => ({
//         ...prev,
//         [fieldId]: false,
//       }));
//       // Clear the "other" field when switching away from "Other"
//       setFormState((prev) => ({
//         ...prev,
//         [`${fieldId}-other`]: "",
//       }));
//     }
//   };

//   // Enhanced function to handle "Other" values properly
//   const getFieldValue = (fieldId) => {
//     const mainValue = formState[fieldId];
//     const otherValue = formState[`${fieldId}-other`];

//     // If main value is "Other" and other value exists, return the other value
//     if (mainValue === "Other" && otherValue && otherValue.trim() !== "") {
//       return otherValue;
//     }

//     // Otherwise return the main value (even if it's "Other" but no other value provided)
//     return mainValue;
//   };

//   // Prepare assessment data according to backend model
//   const prepareAssessmentData = () => {
//     const assessmentData = {};

//     // Add all dynamic fields from the questionnaire
//     formSections.forEach((section) => {
//       if (section.content?.fields) {
//         section.content.fields.forEach((field) => {
//           const value = getFieldValue(field.id);
//           if (value !== null && value !== undefined && value !== "") {
//             assessmentData[field.id] = value;
//           }

//           // Also store "other" value if it exists
//           const otherValue = formState[`${field.id}-other`];
//           if (otherValue && otherValue.trim() !== "") {
//             assessmentData[`${field.id}Other`] = otherValue;
//           }
//         });
//       }
//     });

//     console.log("Prepared Assessment Data:", assessmentData);
//     return assessmentData;
//   };

//   // Enhanced validation function
//   const validateCurrentStep = () => {
//     if (currentStep >= allSteps.length) return false;

//     const currentStepData = allSteps[currentStep];

//     if (currentStepData.fields) {
//       const missingRequiredFields = currentStepData.fields
//         .filter((field) => field.required)
//         .filter((field) => {
//           const value = formState[field.id];
//           return !value || value.toString().trim() === "";
//         });

//       if (missingRequiredFields.length > 0) {
//         const errorMessage = `Please fill in all required fields: ${missingRequiredFields
//           .map((f) => f.label)
//           .join(", ")}`;
//         setError(errorMessage);
//         return false;
//       }
//     }
//     return true;
//   };

//   // Submit user data to create user
//   const submitUserData = async () => {
//     const userDataPayload = {
//       username:
//         formState.username ||
//         `${formState.firstName}${formState.lastName}`
//           .toLowerCase()
//           .replace(/\s+/g, ""),
//       email: formState.email ? formState.email.trim() : "",
//       password: formState.password || "defaultPassword123",
//       roleId: formState.roleId || 4,
//       firstName: formState.firstName ? formState.firstName.trim() : "",
//       lastName: formState.lastName ? formState.lastName.trim() : "",
//       phone: formState.phone ? formState.phone.trim() : "",
//       address: formState.address ? formState.address.trim() : "",
//       message: formState.message ? formState.message.trim() : "",
//     };

//     // Validation
//     if (
//       !userDataPayload.firstName.trim() ||
//       !userDataPayload.lastName.trim() ||
//       !userDataPayload.email.trim()
//     ) {
//       const missingFields = [];
//       if (!userDataPayload.firstName.trim()) missingFields.push("First Name");
//       if (!userDataPayload.lastName.trim()) missingFields.push("Last Name");
//       if (!userDataPayload.email.trim()) missingFields.push("Email");
//       setError(
//         `Please fill in all required fields: ${missingFields.join(", ")}`
//       );
//       return false;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(userDataPayload.email)) {
//       setError("Please enter a valid email address");
//       return false;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       console.log("Submitting user data to /user/create:", userDataPayload);

//       // Try to create user
//       const response = await axios.post(
//         "http://localhost:9091/api/v1/user/create",
//         userDataPayload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("User creation response:", response.data);

//       if (response.status === 200 || response.status === 201) {
//         const newUserId =
//           response.data.id || response.data.userId || response.data.data?.id;
//         setUserId(newUserId);
//         setUserData(userDataPayload);
//         console.log("User created successfully. User ID:", newUserId);
//         return newUserId;
//       } else {
//         setError("Unexpected response from server");
//         return false;
//       }
//     } catch (err) {
//       console.error("Error creating user:", err);
//       console.error("Error response data:", err.response?.data);
//       console.error("Error response status:", err.response?.status);

//       // If user already exists, try to get existing user ID
//       if (
//         err.response?.status === 400 &&
//         err.response?.data?.error?.includes("already exists")
//       ) {
//         console.log("User already exists, trying to fetch existing user...");

//         try {
//           // Try to get user by email
//           const email = formState.email.trim();
//           const userResponse = await axios.get(
//             `http://localhost:9091/api/v1/user/email/${email}`,
//             {
//               headers: {
//                 "Content-Type": "application/json",
//               },
//             }
//           );

//           if (userResponse.data && userResponse.data.id) {
//             const existingUserId = userResponse.data.id;
//             console.log("Found existing user with ID:", existingUserId);
//             setUserId(existingUserId);
//             setUserData(userDataPayload);
//             return existingUserId;
//           }
//         } catch (fetchErr) {
//           console.error("Error fetching existing user:", fetchErr);
//           setError(
//             "User already exists but could not retrieve user information."
//           );
//           return false;
//         }
//       }

//       if (err.response?.data?.error) {
//         setError(err.response.data.error);
//       } else if (err.response?.data?.message) {
//         setError(err.response.data.message);
//       } else if (err.message) {
//         setError(err.message);
//       } else {
//         setError(
//           "Failed to create user. Please check your information and try again."
//         );
//       }
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Single endpoint that accepts both user and assessment data
//   const submitCombinedData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Prepare both user and assessment data
//       const userDataPayload = {
//         username:
//           formState.username ||
//           `${formState.firstName}${formState.lastName}`
//             .toLowerCase()
//             .replace(/\s+/g, ""),
//         email: formState.email ? formState.email.trim() : "",
//         password: formState.password || "defaultPassword123",
//         roleId: formState.roleId || 4,
//         firstName: formState.firstName ? formState.firstName.trim() : "",
//         lastName: formState.lastName ? formState.lastName.trim() : "",
//         phone: formState.phone ? formState.phone.trim() : "",
//         address: formState.address ? formState.address.trim() : "",
//         message: formState.message ? formState.message.trim() : "",
//       };

//       const assessmentData = prepareAssessmentData();

//       // Create combined payload matching your JSON structure
//       const combinedPayload = {
//         user: userDataPayload,
//         assessment: assessmentData,
//       };

//       console.log("Submitting combined data:", combinedPayload);

//       // Use the correct endpoint - your controller is at /api/v1/user-assessment/create
//       const response = await axios.post(
//         "http://localhost:9091/api/v1/user-assessment/create",
//         combinedPayload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("Combined submission response:", response.data);

//       if (response.status === 200 || response.status === 201) {
//         console.log("Combined data submitted successfully");
//         return true;
//       } else {
//         setError("Unexpected response from server");
//         return false;
//       }
//     } catch (err) {
//       console.error("Error in combined submission:", err);

//       // For debugging, log the exact error
//       console.error("Error details:", {
//         message: err.message,
//         response: err.response?.data,
//         status: err.response?.status,
//       });

//       const errorMessage =
//         err.response?.data?.error ||
//         err.response?.data?.message ||
//         err.message ||
//         "Failed to submit data";
//       setError(errorMessage);
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Form submission started");
//     console.log("Current form state:", formState);

//     // Check if questions are loaded
//     if (fetchingQuestions) {
//       setError("Please wait while we load the questionnaire...");
//       return;
//     }

//     if (allSteps.length === 0) {
//       setError("No questionnaire sections available. Please try again later.");
//       return;
//     }

//     // Validate all required fields before submission
//     if (!validateCurrentStep()) {
//       return;
//     }

//     if (currentStep === allSteps.length - 1) {
//       // Use combined submission
//       const success = await submitCombinedData();
//       if (success) {
//         console.log("Form completed successfully!");
//         setSuccess(true);

//         // Show success message for 5 seconds
//         setTimeout(() => {
//           setSuccess(false);
//         }, 5000);

//         // Reset form after successful submission
//         const resetState = {
//           username: "",
//           email: "",
//           password: "defaultPassword123",
//           roleId: 4,
//           firstName: "",
//           lastName: "",
//           phone: "",
//           address: "",
//           message: "",
//         };

//         // Add dynamic fields from fetched sections
//         formSections.forEach((section) => {
//           if (section.content?.fields) {
//             section.content.fields.forEach((field) => {
//               resetState[field.id] = "";
//               if (field.options && field.options.includes("Other")) {
//                 resetState[`${field.id}-other`] = "";
//               }
//             });
//           }
//         });

//         setFormState(resetState);
//         setCurrentStep(0);
//         setUserId(null);
//         setUserData(null);
//         setShowOtherInputs({});
//         setCompletedSteps([]);
//       }
//     }
//   };

//   const nextStep = async () => {
//     // Check if questions are loaded
//     if (fetchingQuestions) {
//       setError("Please wait while we load the questionnaire...");
//       return;
//     }

//     // Validate current step before proceeding
//     if (!validateCurrentStep()) {
//       return;
//     }

//     if (currentStep === 0) {
//       // Submit user data on first step
//       console.log("Moving to next step, submitting user data first...");
//       console.log("Form data before submission:", {
//         firstName: formState.firstName,
//         lastName: formState.lastName,
//         email: formState.email,
//         phone: formState.phone,
//         address: formState.address,
//       });

//       const userId = await submitUserData();
//       if (!userId) {
//         console.log("User data submission failed, not proceeding to next step");
//         return;
//       }
//       console.log("User data submitted successfully, proceeding to next step");
//     }

//     if (currentStep < allSteps.length - 1) {
//       setCompletedSteps((prev) => [...prev, currentStep]);
//       setCurrentStep((prev) => prev + 1);
//       setError(null);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 0) {
//       setCurrentStep((prev) => prev - 1);
//       setError(null);
//     }
//   };

//   const goToStep = (stepIndex) => {
//     if (completedSteps.includes(stepIndex) || stepIndex === currentStep) {
//       setCurrentStep(stepIndex);
//       setError(null);
//     }
//   };

//   const isStepCompleted = (stepIndex) => {
//     return completedSteps.includes(stepIndex);
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.5,
//       },
//     },
//   };

//   const stepVariants = {
//     hidden: {
//       opacity: 0,
//       x: 50,
//     },
//     visible: {
//       opacity: 1,
//       x: 0,
//       transition: {
//         duration: 0.4,
//         ease: "easeOut",
//       },
//     },
//     exit: {
//       opacity: 0,
//       x: -50,
//       transition: {
//         duration: 0.3,
//       },
//     },
//   };

//   const renderField = (field) => {
//     const fieldValue = formState[field.id] || "";

//     switch (field.type) {
//       case "text":
//       case "email":
//       case "tel":
//         return (
//           <input
//             type={field.type}
//             id={field.id}
//             placeholder={field.placeholder || ""}
//             className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
//             onChange={(e) => handleInputChange(field.id, e.target.value)}
//             value={fieldValue}
//             required={field.required !== false}
//           />
//         );

//       case "textarea":
//         return (
//           <textarea
//             id={field.id}
//             rows={field.rows || 3}
//             className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
//             onChange={(e) => handleInputChange(field.id, e.target.value)}
//             value={fieldValue}
//             required={field.required !== false}
//           ></textarea>
//         );

//       case "select":
//         return (
//           <div>
//             <select
//               id={field.id}
//               className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
//               onChange={(e) => handleInputChange(field.id, e.target.value)}
//               value={fieldValue}
//               required={field.required !== false}
//             >
//               <option value="">Select an option</option>
//               {field.options?.map((option, index) => {
//                 if (typeof option === "object") {
//                   return (
//                     <option
//                       key={index}
//                       value={option.value || option}
//                       disabled={option.disabled}
//                     >
//                       {option.label || option}
//                     </option>
//                   );
//                 } else {
//                   return (
//                     <option key={index} value={option}>
//                       {option}
//                     </option>
//                   );
//                 }
//               })}
//             </select>
//             {showOtherInputs[field.id] && (
//               <input
//                 type="text"
//                 id={`${field.id}-other`}
//                 className="w-full p-3 rounded border border-gray-300 mt-2 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
//                 placeholder="Please specify..."
//                 onChange={(e) =>
//                   handleInputChange(`${field.id}-other`, e.target.value)
//                 }
//                 value={formState[`${field.id}-other`] || ""}
//                 required={field.required !== false}
//               />
//             )}
//           </div>
//         );

//       default:
//         return (
//           <input
//             type="text"
//             id={field.id}
//             placeholder={field.placeholder || ""}
//             className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
//             onChange={(e) => handleInputChange(field.id, e.target.value)}
//             value={fieldValue}
//             required={field.required !== false}
//           />
//         );
//     }
//   };

//   const renderProgressBar = () => {
//     if (allSteps.length === 0) return null;

//     return (
//       <div className="mb-8">
//         {/* Desktop Progress Bar */}
//         <div className="hidden md:flex justify-between items-center mb-4">
//           {allSteps.map((section, index) => (
//             <div key={index} className="flex flex-col items-center flex-1">
//               <button
//                 onClick={() => goToStep(index)}
//                 className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all duration-300 ${
//                   index === currentStep
//                     ? "bg-blue-600 text-white scale-110"
//                     : isStepCompleted(index)
//                     ? "bg-green-500 text-white"
//                     : "bg-gray-300 text-gray-600"
//                 } ${
//                   completedSteps.includes(index) || index === currentStep
//                     ? "cursor-pointer"
//                     : "cursor-not-allowed"
//                 }`}
//               >
//                 {isStepCompleted(index) ? "✓" : index + 1}
//               </button>
//               <span
//                 className={`text-xs mt-2 text-center ${
//                   index === currentStep
//                     ? "text-blue-600 font-semibold"
//                     : isStepCompleted(index)
//                     ? "text-green-600"
//                     : "text-gray-500"
//                 }`}
//               >
//                 {section.title.replace("Step", "").trim()}
//               </span>
//             </div>
//           ))}
//         </div>

//         {/* Mobile Progress Bar */}
//         <div className="md:hidden mb-4">
//           <div className="flex justify-between items-center mb-2">
//             <span className="text-sm font-semibold text-gray-700">
//               Step {currentStep + 1} of {allSteps.length}
//             </span>
//             <span className="text-sm text-gray-500">
//               {Math.round(((currentStep + 1) / allSteps.length) * 100)}%
//               Complete
//             </span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <motion.div
//               className="bg-blue-600 h-2 rounded-full transition-all duration-500"
//               initial={{ width: "0%" }}
//               animate={{
//                 width: `${((currentStep + 1) / allSteps.length) * 100}%`,
//               }}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const currentSection = allSteps[currentStep] || {};

//   if (fetchingQuestions) {
//     return (
//       <section id="booking" className="py-20 bg-gray-50">
//         <div className="container mx-auto px-4 text-center">
//           <div className="flex justify-center items-center h-64">
//             <div className="text-xl text-gray-600">
//               Loading questionnaire...
//             </div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section id="booking" className="py-20 bg-gray-50">
//       <div className="container mx-auto px-4">
//         <motion.div
//           className="text-center mb-12"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//         >
//           <h2 className="text-3xl md:text-4xl font-semibold font-montserrat text-gray-800">
//             Let's Connect: Your First Step to Freedom
//           </h2>
//           <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
//             Take the first step by providing your details below, or use our
//             comprehensive assessment form to begin your transformation journey
//             immediately.
//           </p>
//         </motion.div>

//         {/* Simple contact section - keep as is */}
//         <motion.div
//           className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-12"
//           variants={containerVariants}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//         >
//           <motion.div
//             variants={itemVariants}
//             className="bg-white p-8 rounded-lg shadow-md"
//           >
//             <h3 className="text-2xl font-semibold text-blue-800 mb-6">
//               Contact Information
//             </h3>
//             <div className="space-y-4 text-gray-700">
//               <p>
//                 <strong>Address:</strong>
//                 <br />
//                 123 Therapy Street, Healing City, HC 12345
//               </p>
//               <p>
//                 <strong>Phone:</strong>
//                 <br />
//                 <a
//                   href="tel:+1234567890"
//                   className="text-green-600 hover:underline"
//                 >
//                   (123) 456-7890
//                 </a>
//               </p>
//               <p>
//                 <strong>Email:</strong>
//                 <br />
//                 <a
//                   href="mailto:info@therapycenter.com"
//                   className="text-green-600 hover:underline"
//                 >
//                   info@therapycenter.com
//                 </a>
//               </p>
//               <p>
//                 <strong>Hours:</strong>
//                 <br />
//                 Mon-Fri: 9am-6pm, Sat: 10am-2pm
//               </p>
//             </div>
//           </motion.div>

//           <motion.div variants={itemVariants}>
//             <form className="space-y-6">
//               <div>
//                 <label
//                   htmlFor="contact-name"
//                   className="block mb-2 font-semibold"
//                 >
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   id="contact-name"
//                   className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="contact-email"
//                   className="block mb-2 font-semibold"
//                 >
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="contact-email"
//                   className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="contact-message"
//                   className="block mb-2 font-semibold"
//                 >
//                   Message
//                 </label>
//                 <textarea
//                   id="contact-message"
//                   rows="5"
//                   className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
//                 ></textarea>
//               </div>
//               <div className="text-right">
//                 <motion.button
//                   type="submit"
//                   className="bg-gray-600 text-white font-montserrat font-semibold uppercase px-8 py-3 rounded-full hover:bg-opacity-90 transition-transform hover:scale-105"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   Send Message
//                 </motion.button>
//               </div>
//             </form>
//           </motion.div>
//         </motion.div>

//         <motion.h2
//           className="text-3xl md:text-4xl font-semibold font-montserrat text-gray-800 text-center mb-8"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//         >
//           Ready to Reclaim Your Life? Your Transformation Starts Here.
//         </motion.h2>

//         <motion.div
//           className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl"
//           variants={containerVariants}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//         >
//           {allSteps.length === 0 ? (
//             <div className="text-center py-8">
//               <div className="text-red-500 mb-4">
//                 No questionnaire available
//               </div>
//               <button
//                 onClick={fetchQuestionnaireData}
//                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//               >
//                 Reload Questionnaire
//               </button>
//             </div>
//           ) : (
//             <>
//               {renderProgressBar()}

//               <form onSubmit={handleSubmit}>
//                 <AnimatePresence mode="wait">
//                   <motion.fieldset
//                     key={currentStep}
//                     variants={stepVariants}
//                     initial="hidden"
//                     animate="visible"
//                     exit="exit"
//                     className="mb-8"
//                   >
//                     <legend className="text-2xl font-semibold text-gray-700 border-b-2 border-yellow-500 pb-2 mb-6 w-full">
//                       {currentSection.title}
//                     </legend>

//                     {currentSection.title ===
//                     "Step 7: Schedule Your Session" ? (
//                       <div className="bg-white p-6 text-center text-gray-500 rounded-lg border">
//                         <p>[Interactive Calendar Widget Placeholder]</p>
//                         <p className="text-xs mt-2">
//                           Select a date and time that works best for you.
//                         </p>
//                       </div>
//                     ) : (
//                       <div
//                         className={`grid grid-cols-1 ${
//                           currentSection.fields?.some(
//                             (f) => f.colSpan === "md:col-span-2"
//                           )
//                             ? "md:grid-cols-2"
//                             : ""
//                         } gap-6`}
//                       >
//                         {currentSection.fields?.map((field, fieldIndex) => (
//                           <div
//                             key={fieldIndex}
//                             className={field.colSpan || "md:col-span-1"}
//                           >
//                             {field.label && (
//                               <label
//                                 htmlFor={field.id}
//                                 className="block mb-2 font-semibold"
//                               >
//                                 {field.label}
//                                 {field.required !== false && (
//                                   <span className="text-red-500 ml-1">*</span>
//                                 )}
//                               </label>
//                             )}
//                             {renderField(field)}
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </motion.fieldset>
//                 </AnimatePresence>

//                 <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//                   <motion.button
//                     type="button"
//                     onClick={prevStep}
//                     className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
//                       currentStep === 0
//                         ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                         : "bg-gray-600 text-white hover:bg-gray-700"
//                     }`}
//                     whileHover={currentStep > 0 ? { scale: 1.05 } : {}}
//                     whileTap={currentStep > 0 ? { scale: 0.95 } : {}}
//                     disabled={currentStep === 0 || loading}
//                   >
//                     ← Previous
//                   </motion.button>

//                   {currentStep === allSteps.length - 1 ? (
//                     <motion.button
//                       type="submit"
//                       disabled={loading}
//                       className={`bg-green-600 text-white font-montserrat font-semibold uppercase px-8 py-3 rounded-full hover:bg-green-700 transition-transform ${
//                         loading
//                           ? "opacity-50 cursor-not-allowed"
//                           : "hover:scale-105"
//                       }`}
//                       whileHover={!loading ? { scale: 1.05 } : {}}
//                       whileTap={!loading ? { scale: 0.95 } : {}}
//                     >
//                       {loading
//                         ? "Processing..."
//                         : "Complete Booking & Begin Transformation"}
//                     </motion.button>
//                   ) : (
//                     <motion.button
//                       type="button"
//                       onClick={nextStep}
//                       disabled={loading}
//                       className={`bg-blue-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-blue-700 transition-transform ${
//                         loading
//                           ? "opacity-50 cursor-not-allowed"
//                           : "hover:scale-105"
//                       }`}
//                       whileHover={!loading ? { scale: 1.05 } : {}}
//                       whileTap={!loading ? { scale: 0.95 } : {}}
//                     >
//                       {loading ? "Saving..." : "Next →"}
//                     </motion.button>
//                   )}
//                 </div>

//                 {/* Status Messages */}
//                 {error && (
//                   <motion.div
//                     className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mt-4"
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <div className="flex items-center">
//                       <svg
//                         className="w-5 h-5 mr-2"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                       <strong>Error:</strong> {error}
//                     </div>
//                   </motion.div>
//                 )}

//                 {success && (
//                   <motion.div
//                     className="p-4 bg-green-100 border border-green-400 text-green-700 rounded mt-4"
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <div className="flex items-center">
//                       <svg
//                         className="w-5 h-5 mr-2"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                       <strong>Success!</strong> Thank you! Your booking has been
//                       completed successfully. We'll contact you shortly.
//                     </div>
//                   </motion.div>
//                 )}

//                 {/* Step Navigation Dots for Mobile */}
//                 <div className="flex justify-center mt-6 md:hidden">
//                   <div className="flex space-x-2">
//                     {allSteps.map((_, index) => (
//                       <button
//                         key={index}
//                         onClick={() => goToStep(index)}
//                         className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                           index === currentStep
//                             ? "bg-blue-600 scale-125"
//                             : isStepCompleted(index)
//                             ? "bg-green-500"
//                             : "bg-gray-300"
//                         }`}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </form>
//             </>
//           )}
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default BookingSection;

// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import formData from "../../constant/Home/formData.json";
// import axios from "axios";

// const BookingSection = () => {
//   const [formState, setFormState] = useState({
//     // Personal information fields for API
//     username: "",
//     email: "",
//     password: "defaultPassword123",
//     roleId: 4,
//     firstName: "",
//     lastName: "",
//     phone: "",
//     address: "",
//     message: "",

//     // Additional form data from other steps
//     ...Object.fromEntries(
//       formData.formSections.flatMap((section) =>
//         section.fields.map((field) => [field.id, ""])
//       )
//     ),
//   });

//   const [showOtherInputs, setShowOtherInputs] = useState({});
//   const [currentStep, setCurrentStep] = useState(0);
//   const [completedSteps, setCompletedSteps] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [userId, setUserId] = useState(null);
//   const [userData, setUserData] = useState(null);

//   // Define all steps including personal information as first step
//   const allSteps = [
//     {
//       title: "Personal Information",
//       description: "Let's start with your basic details",
//       fields: [
//         {
//           id: "firstName",
//           label: "First Name",
//           type: "text",
//           required: true,
//           colSpan: "md:col-span-1",
//         },
//         {
//           id: "lastName",
//           label: "Last Name",
//           type: "text",
//           required: true,
//           colSpan: "md:col-span-1",
//         },
//         {
//           id: "email",
//           label: "Email Address",
//           type: "email",
//           required: true,
//           colSpan: "md:col-span-1",
//         },
//         {
//           id: "phone",
//           label: "Phone Number",
//           type: "tel",
//           required: true,
//           colSpan: "md:col-span-1",
//         },
//         {
//           id: "address",
//           label: "Full Address",
//           type: "textarea",
//           required: true,
//           colSpan: "md:col-span-2",
//         },
//         {
//           id: "message",
//           label: "Additional Message (Optional)",
//           type: "textarea",
//           colSpan: "md:col-span-2",
//         },
//       ],
//     },
//     ...formData.formSections,
//   ];

//   const handleInputChange = (fieldId, value) => {
//     setFormState((prev) => ({
//       ...prev,
//       [fieldId]: value,
//     }));

//     // Auto-generate username from first name and last name
//     if (fieldId === "firstName" || fieldId === "lastName") {
//       const firstName = fieldId === "firstName" ? value : formState.firstName;
//       const lastName = fieldId === "lastName" ? value : formState.lastName;
//       if (firstName && lastName) {
//         const generatedUsername = `${firstName}${lastName}`
//           .toLowerCase()
//           .replace(/\s+/g, "");
//         setFormState((prev) => ({
//           ...prev,
//           username: generatedUsername,
//         }));
//       }
//     }

//     // Handle "Other" option selection
//     if (value === "Other") {
//       setShowOtherInputs((prev) => ({
//         ...prev,
//         [fieldId]: true,
//       }));
//     } else {
//       setShowOtherInputs((prev) => ({
//         ...prev,
//         [fieldId]: false,
//       }));
//       // Clear the "other" field when switching away from "Other"
//       setFormState((prev) => ({
//         ...prev,
//         [`${fieldId}-other`]: "",
//       }));
//     }
//   };

//   // Enhanced function to handle "Other" values properly
//   const getFieldValue = (fieldId) => {
//     const mainValue = formState[fieldId];
//     const otherValue = formState[`${fieldId}-other`];

//     // If main value is "Other" and other value exists, return the other value
//     if (mainValue === "Other" && otherValue && otherValue.trim() !== "") {
//       return otherValue;
//     }

//     // Otherwise return the main value (even if it's "Other" but no other value provided)
//     return mainValue;
//   };

//   // Prepare assessment data according to backend model
//   const prepareAssessmentData = () => {
//     // Map frontend field IDs to backend column names using getFieldValue
//     const assessmentData = {
//       // Step 1: Current Situation Assessment
//       problem: getFieldValue("problem") || null,
//       problemOther: formState["problem-other"] || null,
//       duration: getFieldValue("duration") || null,
//       durationOther: formState["duration-other"] || null,
//       triggersAssessment: getFieldValue("triggers-assessment") || null,
//       triggersAssessmentOther: formState["triggers-assessment-other"] || null,
//       medications: getFieldValue("medications") || null,
//       medicationsOther: formState["medications-other"] || null,

//       // Step 2: Emotional Patterns & Triggers
//       distressIntensifiers: getFieldValue("distress-intensifiers") || null,
//       distressIntensifiersOther:
//         formState["distress-intensifiers-other"] || null,
//       physicalSensations: getFieldValue("physical-sensations") || null,
//       physicalSensationsOther: formState["physical-sensations-other"] || null,
//       negativeThoughts: getFieldValue("negative-thoughts") || null,
//       negativeThoughtsOther: formState["negative-thoughts-other"] || null,

//       // Step 3: Define Your Desired Outcome
//       resolution: getFieldValue("resolution") || null,
//       resolutionOther: formState["resolution-other"] || null,
//       timeline: getFieldValue("timeline") || null,
//       timelineOther: formState["timeline-other"] || null,
//       confidence: getFieldValue("confidence") || null,

//       // Step 4: Deeper Insights
//       happyMemories: getFieldValue("happy-memories") || null,
//       relaxationAids: getFieldValue("relaxation-aids") || null,
//       relaxationAidsOther: formState["relaxation-aids-other"] || null,
//       supportSystem: getFieldValue("support-system") || null,
//       supportSystemOther: formState["support-system-other"] || null,
//       rechargeActivities: getFieldValue("recharge-activities") || null,
//       rechargeActivitiesOther: formState["recharge-activities-other"] || null,

//       // Step 5: Transformation Package
//       package: getFieldValue("package") || null,

//       // Step 6: Location
//       location: getFieldValue("location") || null,

//       // Step 8: Payment Information
//       cardName: formState["card-name"] || null,
//       cardNumber: formState["card-number"] || null,
//       cardExpiry: formState["card-expiry"] || null,
//       cardCvc: formState["card-cvc"] || null,
//     };

//     console.log("Prepared Assessment Data:", assessmentData);
//     return assessmentData;
//   };

//   // Enhanced validation function
//   const validateCurrentStep = () => {
//     const currentStepData = allSteps[currentStep];

//     if (currentStepData.fields) {
//       const missingRequiredFields = currentStepData.fields
//         .filter((field) => field.required)
//         .filter((field) => {
//           const value = formState[field.id];
//           return !value || value.toString().trim() === "";
//         });

//       if (missingRequiredFields.length > 0) {
//         const errorMessage = `Please fill in all required fields: ${missingRequiredFields
//           .map((f) => f.label)
//           .join(", ")}`;
//         setError(errorMessage);
//         return false;
//       }
//     }
//     return true;
//   };

//   // Submit user data to create user
//   const submitUserData = async () => {
//     const userDataPayload = {
//       username:
//         formState.username ||
//         `${formState.firstName}${formState.lastName}`
//           .toLowerCase()
//           .replace(/\s+/g, ""),
//       email: formState.email ? formState.email.trim() : "",
//       password: formState.password || "defaultPassword123",
//       roleId: formState.roleId || 4,
//       firstName: formState.firstName ? formState.firstName.trim() : "",
//       lastName: formState.lastName ? formState.lastName.trim() : "",
//       phone: formState.phone ? formState.phone.trim() : "",
//       address: formState.address ? formState.address.trim() : "",
//       message: formState.message ? formState.message.trim() : "",
//     };

//     // Validation
//     if (
//       !userDataPayload.firstName.trim() ||
//       !userDataPayload.lastName.trim() ||
//       !userDataPayload.email.trim()
//     ) {
//       const missingFields = [];
//       if (!userDataPayload.firstName.trim()) missingFields.push("First Name");
//       if (!userDataPayload.lastName.trim()) missingFields.push("Last Name");
//       if (!userDataPayload.email.trim()) missingFields.push("Email");
//       setError(
//         `Please fill in all required fields: ${missingFields.join(", ")}`
//       );
//       return false;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(userDataPayload.email)) {
//       setError("Please enter a valid email address");
//       return false;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       console.log("Submitting user data to /user/create:", userDataPayload);

//       // Try to create user
//       const response = await axios.post(
//         "http://localhost:9091/api/v1/user/create",
//         userDataPayload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("User creation response:", response.data);

//       if (response.status === 200 || response.status === 201) {
//         const newUserId =
//           response.data.id || response.data.userId || response.data.data?.id;
//         setUserId(newUserId);
//         setUserData(userDataPayload);
//         console.log("User created successfully. User ID:", newUserId);
//         return newUserId;
//       } else {
//         setError("Unexpected response from server");
//         return false;
//       }
//     } catch (err) {
//       console.error("Error creating user:", err);
//       console.error("Error response data:", err.response?.data);
//       console.error("Error response status:", err.response?.status);

//       // If user already exists, try to get existing user ID
//       if (
//         err.response?.status === 400 &&
//         err.response?.data?.error?.includes("already exists")
//       ) {
//         console.log("User already exists, trying to fetch existing user...");

//         try {
//           // Try to get user by email
//           const email = formState.email.trim();
//           const userResponse = await axios.get(
//             `http://localhost:9091/api/v1/user/email/${email}`,
//             {
//               headers: {
//                 "Content-Type": "application/json",
//               },
//             }
//           );

//           if (userResponse.data && userResponse.data.id) {
//             const existingUserId = userResponse.data.id;
//             console.log("Found existing user with ID:", existingUserId);
//             setUserId(existingUserId);
//             setUserData(userDataPayload);
//             return existingUserId;
//           }
//         } catch (fetchErr) {
//           console.error("Error fetching existing user:", fetchErr);
//           setError(
//             "User already exists but could not retrieve user information."
//           );
//           return false;
//         }
//       }

//       if (err.response?.data?.error) {
//         setError(err.response.data.error);
//       } else if (err.response?.data?.message) {
//         setError(err.response.data.message);
//       } else if (err.message) {
//         setError(err.message);
//       } else {
//         setError(
//           "Failed to create user. Please check your information and try again."
//         );
//       }
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Single endpoint that accepts both user and assessment data
//   const submitCombinedData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Prepare both user and assessment data
//       const userDataPayload = {
//         username:
//           formState.username ||
//           `${formState.firstName}${formState.lastName}`
//             .toLowerCase()
//             .replace(/\s+/g, ""),
//         email: formState.email ? formState.email.trim() : "",
//         password: formState.password || "defaultPassword123",
//         roleId: formState.roleId || 4,
//         firstName: formState.firstName ? formState.firstName.trim() : "",
//         lastName: formState.lastName ? formState.lastName.trim() : "",
//         phone: formState.phone ? formState.phone.trim() : "",
//         address: formState.address ? formState.address.trim() : "",
//         message: formState.message ? formState.message.trim() : "",
//       };

//       const assessmentData = prepareAssessmentData();

//       // Create combined payload matching your JSON structure
//       const combinedPayload = {
//         user: userDataPayload,
//         assessment: assessmentData,
//       };

//       console.log("Submitting combined data:", combinedPayload);

//       // Use the correct endpoint - your controller is at /api/v1/user-assessment/create
//       const response = await axios.post(
//         "http://localhost:9091/api/v1/user-assessment/create",
//         combinedPayload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("Combined submission response:", response.data);

//       if (response.status === 200 || response.status === 201) {
//         console.log("Combined data submitted successfully");
//         return true;
//       } else {
//         setError("Unexpected response from server");
//         return false;
//       }
//     } catch (err) {
//       console.error("Error in combined submission:", err);

//       // For debugging, log the exact error
//       console.error("Error details:", {
//         message: err.message,
//         response: err.response?.data,
//         status: err.response?.status,
//       });

//       const errorMessage =
//         err.response?.data?.error ||
//         err.response?.data?.message ||
//         err.message ||
//         "Failed to submit data";
//       setError(errorMessage);
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Submit all data - user creation first, then assessment
//   const submitAllData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Step 1: Create user (if not already created)
//       let userIdentifier = userId;
//       let userInfo = userData;

//       if (!userIdentifier) {
//         console.log("No user ID found, creating new user...");
//         userIdentifier = await submitUserData();
//         if (!userIdentifier) {
//           console.log("User creation failed");
//           return false;
//         }
//         console.log("User created with ID:", userIdentifier);
//         userInfo = {
//           email: formState.email,
//           firstName: formState.firstName,
//           lastName: formState.lastName,
//           phone: formState.phone,
//           address: formState.address,
//           message: formState.message,
//         };
//       } else {
//         console.log("Using existing user ID:", userIdentifier);
//         // Ensure we have user info
//         userInfo = userInfo || {
//           email: formState.email,
//           firstName: formState.firstName,
//           lastName: formState.lastName,
//           phone: formState.phone,
//           address: formState.address,
//           message: formState.message,
//         };
//       }

//       // Step 2: Submit assessment data with user info
//       console.log("Submitting assessment data for user:", userIdentifier);
//       const assessmentSuccess = await submitAssessmentData(
//         userIdentifier,
//         userInfo
//       );
//       if (!assessmentSuccess) {
//         console.log("Assessment submission failed");
//         return false;
//       }

//       console.log("Both user and assessment submitted successfully");
//       return true;
//     } catch (err) {
//       console.error("Error in final submission:", err);
//       setError("Failed to complete submission. Please try again.");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Form submission started");
//     console.log("Current form state:", formState);

//     // Validate all required fields before submission
//     if (!validateCurrentStep()) {
//       return;
//     }

//     if (currentStep === allSteps.length - 1) {
//       // Use combined submission
//       const success = await submitCombinedData();
//       if (success) {
//         console.log("Form completed successfully!");
//         setSuccess(true);

//         // Show success message for 5 seconds
//         setTimeout(() => {
//           setSuccess(false);
//         }, 5000);

//         // Reset form after successful submission
//         setFormState({
//           username: "",
//           email: "",
//           password: "defaultPassword123",
//           roleId: 4,
//           firstName: "",
//           lastName: "",
//           phone: "",
//           address: "",
//           message: "",
//           ...Object.fromEntries(
//             formData.formSections.flatMap((section) =>
//               section.fields.map((field) => [field.id, ""])
//             )
//           ),
//         });
//         setCurrentStep(0);
//         setUserId(null);
//         setUserData(null);
//         setShowOtherInputs({});
//         setCompletedSteps([]);
//       }
//     }
//   };

//   const nextStep = async () => {
//     // Validate current step before proceeding
//     if (!validateCurrentStep()) {
//       return;
//     }

//     if (currentStep === 0) {
//       // Submit user data on first step
//       console.log("Moving to next step, submitting user data first...");
//       console.log("Form data before submission:", {
//         firstName: formState.firstName,
//         lastName: formState.lastName,
//         email: formState.email,
//         phone: formState.phone,
//         address: formState.address,
//       });

//       const userId = await submitUserData();
//       if (!userId) {
//         console.log("User data submission failed, not proceeding to next step");
//         return;
//       }
//       console.log("User data submitted successfully, proceeding to next step");
//     }

//     if (currentStep < allSteps.length - 1) {
//       setCompletedSteps((prev) => [...prev, currentStep]);
//       setCurrentStep((prev) => prev + 1);
//       setError(null);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 0) {
//       setCurrentStep((prev) => prev - 1);
//       setError(null);
//     }
//   };

//   const goToStep = (stepIndex) => {
//     if (completedSteps.includes(stepIndex) || stepIndex === currentStep) {
//       setCurrentStep(stepIndex);
//       setError(null);
//     }
//   };

//   const isStepCompleted = (stepIndex) => {
//     return completedSteps.includes(stepIndex);
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.5,
//       },
//     },
//   };

//   const stepVariants = {
//     hidden: {
//       opacity: 0,
//       x: 50,
//     },
//     visible: {
//       opacity: 1,
//       x: 0,
//       transition: {
//         duration: 0.4,
//         ease: "easeOut",
//       },
//     },
//     exit: {
//       opacity: 0,
//       x: -50,
//       transition: {
//         duration: 0.3,
//       },
//     },
//   };

//   const renderField = (field) => {
//     const fieldValue = formState[field.id] || "";

//     switch (field.type) {
//       case "text":
//       case "email":
//       case "tel":
//         return (
//           <input
//             type={field.type}
//             id={field.id}
//             placeholder={field.placeholder || ""}
//             className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
//             onChange={(e) => handleInputChange(field.id, e.target.value)}
//             value={fieldValue}
//             required={field.required}
//           />
//         );

//       case "textarea":
//         return (
//           <textarea
//             id={field.id}
//             rows={field.rows || 3}
//             className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
//             onChange={(e) => handleInputChange(field.id, e.target.value)}
//             value={fieldValue}
//             required={field.required}
//           ></textarea>
//         );

//       case "select":
//         return (
//           <div>
//             <select
//               id={field.id}
//               className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
//               onChange={(e) => handleInputChange(field.id, e.target.value)}
//               value={fieldValue}
//               required={field.required}
//             >
//               <option value="">Select an option</option>
//               {field.options.map((option, index) =>
//                 typeof option === "object" ? (
//                   <option
//                     key={index}
//                     value={option.value}
//                     disabled={option.disabled}
//                   >
//                     {option.label}
//                   </option>
//                 ) : (
//                   <option key={index} value={option}>
//                     {option}
//                   </option>
//                 )
//               )}
//             </select>
//             {showOtherInputs[field.id] && (
//               <input
//                 type="text"
//                 id={`${field.id}-other`}
//                 className="w-full p-3 rounded border border-gray-300 mt-2 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
//                 placeholder="Please specify..."
//                 onChange={(e) =>
//                   handleInputChange(`${field.id}-other`, e.target.value)
//                 }
//                 value={formState[`${field.id}-other`] || ""}
//                 required={field.required}
//               />
//             )}
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   const renderProgressBar = () => {
//     return (
//       <div className="mb-8">
//         {/* Desktop Progress Bar */}
//         <div className="hidden md:flex justify-between items-center mb-4">
//           {allSteps.map((section, index) => (
//             <div key={index} className="flex flex-col items-center flex-1">
//               <button
//                 onClick={() => goToStep(index)}
//                 className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all duration-300 ${
//                   index === currentStep
//                     ? "bg-blue-600 text-white scale-110"
//                     : isStepCompleted(index)
//                     ? "bg-green-500 text-white"
//                     : "bg-gray-300 text-gray-600"
//                 } ${
//                   completedSteps.includes(index) || index === currentStep
//                     ? "cursor-pointer"
//                     : "cursor-not-allowed"
//                 }`}
//               >
//                 {isStepCompleted(index) ? "✓" : index + 1}
//               </button>
//               <span
//                 className={`text-xs mt-2 text-center ${
//                   index === currentStep
//                     ? "text-blue-600 font-semibold"
//                     : isStepCompleted(index)
//                     ? "text-green-600"
//                     : "text-gray-500"
//                 }`}
//               >
//                 {section.title.replace("Step", "").trim()}
//               </span>
//             </div>
//           ))}
//         </div>

//         {/* Mobile Progress Bar */}
//         <div className="md:hidden mb-4">
//           <div className="flex justify-between items-center mb-2">
//             <span className="text-sm font-semibold text-gray-700">
//               Step {currentStep + 1} of {allSteps.length}
//             </span>
//             <span className="text-sm text-gray-500">
//               {Math.round(((currentStep + 1) / allSteps.length) * 100)}%
//               Complete
//             </span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <motion.div
//               className="bg-blue-600 h-2 rounded-full transition-all duration-500"
//               initial={{ width: "0%" }}
//               animate={{
//                 width: `${((currentStep + 1) / allSteps.length) * 100}%`,
//               }}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const currentSection = allSteps[currentStep];

//   return (
//     <section id="booking" className="py-20 bg-gray-50">
//       <div className="container mx-auto px-4">
//         <motion.div
//           className="text-center mb-12"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//         >
//           <h2 className="text-3xl md:text-4xl font-semibold font-montserrat text-gray-800">
//             Let's Connect: Your First Step to Freedom
//           </h2>
//           <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
//             Take the first step by providing your details below, or use our
//             comprehensive assessment form to begin your transformation journey
//             immediately.
//           </p>
//         </motion.div>

//         <motion.div
//           className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-12"
//           variants={containerVariants}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//         >
//           <motion.div
//             variants={itemVariants}
//             className="bg-white p-8 rounded-lg shadow-md"
//           >
//             <h3 className="text-2xl font-semibold text-blue-800 mb-6">
//               Contact Information
//             </h3>
//             <div className="space-y-4 text-gray-700">
//               <p>
//                 <strong>Address:</strong>
//                 <br />
//                 {formData.contactInfo.address}
//               </p>
//               <p>
//                 <strong>Phone:</strong>
//                 <br />
//                 <a
//                   href={`tel:${formData.contactInfo.phone}`}
//                   className="text-green-600 hover:underline"
//                 >
//                   {formData.contactInfo.phone}
//                 </a>
//               </p>
//               <p>
//                 <strong>Email:</strong>
//                 <br />
//                 <a
//                   href={`mailto:${formData.contactInfo.email}`}
//                   className="text-green-600 hover:underline"
//                 >
//                   {formData.contactInfo.email}
//                 </a>
//               </p>
//               <p>
//                 <strong>Hours:</strong>
//                 <br />
//                 {formData.contactInfo.hours}
//               </p>
//             </div>
//           </motion.div>

//           <motion.div variants={itemVariants}>
//             <form className="space-y-6">
//               <div>
//                 <label
//                   htmlFor="contact-name"
//                   className="block mb-2 font-semibold"
//                 >
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   id="contact-name"
//                   className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="contact-email"
//                   className="block mb-2 font-semibold"
//                 >
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="contact-email"
//                   className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="contact-message"
//                   className="block mb-2 font-semibold"
//                 >
//                   Message
//                 </label>
//                 <textarea
//                   id="contact-message"
//                   rows="5"
//                   className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
//                 ></textarea>
//               </div>
//               <div className="text-right">
//                 <motion.button
//                   type="submit"
//                   className="bg-gray-600 text-white font-montserrat font-semibold uppercase px-8 py-3 rounded-full hover:bg-opacity-90 transition-transform hover:scale-105"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   Send Message
//                 </motion.button>
//               </div>
//             </form>
//           </motion.div>
//         </motion.div>

//         <motion.h2
//           className="text-3xl md:text-4xl font-semibold font-montserrat text-gray-800 text-center mb-8"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//         >
//           Ready to Reclaim Your Life? Your Transformation Starts Here.
//         </motion.h2>

//         <motion.div
//           className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl"
//           variants={containerVariants}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//         >
//           {renderProgressBar()}

//           <form onSubmit={handleSubmit}>
//             <AnimatePresence mode="wait">
//               <motion.fieldset
//                 key={currentStep}
//                 variants={stepVariants}
//                 initial="hidden"
//                 animate="visible"
//                 exit="exit"
//                 className="mb-8"
//               >
//                 <legend className="text-2xl font-semibold text-gray-700 border-b-2 border-yellow-500 pb-2 mb-6 w-full">
//                   {currentSection.title}
//                 </legend>

//                 {currentSection.title === "Step 7: Schedule Your Session" ? (
//                   <div className="bg-white p-6 text-center text-gray-500 rounded-lg border">
//                     <p>[Interactive Calendar Widget Placeholder]</p>
//                     <p className="text-xs mt-2">
//                       Select a date and time that works best for you.
//                     </p>
//                   </div>
//                 ) : (
//                   <div
//                     className={`grid grid-cols-1 ${
//                       currentSection.fields?.some(
//                         (f) => f.colSpan === "md:col-span-2"
//                       )
//                         ? "md:grid-cols-2"
//                         : ""
//                     } gap-6`}
//                   >
//                     {currentSection.fields?.map((field, fieldIndex) => (
//                       <div
//                         key={fieldIndex}
//                         className={field.colSpan || "md:col-span-1"}
//                       >
//                         {field.label && (
//                           <label
//                             htmlFor={field.id}
//                             className="block mb-2 font-semibold"
//                           >
//                             {field.label}
//                             {field.required && (
//                               <span className="text-red-500 ml-1">*</span>
//                             )}
//                           </label>
//                         )}
//                         {renderField(field)}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </motion.fieldset>
//             </AnimatePresence>

//             <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//               <motion.button
//                 type="button"
//                 onClick={prevStep}
//                 className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
//                   currentStep === 0
//                     ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                     : "bg-gray-600 text-white hover:bg-gray-700"
//                 }`}
//                 whileHover={currentStep > 0 ? { scale: 1.05 } : {}}
//                 whileTap={currentStep > 0 ? { scale: 0.95 } : {}}
//                 disabled={currentStep === 0 || loading}
//               >
//                 ← Previous
//               </motion.button>

//               {currentStep === allSteps.length - 1 ? (
//                 <motion.button
//                   type="submit"
//                   disabled={loading}
//                   className={`bg-green-600 text-white font-montserrat font-semibold uppercase px-8 py-3 rounded-full hover:bg-green-700 transition-transform ${
//                     loading
//                       ? "opacity-50 cursor-not-allowed"
//                       : "hover:scale-105"
//                   }`}
//                   whileHover={!loading ? { scale: 1.05 } : {}}
//                   whileTap={!loading ? { scale: 0.95 } : {}}
//                 >
//                   {loading
//                     ? "Processing..."
//                     : "Complete Booking & Begin Transformation"}
//                 </motion.button>
//               ) : (
//                 <motion.button
//                   type="button"
//                   onClick={nextStep}
//                   disabled={loading}
//                   className={`bg-blue-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-blue-700 transition-transform ${
//                     loading
//                       ? "opacity-50 cursor-not-allowed"
//                       : "hover:scale-105"
//                   }`}
//                   whileHover={!loading ? { scale: 1.05 } : {}}
//                   whileTap={!loading ? { scale: 0.95 } : {}}
//                 >
//                   {loading ? "Saving..." : "Next →"}
//                 </motion.button>
//               )}
//             </div>

//             {/* Status Messages */}
//             {error && (
//               <motion.div
//                 className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mt-4"
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="flex items-center">
//                   <svg
//                     className="w-5 h-5 mr-2"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   <strong>Error:</strong> {error}
//                 </div>
//               </motion.div>
//             )}

//             {success && (
//               <motion.div
//                 className="p-4 bg-green-100 border border-green-400 text-green-700 rounded mt-4"
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="flex items-center">
//                   <svg
//                     className="w-5 h-5 mr-2"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   <strong>Success!</strong> Thank you! Your booking has been
//                   completed successfully. We'll contact you shortly.
//                 </div>
//               </motion.div>
//             )}

//             {/* Step Navigation Dots for Mobile */}
//             <div className="flex justify-center mt-6 md:hidden">
//               <div className="flex space-x-2">
//                 {allSteps.map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => goToStep(index)}
//                     className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                       index === currentStep
//                         ? "bg-blue-600 scale-125"
//                         : isStepCompleted(index)
//                         ? "bg-green-500"
//                         : "bg-gray-300"
//                     }`}
//                   />
//                 ))}
//               </div>
//             </div>
//           </form>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default BookingSection;

// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import axiosInstance from "../../services/api";
// import formData from "../../constant/Home/formData.json";

// const BookingSection = () => {
//   const [formState, setFormState] = useState({
//     // Personal information fields for API
//     username: "",
//     email: "",
//     password: "defaultPassword123",
//     roleId: 4,
//     firstName: "",
//     lastName: "",
//     phone: "",
//     address: "",
//     message: "",

//     // Additional form data from other steps
//     ...Object.fromEntries(
//       formData.formSections.flatMap((section) =>
//         section.fields.map((field) => [field.id, ""])
//       )
//     ),
//   });

//   const [showOtherInputs, setShowOtherInputs] = useState({});
//   const [currentStep, setCurrentStep] = useState(0);
//   const [direction, setDirection] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [userId, setUserId] = useState(null);

//   const steps = [
//     {
//       title: "Personal Information",
//       description: "Let's start with your basic details",
//       fields: [
//         { id: "firstName", label: "First Name", type: "text", required: true },
//         { id: "lastName", label: "Last Name", type: "text", required: true },
//         { id: "email", label: "Email", type: "email", required: true },
//         { id: "phone", label: "Phone", type: "tel", required: true },
//         { id: "address", label: "Address", type: "textarea", required: true },
//         { id: "message", label: "Message", type: "textarea" },
//       ],
//     },
//     ...formData.formSections.filter(
//       (section) => section.title !== "Step 7: Schedule Your Session"
//     ),
//     {
//       title: "Schedule Your Session",
//       description: "Choose your preferred time slot",
//     },
//   ];

//   const handleInputChange = (fieldId, value) => {
//     setFormState((prev) => ({
//       ...prev,
//       [fieldId]: value,
//     }));

//     // Auto-generate username from first name and last name
//     if (fieldId === "firstName" || fieldId === "lastName") {
//       const firstName = fieldId === "firstName" ? value : formState.firstName;
//       const lastName = fieldId === "lastName" ? value : formState.lastName;
//       if (firstName && lastName) {
//         const generatedUsername = `${firstName}${lastName}`
//           .toLowerCase()
//           .replace(/\s+/g, "");
//         setFormState((prev) => ({
//           ...prev,
//           username: generatedUsername,
//         }));
//       }
//     }
//   };

//   const handleShowOther = (fieldId, value) => {
//     if (value === "Other") {
//       setShowOtherInputs((prev) => ({
//         ...prev,
//         [fieldId]: true,
//       }));
//     } else {
//       setShowOtherInputs((prev) => ({
//         ...prev,
//         [fieldId]: false,
//       }));
//       // Clear the "other" field when switching away from "Other"
//       setFormState((prev) => ({
//         ...prev,
//         [`${fieldId}-other`]: "",
//       }));
//     }
//   };

//   // Enhanced input change handler for select fields
//   const handleSelectChange = (fieldId, value) => {
//     handleInputChange(fieldId, value);
//     handleShowOther(fieldId, value);
//   };

//   // Submit user data to create user
//   const submitUserData = async () => {
//     const userData = {
//       username: formState.username,
//       email: formState.email,
//       password: formState.password,
//       roleId: formState.roleId,
//       firstName: formState.firstName,
//       lastName: formState.lastName,
//       phone: formState.phone,
//       address: formState.address,
//       message: formState.message,
//     };

//     // Validate required fields
//     if (!userData.firstName || !userData.lastName || !userData.email) {
//       setError(
//         "Please fill in all required fields (First Name, Last Name, and Email)"
//       );
//       return false;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const response = await axiosInstance.post("/v1/user/create", userData);

//       if (response.status === 200 || response.status === 201) {
//         const newUserId = response.data.id || response.data.userId;
//         setUserId(newUserId);
//         setSuccess(true);
//         console.log("User created successfully:", response.data);
//         return newUserId;
//       }
//     } catch (err) {
//       console.error("Error creating user:", err);
//       const errorMessage =
//         err.response?.data?.message ||
//         err.response?.data?.error ||
//         err.message ||
//         "Failed to create user. Please try again.";
//       setError(errorMessage);
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Enhanced function to handle "Other" values properly
//   const getFieldValue = (fieldId) => {
//     const mainValue = formState[fieldId];
//     const otherValue = formState[`${fieldId}-other`];

//     // If main value is "Other" and other value exists, return the other value
//     if (mainValue === "Other" && otherValue && otherValue.trim() !== "") {
//       return otherValue;
//     }

//     // Otherwise return the main value (even if it's "Other" but no other value provided)
//     return mainValue;
//   };

//   // Prepare assessment data according to backend model
//   const prepareAssessmentData = () => {
//     // Map frontend field IDs to backend column names using getFieldValue
//     const assessmentData = {
//       // Step 1: Current Situation Assessment
//       problem: getFieldValue("problem") || null,
//       problemOther: formState["problem-other"] || null,
//       duration: getFieldValue("duration") || null,
//       durationOther: formState["duration-other"] || null,
//       triggersAssessment: getFieldValue("triggers-assessment") || null,
//       triggersAssessmentOther: formState["triggers-assessment-other"] || null,
//       medications: getFieldValue("medications") || null,
//       medicationsOther: formState["medications-other"] || null,

//       // Step 2: Emotional Patterns & Triggers
//       distressIntensifiers: getFieldValue("distress-intensifiers") || null,
//       distressIntensifiersOther:
//         formState["distress-intensifiers-other"] || null,
//       physicalSensations: getFieldValue("physical-sensations") || null,
//       physicalSensationsOther: formState["physical-sensations-other"] || null,
//       negativeThoughts: getFieldValue("negative-thoughts") || null,
//       negativeThoughtsOther: formState["negative-thoughts-other"] || null,

//       // Step 3: Define Your Desired Outcome
//       resolution: getFieldValue("resolution") || null,
//       resolutionOther: formState["resolution-other"] || null,
//       timeline: getFieldValue("timeline") || null,
//       timelineOther: formState["timeline-other"] || null,
//       confidence: getFieldValue("confidence") || null,

//       // Step 4: Deeper Insights
//       happyMemories: getFieldValue("happy-memories") || null,
//       relaxationAids: getFieldValue("relaxation-aids") || null,
//       relaxationAidsOther: formState["relaxation-aids-other"] || null,
//       supportSystem: getFieldValue("support-system") || null,
//       supportSystemOther: formState["support-system-other"] || null,
//       rechargeActivities: getFieldValue("recharge-activities") || null,
//       rechargeActivitiesOther: formState["recharge-activities-other"] || null,

//       // Step 5: Transformation Package
//       package: getFieldValue("package") || null,

//       // Step 6: Location
//       location: getFieldValue("location") || null,

//       // Step 8: Payment Information
//       cardName: formState["card-name"] || null,
//       cardNumber: formState["card-number"] || null,
//       cardExpiry: formState["card-expiry"] || null,
//       cardCvc: formState["card-cvc"] || null,
//     };

//     console.log("Prepared Assessment Data:", assessmentData);
//     return assessmentData;
//   };

//   // Submit assessment data after user is created
//   const submitAssessmentData = async (userId) => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Prepare assessment data according to backend model
//       const assessmentData = prepareAssessmentData();

//       // Prepare data for assessment endpoint
//       const assessmentPayload = {
//         user: {
//           username: formState.username,
//           email: formState.email,
//           password: formState.password,
//           roleId: formState.roleId,
//           firstName: formState.firstName,
//           lastName: formState.lastName,
//           phone: formState.phone,
//           address: formState.address,
//           message: formState.message,
//         },
//         assessment: assessmentData,
//       };

//       console.log(
//         "Submitting to /v1/user-assessment/create:",
//         assessmentPayload
//       );

//       const response = await axiosInstance.post(
//         "/v1/user-assessment/create",
//         assessmentPayload
//       );

//       if (response.status === 200 || response.status === 201) {
//         console.log("Assessment data submitted successfully:", response.data);
//         return true;
//       }
//     } catch (err) {
//       console.error("Error submitting assessment data:", err);
//       console.error("Error details:", err.response?.data);

//       const errorMessage =
//         err.response?.data?.message ||
//         err.response?.data?.error ||
//         err.message ||
//         "Failed to submit assessment information. Please try again.";
//       setError(errorMessage);
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Submit all data - user creation first, then assessment
//   const submitAllData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Step 1: Create user (if not already created)
//       let userIdentifier = userId;
//       if (!userIdentifier) {
//         userIdentifier = await submitUserData();
//         if (!userIdentifier) {
//           return false;
//         }
//       }

//       // Step 2: Submit assessment data
//       const assessmentSuccess = await submitAssessmentData(userIdentifier);
//       if (!assessmentSuccess) {
//         return false;
//       }

//       return true;
//     } catch (err) {
//       console.error("Error in final submission:", err);
//       setError("Failed to complete submission. Please try again.");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (currentStep === steps.length - 1) {
//       // Final submission - submit user first, then assessment
//       const success = await submitAllData();
//       if (success) {
//         console.log("Form completed successfully!");
//         setSuccess(true);

//         // Show success message
//         alert(
//           "Thank you! Your booking has been completed successfully. We'll contact you shortly."
//         );

//         // Reset form after successful submission
//         setFormState({
//           username: "",
//           email: "",
//           password: "defaultPassword123",
//           roleId: 4,
//           firstName: "",
//           lastName: "",
//           phone: "",
//           address: "",
//           message: "",
//           ...Object.fromEntries(
//             formData.formSections.flatMap((section) =>
//               section.fields.map((field) => [field.id, ""])
//             )
//           ),
//         });
//         setCurrentStep(0);
//         setUserId(null);
//         setShowOtherInputs({});
//       }
//     }
//   };

//   const nextStep = async () => {
//     if (currentStep === 0) {
//       // Submit user data on first step
//       const userId = await submitUserData();
//       if (!userId) return;
//     }

//     setDirection(1);
//     setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
//     setError(null);
//   };

//   const prevStep = () => {
//     setDirection(-1);
//     setCurrentStep((prev) => Math.max(prev - 1, 0));
//     setError(null);
//   };

//   const goToStep = (stepIndex) => {
//     setDirection(stepIndex > currentStep ? 1 : -1);
//     setCurrentStep(stepIndex);
//     setError(null);
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.5,
//       },
//     },
//   };

//   const slideVariants = {
//     enter: (direction) => ({
//       x: direction > 0 ? 300 : -300,
//       opacity: 0,
//     }),
//     center: {
//       zIndex: 1,
//       x: 0,
//       opacity: 1,
//     },
//     exit: (direction) => ({
//       zIndex: 0,
//       x: direction < 0 ? 300 : -300,
//       opacity: 0,
//     }),
//   };

//   const renderField = (field) => {
//     switch (field.type) {
//       case "text":
//       case "email":
//       case "tel":
//         return (
//           <input
//             type={field.type}
//             id={field.id}
//             placeholder={field.placeholder || ""}
//             className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
//             onChange={(e) => handleInputChange(field.id, e.target.value)}
//             value={formState[field.id] || ""}
//             required={field.required}
//           />
//         );

//       case "textarea":
//         return (
//           <textarea
//             id={field.id}
//             rows={field.rows || 3}
//             className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
//             onChange={(e) => handleInputChange(field.id, e.target.value)}
//             value={formState[field.id] || ""}
//             required={field.required}
//           ></textarea>
//         );

//       case "select":
//         return (
//           <div>
//             <select
//               id={field.id}
//               className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
//               onChange={(e) => {
//                 handleSelectChange(field.id, e.target.value);
//               }}
//               value={formState[field.id] || ""}
//               required={field.required}
//             >
//               {field.options.map((option, index) =>
//                 typeof option === "object" ? (
//                   <option
//                     key={index}
//                     value={option.value}
//                     disabled={option.disabled}
//                   >
//                     {option.label}
//                   </option>
//                 ) : (
//                   <option key={index} value={option}>
//                     {option}
//                   </option>
//                 )
//               )}
//             </select>
//             {showOtherInputs[field.id] && (
//               <input
//                 type="text"
//                 id={`${field.id}-other`}
//                 className="w-full p-3 rounded border border-gray-300 mt-2 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
//                 placeholder="Please specify..."
//                 onChange={(e) =>
//                   handleInputChange(`${field.id}-other`, e.target.value)
//                 }
//                 value={formState[`${field.id}-other`] || ""}
//                 required={field.required}
//               />
//             )}
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   const renderStepContent = (step, stepIndex) => {
//     if (stepIndex === 0) {
//       // First step - Personal Information
//       return (
//         <div className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {step.fields.slice(0, 4).map((field, index) => (
//               <div
//                 key={index}
//                 className={field.id === "message" ? "md:col-span-2" : ""}
//               >
//                 <label htmlFor={field.id} className="block mb-2 font-semibold">
//                   {field.label}{" "}
//                   {field.required && <span className="text-red-500">*</span>}
//                 </label>
//                 {renderField(field)}
//               </div>
//             ))}
//           </div>
//           <div className="grid grid-cols-1 gap-6">
//             {step.fields.slice(4).map((field, index) => (
//               <div
//                 key={index}
//                 className={field.id === "message" ? "md:col-span-2" : ""}
//               >
//                 <label htmlFor={field.id} className="block mb-2 font-semibold">
//                   {field.label}{" "}
//                   {field.required && <span className="text-red-500">*</span>}
//                 </label>
//                 {renderField(field)}
//               </div>
//             ))}
//           </div>

//           {/* Navigation Buttons for First Step - After Message Box */}
//           <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//             <motion.button
//               type="button"
//               onClick={prevStep}
//               className={`bg-gray-600 text-white font-montserrat font-semibold uppercase px-8 py-3 rounded-full hover:bg-opacity-90 transition-transform ${
//                 currentStep === 0
//                   ? "opacity-50 cursor-not-allowed"
//                   : "hover:scale-105"
//               }`}
//               whileHover={currentStep > 0 ? { scale: 1.05 } : {}}
//               whileTap={currentStep > 0 ? { scale: 0.95 } : {}}
//               disabled={currentStep === 0 || loading}
//             >
//               Previous
//             </motion.button>

//             <motion.button
//               type="button"
//               onClick={nextStep}
//               disabled={loading}
//               className={`bg-green-600 text-white font-montserrat font-semibold uppercase px-8 py-3 rounded-full hover:bg-opacity-90 transition-transform ${
//                 loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
//               }`}
//               whileHover={!loading ? { scale: 1.05 } : {}}
//               whileTap={!loading ? { scale: 0.95 } : {}}
//             >
//               {loading ? "Creating User..." : "Next"}
//             </motion.button>
//           </div>
//         </div>
//       );
//     } else if (stepIndex === steps.length - 1) {
//       // Last step - Schedule Session
//       return (
//         <div className="space-y-6">
//           <div className="bg-white p-6 text-center text-gray-500 rounded-lg border">
//             <p>[Interactive Calendar Widget Placeholder]</p>
//             <p className="text-xs mt-2">
//               Select a date and time that works best for you.
//             </p>
//             <div className="mt-4 p-4 bg-gray-50 rounded">
//               <p className="text-sm text-gray-600">
//                 Your information has been saved. You'll receive a confirmation
//                 email shortly.
//               </p>
//             </div>
//           </div>

//           {/* Navigation Buttons for Last Step */}
//           <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//             <motion.button
//               type="button"
//               onClick={prevStep}
//               className={`bg-gray-600 text-white font-montserrat font-semibold uppercase px-8 py-3 rounded-full hover:bg-opacity-90 transition-transform hover:scale-105`}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               disabled={loading}
//             >
//               Previous
//             </motion.button>

//             <motion.button
//               type="submit"
//               disabled={loading}
//               className={`bg-green-600 text-white font-montserrat font-semibold uppercase px-8 py-3 rounded-full hover:bg-opacity-90 transition-transform ${
//                 loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
//               }`}
//               whileHover={!loading ? { scale: 1.05 } : {}}
//               whileTap={!loading ? { scale: 0.95 } : {}}
//             >
//               {loading ? "Submitting..." : "Complete Booking"}
//             </motion.button>
//           </div>
//         </div>
//       );
//     } else {
//       // Middle steps - Form sections
//       return (
//         <div className="space-y-6">
//           <div
//             className={`grid grid-cols-1 ${
//               step.fields.some((f) => f.colSpan === "md:col-span-2")
//                 ? "md:grid-cols-2"
//                 : ""
//             } gap-6`}
//           >
//             {step.fields.map((field, fieldIndex) => (
//               <div
//                 key={fieldIndex}
//                 className={field.colSpan || "md:col-span-1"}
//               >
//                 {field.label && (
//                   <label
//                     htmlFor={field.id}
//                     className="block mb-2 font-semibold"
//                   >
//                     {field.label}
//                   </label>
//                 )}
//                 {renderField(field)}
//               </div>
//             ))}
//           </div>

//           {/* Navigation Buttons for Form Steps */}
//           <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//             <motion.button
//               type="button"
//               onClick={prevStep}
//               className={`bg-gray-600 text-white font-montserrat font-semibold uppercase px-8 py-3 rounded-full hover:bg-opacity-90 transition-transform hover:scale-105`}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               disabled={loading}
//             >
//               Previous
//             </motion.button>

//             <motion.button
//               type="button"
//               onClick={nextStep}
//               disabled={loading}
//               className={`bg-green-600 text-white font-montserrat font-semibold uppercase px-8 py-3 rounded-full hover:bg-opacity-90 transition-transform ${
//                 loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
//               }`}
//               whileHover={!loading ? { scale: 1.05 } : {}}
//               whileTap={!loading ? { scale: 0.95 } : {}}
//             >
//               {loading ? "Saving..." : "Next"}
//             </motion.button>
//           </div>
//         </div>
//       );
//     }
//   };

//   return (
//     <section id="booking" className="py-20 bg-gray-50">
//       <div className="container mx-auto px-4">
//         <motion.h2
//           className="text-3xl md:text-4xl font-semibold font-montserrat text-gray-800 text-center mb-8"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//         >
//           Ready to Reclaim Your Life? Your Transformation Starts Here.
//         </motion.h2>

//         <motion.div
//           className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl max-h-[600px] overflow-y-auto "
//           variants={containerVariants}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//         >
//           {/* Progress Bar */}
//           <div className="mb-8">
//             <div className="flex justify-between items-center mb-4">
//               {steps.map((step, index) => (
//                 <React.Fragment key={index}>
//                   <button
//                     onClick={() => goToStep(index)}
//                     className={`flex flex-col items-center ${
//                       index <= currentStep ? "text-green-600" : "text-gray-400"
//                     } transition-colors`}
//                   >
//                     <div
//                       className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
//                         index <= currentStep
//                           ? "bg-green-600 border-green-600 text-white"
//                           : "border-gray-300"
//                       } font-semibold text-sm`}
//                     >
//                       {index + 1}
//                     </div>
//                     <span className="text-xs mt-2 text-center max-w-20">
//                       {step.title.replace(/^Step \d+: /, "").split(" ")[0]}
//                     </span>
//                   </button>
//                   {index < steps.length - 1 && (
//                     <div
//                       className={`flex-1 h-1 mx-2 ${
//                         index < currentStep ? "bg-green-600" : "bg-gray-300"
//                       }`}
//                     />
//                   )}
//                 </React.Fragment>
//               ))}
//             </div>
//           </div>

//           {/* Step Content */}
//           <form onSubmit={handleSubmit}>
//             <div className="relative min-h-[400px]">
//               <AnimatePresence custom={direction} mode="wait">
//                 <motion.div
//                   key={currentStep}
//                   custom={direction}
//                   variants={slideVariants}
//                   initial="enter"
//                   animate="center"
//                   exit="exit"
//                   transition={{
//                     x: { type: "spring", stiffness: 300, damping: 30 },
//                     opacity: { duration: 0.2 },
//                   }}
//                   className="absolute inset-0"
//                 >
//                   <div className="mb-8">
//                     <h3 className="text-2xl font-semibold text-gray-700 border-b-2 border-yellow-500 pb-2 mb-6">
//                       {steps[currentStep].title}
//                     </h3>
//                     {steps[currentStep].description && (
//                       <p className="text-gray-600 mb-6">
//                         {steps[currentStep].description}
//                       </p>
//                     )}
//                     {renderStepContent(steps[currentStep], currentStep)}
//                   </div>
//                 </motion.div>
//               </AnimatePresence>
//             </div>

//             {/* Status Messages */}
//             {error && (
//               <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
//                 {error}
//               </div>
//             )}
//             {success && currentStep === steps.length - 1 && (
//               <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded mb-4">
//                 Thank you! Your booking has been completed successfully. We'll
//                 contact you shortly.
//               </div>
//             )}
//           </form>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default BookingSection;

// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import axiosInstance from "../../services/api";
// import formData from "../../constant/Home/formData.json";

// const BookingSection = () => {
//   const [formState, setFormState] = useState({
//     // Personal information fields for API
//     username: "",
//     email: "",
//     password: "defaultPassword123",
//     roleId: 4,
//     firstName: "",
//     lastName: "",
//     phone: "",
//     address: "",
//     message: "",

//     // Additional form data from other steps
//     ...Object.fromEntries(
//       formData.formSections.flatMap((section) =>
//         section.fields.map((field) => [field.id, ""])
//       )
//     ),
//   });

//   const [showOtherInputs, setShowOtherInputs] = useState({});
//   const [currentStep, setCurrentStep] = useState(0);
//   const [direction, setDirection] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [userId, setUserId] = useState(null);

//   const steps = [
//     {
//       title: "Personal Information",
//       description: "Let's start with your basic details",
//       fields: [
//         { id: "firstName", label: "First Name", type: "text", required: true },
//         { id: "lastName", label: "Last Name", type: "text", required: true },
//         { id: "email", label: "Email", type: "email", required: true },
//         { id: "phone", label: "Phone", type: "tel", required: true },
//         { id: "address", label: "Address", type: "textarea", required: true },
//         { id: "message", label: "Message", type: "textarea" },
//       ],
//     },
//     ...formData.formSections.filter(
//       (section) => section.title !== "Step 7: Schedule Your Session"
//     ),
//     {
//       title: "Schedule Your Session",
//       description: "Choose your preferred time slot",
//     },
//   ];

//   const handleInputChange = (fieldId, value) => {
//     setFormState((prev) => ({
//       ...prev,
//       [fieldId]: value,
//     }));

//     // Auto-generate username from first name and last name
//     if (fieldId === "firstName" || fieldId === "lastName") {
//       const firstName = fieldId === "firstName" ? value : formState.firstName;
//       const lastName = fieldId === "lastName" ? value : formState.lastName;
//       if (firstName && lastName) {
//         const generatedUsername = `${firstName}${lastName}`
//           .toLowerCase()
//           .replace(/\s+/g, "");
//         setFormState((prev) => ({
//           ...prev,
//           username: generatedUsername,
//         }));
//       }
//     }
//   };

//   const handleShowOther = (fieldId, value) => {
//     if (value === "Other") {
//       setShowOtherInputs((prev) => ({
//         ...prev,
//         [fieldId]: true,
//       }));
//     } else {
//       setShowOtherInputs((prev) => ({
//         ...prev,
//         [fieldId]: false,
//       }));
//     }
//   };

//   // Submit user data to create user
//   const submitUserData = async () => {
//     const userData = {
//       username: formState.username,
//       email: formState.email,
//       password: formState.password,
//       roleId: formState.roleId,
//       firstName: formState.firstName,
//       lastName: formState.lastName,
//       phone: formState.phone,
//       address: formState.address,
//       message: formState.message,
//     };

//     // Validate required fields
//     if (!userData.firstName || !userData.lastName || !userData.email) {
//       setError(
//         "Please fill in all required fields (First Name, Last Name, and Email)"
//       );
//       return false;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const response = await axiosInstance.post("/v1/user/create", userData);

//       if (response.status === 200 || response.status === 201) {
//         const newUserId = response.data.id || response.data.userId;
//         setUserId(newUserId);
//         setSuccess(true);
//         console.log("User created successfully:", response.data);
//         return newUserId;
//       }
//     } catch (err) {
//       console.error("Error creating user:", err);
//       const errorMessage =
//         err.response?.data?.message ||
//         err.response?.data?.error ||
//         err.message ||
//         "Failed to create user. Please try again.";
//       setError(errorMessage);
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Prepare assessment data according to backend model
//   const prepareAssessmentData = () => {
//     // Map frontend field IDs to backend column names
//     const assessmentData = {
//       // Step 1: Current Situation Assessment
//       problem: formState.problem || null,
//       problemOther: formState["problem-other"] || null,
//       duration: formState.duration || null,
//       durationOther: formState["duration-other"] || null,
//       triggersAssessment: formState["triggers-assessment"] || null,
//       triggersAssessmentOther: formState["triggers-assessment-other"] || null,
//       medications: formState.medications || null,
//       medicationsOther: formState["medications-other"] || null,

//       // Step 2: Emotional Patterns & Triggers
//       distressIntensifiers: formState["distress-intensifiers"] || null,
//       distressIntensifiersOther:
//         formState["distress-intensifiers-other"] || null,
//       physicalSensations: formState["physical-sensations"] || null,
//       physicalSensationsOther: formState["physical-sensations-other"] || null,
//       negativeThoughts: formState["negative-thoughts"] || null,
//       negativeThoughtsOther: formState["negative-thoughts-other"] || null,

//       // Step 3: Define Your Desired Outcome
//       resolution: formState.resolution || null,
//       resolutionOther: formState["resolution-other"] || null,
//       timeline: formState.timeline || null,
//       timelineOther: formState["timeline-other"] || null,
//       confidence: formState.confidence || null,

//       // Step 4: Deeper Insights
//       happyMemories: formState["happy-memories"] || null,
//       relaxationAids: formState["relaxation-aids"] || null,
//       relaxationAidsOther: formState["relaxation-aids-other"] || null,
//       supportSystem: formState["support-system"] || null,
//       supportSystemOther: formState["support-system-other"] || null,
//       rechargeActivities: formState["recharge-activities"] || null,
//       rechargeActivitiesOther: formState["recharge-activities-other"] || null,

//       // Step 5: Transformation Package
//       package: formState.package || null,

//       // Step 6: Location
//       location: formState.location || null,

//       // Step 8: Payment Information
//       cardName: formState["card-name"] || null,
//       cardNumber: formState["card-number"] || null,
//       cardExpiry: formState["card-expiry"] || null,
//       cardCvc: formState["card-cvc"] || null,
//     };

//     console.log("Prepared Assessment Data:", assessmentData);
//     return assessmentData;
//   };

//   // Submit assessment data after user is created
//   const submitAssessmentData = async (userId) => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Prepare assessment data according to backend model
//       const assessmentData = prepareAssessmentData();

//       // Prepare data for assessment endpoint
//       const assessmentPayload = {
//         user: {
//           username: formState.username,
//           email: formState.email,
//           password: formState.password,
//           roleId: formState.roleId,
//           firstName: formState.firstName,
//           lastName: formState.lastName,
//           phone: formState.phone,
//           address: formState.address,
//           message: formState.message,
//         },
//         assessment: assessmentData,
//       };

//       console.log(
//         "Submitting to /v1/user-assessment/create:",
//         assessmentPayload
//       );

//       const response = await axiosInstance.post(
//         "/v1/user-assessment/create",
//         assessmentPayload
//       );

//       if (response.status === 200 || response.status === 201) {
//         console.log("Assessment data submitted successfully:", response.data);
//         return true;
//       }
//     } catch (err) {
//       console.error("Error submitting assessment data:", err);
//       console.error("Error details:", err.response?.data);

//       const errorMessage =
//         err.response?.data?.message ||
//         err.response?.data?.error ||
//         err.message ||
//         "Failed to submit assessment information. Please try again.";
//       setError(errorMessage);
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Submit all data - user creation first, then assessment
//   const submitAllData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Step 1: Create user (if not already created)
//       let userIdentifier = userId;
//       if (!userIdentifier) {
//         userIdentifier = await submitUserData();
//         if (!userIdentifier) {
//           return false;
//         }
//       }

//       // Step 2: Submit assessment data
//       const assessmentSuccess = await submitAssessmentData(userIdentifier);
//       if (!assessmentSuccess) {
//         return false;
//       }

//       return true;
//     } catch (err) {
//       console.error("Error in final submission:", err);
//       setError("Failed to complete submission. Please try again.");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (currentStep === steps.length - 1) {
//       // Final submission - submit user first, then assessment
//       const success = await submitAllData();
//       if (success) {
//         console.log("Form completed successfully!");
//         setSuccess(true);

//         // Show success message
//         alert(
//           "Thank you! Your booking has been completed successfully. We'll contact you shortly."
//         );

//         // Reset form after successful submission
//         setFormState({
//           username: "",
//           email: "",
//           password: "defaultPassword123",
//           roleId: 4,
//           firstName: "",
//           lastName: "",
//           phone: "",
//           address: "",
//           message: "",
//           ...Object.fromEntries(
//             formData.formSections.flatMap((section) =>
//               section.fields.map((field) => [field.id, ""])
//             )
//           ),
//         });
//         setCurrentStep(0);
//         setUserId(null);
//         setShowOtherInputs({});
//       }
//     }
//   };

//   const nextStep = async () => {
//     if (currentStep === 0) {
//       // Submit user data on first step
//       const userId = await submitUserData();
//       if (!userId) return;
//     }

//     setDirection(1);
//     setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
//     setError(null);
//   };

//   const prevStep = () => {
//     setDirection(-1);
//     setCurrentStep((prev) => Math.max(prev - 1, 0));
//     setError(null);
//   };

//   const goToStep = (stepIndex) => {
//     setDirection(stepIndex > currentStep ? 1 : -1);
//     setCurrentStep(stepIndex);
//     setError(null);
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.5,
//       },
//     },
//   };

//   const slideVariants = {
//     enter: (direction) => ({
//       x: direction > 0 ? 300 : -300,
//       opacity: 0,
//     }),
//     center: {
//       zIndex: 1,
//       x: 0,
//       opacity: 1,
//     },
//     exit: (direction) => ({
//       zIndex: 0,
//       x: direction < 0 ? 300 : -300,
//       opacity: 0,
//     }),
//   };

//   const renderField = (field) => {
//     switch (field.type) {
//       case "text":
//       case "email":
//       case "tel":
//         return (
//           <input
//             type={field.type}
//             id={field.id}
//             placeholder={field.placeholder || ""}
//             className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
//             onChange={(e) => handleInputChange(field.id, e.target.value)}
//             value={formState[field.id] || ""}
//             required={field.required}
//           />
//         );

//       case "textarea":
//         return (
//           <textarea
//             id={field.id}
//             rows={field.rows || 3}
//             className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
//             onChange={(e) => handleInputChange(field.id, e.target.value)}
//             value={formState[field.id] || ""}
//             required={field.required}
//           ></textarea>
//         );

//       case "select":
//         return (
//           <div>
//             <select
//               id={field.id}
//               className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
//               onChange={(e) => {
//                 handleInputChange(field.id, e.target.value);
//                 handleShowOther(field.id, e.target.value);
//               }}
//               value={formState[field.id] || ""}
//               required={field.required}
//             >
//               {field.options.map((option, index) =>
//                 typeof option === "object" ? (
//                   <option
//                     key={index}
//                     value={option.value}
//                     disabled={option.disabled}
//                   >
//                     {option.label}
//                   </option>
//                 ) : (
//                   <option key={index} value={option}>
//                     {option}
//                   </option>
//                 )
//               )}
//             </select>
//             {showOtherInputs[field.id] && (
//               <input
//                 type="text"
//                 id={`${field.id}-other`}
//                 className="w-full p-3 rounded border border-gray-300 mt-2 focus:ring-2 focus:ring-yellow-500 focus:border-blue-800 transition-colors"
//                 placeholder="Please specify..."
//                 onChange={(e) =>
//                   handleInputChange(`${field.id}-other`, e.target.value)
//                 }
//                 value={formState[`${field.id}-other`] || ""}
//               />
//             )}
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   const renderStepContent = (step, stepIndex) => {
//     if (stepIndex === 0) {
//       // First step - Personal Information
//       return (
//         <div className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {step.fields.slice(0, 4).map((field, index) => (
//               <div
//                 key={index}
//                 className={field.id === "message" ? "md:col-span-2" : ""}
//               >
//                 <label htmlFor={field.id} className="block mb-2 font-semibold">
//                   {field.label}{" "}
//                   {field.required && <span className="text-red-500">*</span>}
//                 </label>
//                 {renderField(field)}
//               </div>
//             ))}
//           </div>
//           <div className="grid grid-cols-1 gap-6">
//             {step.fields.slice(4).map((field, index) => (
//               <div
//                 key={index}
//                 className={field.id === "message" ? "md:col-span-2" : ""}
//               >
//                 <label htmlFor={field.id} className="block mb-2 font-semibold">
//                   {field.label}{" "}
//                   {field.required && <span className="text-red-500">*</span>}
//                 </label>
//                 {renderField(field)}
//               </div>
//             ))}
//           </div>

//           {/* Navigation Buttons for First Step - After Message Box */}
//           <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//             <motion.button
//               type="button"
//               onClick={prevStep}
//               className={`bg-gray-600 text-white font-montserrat font-semibold uppercase px-8 py-3 rounded-full hover:bg-opacity-90 transition-transform ${
//                 currentStep === 0
//                   ? "opacity-50 cursor-not-allowed"
//                   : "hover:scale-105"
//               }`}
//               whileHover={currentStep > 0 ? { scale: 1.05 } : {}}
//               whileTap={currentStep > 0 ? { scale: 0.95 } : {}}
//               disabled={currentStep === 0 || loading}
//             >
//               Previous
//             </motion.button>

//             <motion.button
//               type="button"
//               onClick={nextStep}
//               disabled={loading}
//               className={`bg-green-600 text-white font-montserrat font-semibold uppercase px-8 py-3 rounded-full hover:bg-opacity-90 transition-transform ${
//                 loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
//               }`}
//               whileHover={!loading ? { scale: 1.05 } : {}}
//               whileTap={!loading ? { scale: 0.95 } : {}}
//             >
//               {loading ? "Creating User..." : "Next"}
//             </motion.button>
//           </div>
//         </div>
//       );
//     } else if (stepIndex === steps.length - 1) {
//       // Last step - Schedule Session
//       return (
//         <div className="space-y-6">
//           <div className="bg-white p-6 text-center text-gray-500 rounded-lg border">
//             <p>[Interactive Calendar Widget Placeholder]</p>
//             <p className="text-xs mt-2">
//               Select a date and time that works best for you.
//             </p>
//             <div className="mt-4 p-4 bg-gray-50 rounded">
//               <p className="text-sm text-gray-600">
//                 Your information has been saved. You'll receive a confirmation
//                 email shortly.
//               </p>
//             </div>
//           </div>

//           {/* Navigation Buttons for Last Step */}
//           <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//             <motion.button
//               type="button"
//               onClick={prevStep}
//               className={`bg-gray-600 text-white font-montserrat font-semibold uppercase px-8 py-3 rounded-full hover:bg-opacity-90 transition-transform hover:scale-105`}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               disabled={loading}
//             >
//               Previous
//             </motion.button>

//             <motion.button
//               type="submit"
//               disabled={loading}
//               className={`bg-green-600 text-white font-montserrat font-semibold uppercase px-8 py-3 rounded-full hover:bg-opacity-90 transition-transform ${
//                 loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
//               }`}
//               whileHover={!loading ? { scale: 1.05 } : {}}
//               whileTap={!loading ? { scale: 0.95 } : {}}
//             >
//               {loading ? "Submitting..." : "Complete Booking"}
//             </motion.button>
//           </div>
//         </div>
//       );
//     } else {
//       // Middle steps - Form sections
//       return (
//         <div className="space-y-6">
//           <div
//             className={`grid grid-cols-1 ${
//               step.fields.some((f) => f.colSpan === "md:col-span-2")
//                 ? "md:grid-cols-2"
//                 : ""
//             } gap-6`}
//           >
//             {step.fields.map((field, fieldIndex) => (
//               <div
//                 key={fieldIndex}
//                 className={field.colSpan || "md:col-span-1"}
//               >
//                 {field.label && (
//                   <label
//                     htmlFor={field.id}
//                     className="block mb-2 font-semibold"
//                   >
//                     {field.label}
//                   </label>
//                 )}
//                 {renderField(field)}
//               </div>
//             ))}
//           </div>

//           {/* Navigation Buttons for Form Steps */}
//           <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//             <motion.button
//               type="button"
//               onClick={prevStep}
//               className={`bg-gray-600 text-white font-montserrat font-semibold uppercase px-8 py-3 rounded-full hover:bg-opacity-90 transition-transform hover:scale-105`}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               disabled={loading}
//             >
//               Previous
//             </motion.button>

//             <motion.button
//               type="button"
//               onClick={nextStep}
//               disabled={loading}
//               className={`bg-green-600 text-white font-montserrat font-semibold uppercase px-8 py-3 rounded-full hover:bg-opacity-90 transition-transform ${
//                 loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
//               }`}
//               whileHover={!loading ? { scale: 1.05 } : {}}
//               whileTap={!loading ? { scale: 0.95 } : {}}
//             >
//               {loading ? "Saving..." : "Next"}
//             </motion.button>
//           </div>
//         </div>
//       );
//     }
//   };

//   return (
//     <section id="booking" className="py-20 bg-gray-50">
//       <div className="container mx-auto px-4">
//         <motion.h2
//           className="text-3xl md:text-4xl font-semibold font-montserrat text-gray-800 text-center mb-8"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//         >
//           Ready to Reclaim Your Life? Your Transformation Starts Here.
//         </motion.h2>

//         <motion.div
//           className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl h-auto "
//           variants={containerVariants}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//         >
//           {/* Progress Bar */}
//           <div className="mb-8">
//             <div className="flex justify-between items-center mb-4">
//               {steps.map((step, index) => (
//                 <React.Fragment key={index}>
//                   <button
//                     onClick={() => goToStep(index)}
//                     className={`flex flex-col items-center ${
//                       index <= currentStep ? "text-green-600" : "text-gray-400"
//                     } transition-colors`}
//                   >
//                     <div
//                       className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
//                         index <= currentStep
//                           ? "bg-green-600 border-green-600 text-white"
//                           : "border-gray-300"
//                       } font-semibold text-sm`}
//                     >
//                       {index + 1}
//                     </div>
//                     <span className="text-xs mt-2 text-center max-w-20">
//                       {step.title.replace(/^Step \d+: /, "").split(" ")[0]}
//                     </span>
//                   </button>
//                   {index < steps.length - 1 && (
//                     <div
//                       className={`flex-1 h-1 mx-2 ${
//                         index < currentStep ? "bg-green-600" : "bg-gray-300"
//                       }`}
//                     />
//                   )}
//                 </React.Fragment>
//               ))}
//             </div>
//           </div>

//           {/* Step Content */}
//           <form onSubmit={handleSubmit}>
//             <div className="relative min-h-[800px]">
//               <AnimatePresence custom={direction} mode="wait">
//                 <motion.div
//                   key={currentStep}
//                   custom={direction}
//                   variants={slideVariants}
//                   initial="enter"
//                   animate="center"
//                   exit="exit"
//                   transition={{
//                     x: { type: "spring", stiffness: 300, damping: 30 },
//                     opacity: { duration: 0.2 },
//                   }}
//                   className="absolute inset-0"
//                 >
//                   <div className="mb-8">
//                     <h3 className="text-2xl font-semibold text-gray-700 border-b-2 border-yellow-500 pb-2 mb-6">
//                       {steps[currentStep].title}
//                     </h3>
//                     {steps[currentStep].description && (
//                       <p className="text-gray-600 mb-6">
//                         {steps[currentStep].description}
//                       </p>
//                     )}
//                     {renderStepContent(steps[currentStep], currentStep)}
//                   </div>
//                 </motion.div>
//               </AnimatePresence>
//             </div>

//             {/* Status Messages */}
//             {error && (
//               <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
//                 {error}
//               </div>
//             )}
//             {success && currentStep === steps.length - 1 && (
//               <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded mb-4">
//                 Thank you! Your booking has been completed successfully. We'll
//                 contact you shortly.
//               </div>
//             )}
//           </form>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default BookingSection;
