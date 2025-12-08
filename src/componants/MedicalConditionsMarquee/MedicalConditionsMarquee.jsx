import React from "react";

const MedicalConditionsMarquee = () => {
  const conditions = [
    "Fibromyalgia",
    "Chronic Low Back Pain",
    "Chronic Neck Pain",
    "TMJ",
    "CRPS",
    "Migraines",
    "Tension Headaches",
    "Chronic Widespread Pain",
    "Chronic Pelvic Pain",
    "Chronic Joint Pain",
    "Myofascial Pain",
    "Chronic Foot Pain",
    "IBS",
    "IBD",
    "GERD",
    "Functional Dyspepsia",
    "Chronic Constipation",
    "Chronic Diarrhea",
    "Gastroparesis",
    "Chronic Nausea",
    "Cyclic Vomiting Syndrome",
    "Food Intolerances",
    "Chronic Bloating",
    "Chronic Abdominal Pain",
    "Hypertension",
    "Arrhythmias",
    "Heart Failure",
    "Coronary Artery Disease",
    "Chronic Chest Pain",
    "POTS",
    "Venous Insufficiency",
    "Peripheral Artery Disease",
    "Edema/Lymphedema",
    "Vasovagal Syncope",
    "Hypotension",
    "Raynaud's Phenomenon",
    "Psoriasis",
    "Eczema",
    "Chronic Hives",
    "Rosacea",
    "Adult Acne",
    "Alopecia Areata",
    "Chronic Itching",
    "Hyperhidrosis",
    "Vitiligo",
    "Dermatitis",
    "Hidradenitis Suppurativa",
    "Recurrent Skin Infections",
    "Asthma",
    "COPD",
    "Chronic Bronchitis",
    "Chronic Cough",
    "Sleep Apnea",
    "Chronic Sinusitis",
    "Pulmonary Fibrosis",
    "Shortness of Breath",
    "Allergic Rhinitis",
    "Chronic Laryngitis",
    "Vocal Cord Dysfunction",
    "Chest Congestion",
    "Endometriosis",
    "Pelvic Inflammatory Disease",
    "Chronic Prostatitis",
    "PMDD",
    "Ovarian Cysts",
    "Erectile Dysfunction",
    "Vulvodynia",
    "Infertility",
    "Menstrual Disorders",
    "Low Libido",
    "Testicular Pain",
    "Premature Ovarian Failure",
    "Peripheral Neuropathy",
    "Essential Tremor",
    "MS",
    "Dizziness/Vertigo",
    "Epilepsy",
    "ME/CFS",
    "Restless Legs Syndrome",
    "Trigeminal Neuralgia",
    "Dystonia",
    "Post-Concussion Syndrome",
    "Tinnitus",
    "Rheumatoid Arthritis",
    "Lupus",
    "Hashimoto's",
    "Sjögren's Syndrome",
    "Ankylosing Spondylitis",
    "Celiac Disease",
    "Type 1 Diabetes",
    "Polymyalgia Rheumatica",
    "Vasculitis",
    "Sarcoidosis",
    "Myasthenia Gravis",
    "CIRS",
    "Depression",
    "Anxiety",
    "PTSD",
    "OCD",
    "Bipolar Disorder",
    "Social Anxiety",
    "Panic Disorder",
    "Chronic Insomnia",
    "Body Dysmorphic Disorder",
    "Eating Disorders",
    "Dissociative Disorders",
    "Adjustment Disorders",
    "Dysautonomia",
    "Orthostatic Intolerance",
    "Temperature Dysregulation",
    "Neurogenic Bladder",
    "Pupillary Dysfunction",
    "HRV Dysfunction",
    "Autonomic Seizures",
    "Narcolepsy",
    "Delayed Sleep Phase",
    "Chronic Nightmares",
    "Periodic Limb Movement",
    "REM Sleep Behavior Disorder",
    "Night Terrors",
    "Sleep Paralysis",
    "Sleep-Related Eating Disorder",
    "Nocturnal Panic Attacks",
    "Type 2 Diabetes",
    "Metabolic Syndrome",
    "Adrenal Fatigue",
    "Hypothyroidism",
    "Chronic Obesity",
    "PCOS",
    "Low Testosterone",
    "Growth Hormone Deficiency",
    "Cortisol Dysregulation",
    "Insulin Resistance",
    "Electrolyte Imbalances",
    "Premature Aging",
  ];

  const marqueeStyle = {
    animation: "marquee 170s linear infinite",
  };

  return (
    <div className="flex top-0 left-0 overflow-hidden fixed bg-gray-300 pt-18 md:pt-30 z-30">
      {" "}
      {/* Reduced pt-50 to pt-12 */}
      <style>
        {`
      @keyframes marquee {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-100%); }
      }
      @keyframes marquee2 {
        0% { transform: translateX(100%); }
        100% { transform: translateX(0%); }
      }
    `}
      </style>
      {/* Marquee container */}
      <div style={marqueeStyle} className="whitespace-nowrap py-2">
        {" "}
        {/* Added py-2 for vertical padding */}
        {conditions.map((condition, index) => (
          <span key={index} className="inline-flex items-center">
            <span className="text-lg mx-4">{condition}</span>
            {index < conditions.length - 1 && (
              <span className="text-hope-gold font-bold text-xl mx-4">•</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MedicalConditionsMarquee;
