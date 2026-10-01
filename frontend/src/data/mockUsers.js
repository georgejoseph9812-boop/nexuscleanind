// Mock Users & Authentication Profiles
export const MOCK_USERS = {
  citizen: {
    id: "USR-CITIZEN-01",
    name: "Aarav Sharma",
    email: "citizen@nexusclean.org",
    role: "citizen",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    location: "Civil Lines, Kanpur",
    phone: "+91 98765 43210",
    memberSince: "May 2025",
    ecoScore: {
      total: 78,
      max: 100,
      level: "Eco Guardian (Tier II)",
      monthlyImprovement: "+18%",
      breakdown: [
        { category: "Waste Reporting", points: 20, max: 25, description: "Active & verified issue logging" },
        { category: "Proper Segregation", points: 25, max: 30, description: "Consistent door-to-door dry/wet sorting" },
        { category: "Community Participation", points: 18, max: 25, description: "Peer validations & neighborhood cleanups" },
        { category: "Awareness Activities", points: 15, max: 20, description: "Waste sorting quizzes & guides completed" }
      ],
      achievements: [
        { id: "ach-1", title: "First Reporter", description: "Logged your first verified municipal waste issue", icon: "Flag", unlocked: true, date: "May 2025" },
        { id: "ach-2", title: "Segregation Starter", description: "Completed 10 consecutive door-to-door sorted pickups", icon: "CheckCircle2", unlocked: true, date: "Jun 2025" },
        { id: "ach-3", title: "Community Champion", description: "Helped reduce local hotspot complaints by 15%+", icon: "Award", unlocked: true, date: "Aug 2025" },
        { id: "ach-4", title: "Zero Contamination", description: "Maintain 100% clean recyclable sorting for 30 days", icon: "ShieldCheck", unlocked: false, progress: 65 },
        { id: "ach-5", title: "Hotspot Spotter", description: "Reported an issue that led to proactive route deployment", icon: "Zap", unlocked: true, date: "Sep 2025" }
      ]
    }
  },
  admin: {
    id: "USR-ADMIN-01",
    name: "Officer Sunita Verma",
    email: "admin@nexusclean.org",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    title: "Chief Sanitation & Predictive Operations Director",
    department: "Municipal Smart Waste Directorate",
    jurisdiction: "Zone 3 & Central Corridor",
    badgeNumber: "MCK-9921",
    accessLevel: "Executive Administrator"
  }
};
