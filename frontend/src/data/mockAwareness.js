// Waste Awareness Educational Content & Interactive Sorting Dataset
export const SORTING_ITEMS = [
  {
    id: "item-1",
    name: "Plastic Water Bottle",
    category: "Recyclable",
    icon: "Milk",
    image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=400&q=80",
    fact: "Plastic PET bottles can take up to 450 years to decompose. Empty and crush before recycling!",
    acceptedIn: ["Recyclable", "Dry"]
  },
  {
    id: "item-2",
    name: "Banana Peel",
    category: "Wet",
    icon: "Apple",
    image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&q=80",
    fact: "Banana peels decompose in 2-5 weeks and enrich garden soil with potassium and nitrogen when composted.",
    acceptedIn: ["Wet"]
  },
  {
    id: "item-3",
    name: "Lithium AA Battery",
    category: "Hazardous",
    icon: "BatteryCharging",
    image: "https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=400&q=80",
    fact: "Batteries contain cadmium, lead, and acid that contaminate groundwater if dumped in ordinary landfills.",
    acceptedIn: ["Hazardous", "E-Waste"]
  },
  {
    id: "item-4",
    name: "Old Newspaper & Paper Bags",
    category: "Recyclable",
    icon: "Newspaper",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=400&q=80",
    fact: "Recycling 1 ton of newspaper saves 17 mature trees and 7,000 gallons of water.",
    acceptedIn: ["Recyclable", "Dry"]
  },
  {
    id: "item-5",
    name: "Empty Glass Beverage Bottle",
    category: "Recyclable",
    icon: "Wine",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80",
    fact: "Glass is 100% recyclable indefinitely without any loss in purity or structural quality.",
    acceptedIn: ["Recyclable", "Dry"]
  },
  {
    id: "item-6",
    name: "Leftover Cooked Food Waste",
    category: "Wet",
    icon: "Utensils",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
    fact: "Municipal bio-methanation plants convert segregated kitchen food waste into clean CNG fuel and compost.",
    acceptedIn: ["Wet"]
  },
  {
    id: "item-7",
    name: "Aerosol Deodorant Spray Can",
    category: "Hazardous",
    icon: "AlertTriangle",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80",
    fact: "Pressurized propellant containers can explode under compactor pressure; dispose through chemical collection channels.",
    acceptedIn: ["Hazardous"]
  },
  {
    id: "item-8",
    name: "Corrugated Cardboard Box",
    category: "Dry",
    icon: "Package",
    image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80",
    fact: "Flattening cardboard boxes reduces collection vehicle volume by 70%, preventing unnecessary diesel emissions.",
    acceptedIn: ["Dry", "Recyclable"]
  }
];

export const WASTE_CATEGORIES_INFO = [
  {
    category: "Wet Waste",
    color: "emerald",
    binColor: "Green Bin",
    examples: ["Vegetable & fruit peels", "Leftover cooked food", "Tea leaves & coffee grounds", "Eggshells & bones", "Garden leaves"],
    disposalGuide: "Store in breathable containers. Drain excess liquid. Do not line green bins with plastic bags.",
    environmentalImpact: "Processed via community aerobic composting or anaerobic digestion into bio-gas fuel."
  },
  {
    category: "Dry Waste",
    color: "sky",
    binColor: "Blue Bin",
    examples: ["Cardboard & paper packaging", "Clean plastic wrappers", "Metal foil & tin cans", "Rubber & leather scraps", "Textile clippings"],
    disposalGuide: "Keep clean and dry. Rinse food residues to prevent microbial contamination and pest infestation.",
    environmentalImpact: "Mechanically segregated at Material Recovery Facilities (MRF) and baled for industrial reuse."
  },
  {
    category: "Recyclable Waste",
    color: "teal",
    binColor: "Teal / White Bin",
    examples: ["PET bottles", "Aluminum drink cans", "Glass jars", "HDPE shampoo containers", "Clean corrugated cartons"],
    disposalGuide: "Flatten bottles and cartons to conserve space. Remove plastic caps where required.",
    environmentalImpact: "Recycled directly into new manufacturing feedstocks, slashing raw resource extraction."
  },
  {
    category: "E-Waste",
    color: "purple",
    binColor: "Designated Depot Box",
    examples: ["Smartphones & laptops", "Power adapters & cables", "Broken LED bulbs", "Circuit boards", "Small kitchen appliances"],
    disposalGuide: "Book an on-demand specialized pickup through Nexus Clean. Never throw in household rubbish.",
    environmentalImpact: "Precious metals (copper, gold, silver) extracted in certified eco-dismantling plants."
  },
  {
    category: "Hazardous Waste",
    color: "rose",
    binColor: "Red Bin / Sealed Pack",
    examples: ["Medical syringes & bandages", "Paint thinners & solvent cans", "Pesticide containers", "Expired medicines", "Chemical bottles"],
    disposalGuide: "Keep tightly sealed in heavy-duty containment bags clearly marked 'HAZARD'.",
    environmentalImpact: "Incinerated at regulated high temperatures or placed in engineered secure hazardous landfills."
  }
];

export const DISPOSAL_JOURNEY_STEPS = [
  {
    step: 1,
    title: "Citizen Segregation & Logging",
    description: "Citizens sort waste at the source and report localized issues via Nexus Clean before overflows occur.",
    highlight: "Source Segregation"
  },
  {
    step: 2,
    title: "AI Analysis & Hotspot Prediction",
    description: "Nexus Clean detects recurring risk zones and schedules preventive collection routes to curb overflows.",
    highlight: "Predictive Routing"
  },
  {
    step: 3,
    title: "Dedicated Collection & Transit",
    description: "Sensored municipal fleets pick up segregated streams and route them to appropriate processing hubs.",
    highlight: "Zero Contamination Fleet"
  },
  {
    step: 4,
    title: "Material Recovery & Composting",
    description: "Wet waste transforms into rich organic fertilizer; dry recyclables are baled for industrial circular loops.",
    highlight: "95% Resource Recovery"
  },
  {
    step: 5,
    title: "Resolution Verification & Impact",
    description: "Cleanup is verified via before/after proof and logged onto the community Eco-Score board.",
    highlight: "Verified Impact"
  }
];
