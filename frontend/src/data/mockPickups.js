// Mock Pickup Requests & Smart Route Optimization Dataset
export const INITIAL_PICKUPS = [
  {
    id: "PK-2081",
    requesterName: "Dr. Arvind Saxena",
    requesterPhone: "+91 98390 12345",
    wasteType: "E-Waste",
    estimatedQuantity: "2 Broken Laptops, 1 Printer, 4 Battery Packs (~12kg)",
    address: "Flat 402, Green Valley Apartments, Civil Lines",
    area: "Civil Lines",
    zone: "Zone 3",
    preferredDate: "2026-10-02",
    preferredTime: "10:00 AM - 12:00 PM",
    photo: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80",
    status: "Pickup Requested",
    priority: "High",
    assignedCrew: "E-Waste Recovery Unit #02",
    createdAt: "2026-09-29T09:30:00Z"
  },
  {
    id: "PK-2082",
    requesterName: "Pooja Malhotra",
    requesterPhone: "+91 94150 56789",
    wasteType: "Bulk Waste",
    estimatedQuantity: "1 Discarded Wooden Dining Table, 4 Chairs",
    address: "B-12, Sector 3, Swaroop Nagar",
    area: "Swaroop Nagar",
    zone: "Zone 3",
    preferredDate: "2026-10-02",
    preferredTime: "01:00 PM - 03:00 PM",
    photo: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80",
    status: "Assigned",
    priority: "Medium",
    assignedCrew: "Flatbed Truck #07",
    createdAt: "2026-09-29T10:15:00Z"
  },
  {
    id: "PK-2083",
    requesterName: "Community Hall Committee",
    requesterPhone: "+91 98399 77881",
    wasteType: "Recyclable",
    estimatedQuantity: "18 Large Bags of Plastic Bottles & Cardboard from College Fest",
    address: "City Convention Ground, Mall Road",
    area: "Mall Road",
    zone: "Zone 3",
    preferredDate: "2026-10-02",
    preferredTime: "03:30 PM - 05:30 PM",
    photo: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80",
    status: "Assigned",
    priority: "High",
    assignedCrew: "Compactor Van #03",
    createdAt: "2026-09-29T11:00:00Z"
  },
  {
    id: "PK-2084",
    requesterName: "Rakesh Verma",
    requesterPhone: "+91 97931 22334",
    wasteType: "Dry",
    estimatedQuantity: "Garden trimmings and pruned tree branches (6 sacks)",
    address: "House 24, Lane 7, Kakadeo",
    area: "Kakadeo",
    zone: "Zone 3",
    preferredDate: "2026-10-03",
    preferredTime: "09:00 AM - 11:00 AM",
    photo: null,
    status: "Pickup Requested",
    priority: "Low",
    assignedCrew: "Bio-Compost Van #01",
    createdAt: "2026-09-29T13:40:00Z"
  },
  {
    id: "PK-2085",
    requesterName: "Sunrise Diagnostic Lab",
    requesterPhone: "+91 94500 44556",
    wasteType: "Other",
    estimatedQuantity: "Expired sanitary testing supplies (securely sealed)",
    address: "Shop 4, Medical Market, Govind Nagar",
    area: "Govind Nagar",
    zone: "Zone 1",
    preferredDate: "2026-10-01",
    preferredTime: "08:00 AM - 10:00 AM",
    photo: null,
    status: "Collected",
    priority: "High",
    assignedCrew: "Bio-Hazard Squad #01",
    createdAt: "2026-09-28T16:00:00Z"
  }
];

export const SMART_ROUTE_PREVIEW = {
  zone: "Zone 3 (Central & North)",
  title: "Optimized Dynamic Route",
  totalPickups: 4,
  estimatedDistance: "14.2 km",
  estimatedDuration: "2 hrs 45 mins",
  fuelSaved: "3.2 Liters (18% reduction)",
  sequence: [
    {
      step: 1,
      stopId: "Stop A",
      pickupId: "PK-2081",
      area: "Civil Lines",
      location: "Flat 402, Green Valley Apts",
      type: "E-Waste",
      timeWindow: "10:00 AM - 10:30 AM",
      notes: "Fragile electronic cargo"
    },
    {
      step: 2,
      stopId: "Stop B",
      pickupId: "PK-2083",
      area: "Mall Road",
      location: "City Convention Ground",
      type: "Recyclable (18 Bags)",
      timeWindow: "10:50 AM - 11:30 AM",
      notes: "High volume bulk clearance"
    },
    {
      step: 3,
      stopId: "Stop C",
      pickupId: "PK-2082",
      area: "Swaroop Nagar",
      location: "Sector 3, Block B",
      type: "Bulk Waste (Furniture)",
      timeWindow: "11:50 AM - 12:20 PM",
      notes: "Requires 2 loaders"
    },
    {
      step: 4,
      stopId: "Stop D",
      pickupId: "PK-2084",
      area: "Kakadeo",
      location: "Lane 7, House 24",
      type: "Dry Garden Waste",
      timeWindow: "12:45 PM - 01:15 PM",
      notes: "Drop off at Composting Station 2"
    }
  ],
  aiNotes: "Prototype Intelligence: Sequence minimizes peak hour congestion along GT Road and groups bulk dry materials prior to final disposal depot."
};

export const WASTE_TYPES = [
  "Wet",
  "Dry",
  "Recyclable",
  "E-Waste",
  "Bulk Waste",
  "Other"
];
