/**
 * Nexus Clean — API Service Layer
 * 
 * ARCHITECTURE DESIGN:
 * All UI components communicate strictly through this service layer.
 * Communicates with the Express + Supabase backend (http://localhost:5000/api)
 * with graceful fallback to simulated datasets when the backend server is unreachable.
 */

import { INITIAL_COMPLAINTS } from '../data/mockComplaints';
import { MOCK_HOTSPOTS } from '../data/mockHotspots';
import { INITIAL_PICKUPS, SMART_ROUTE_PREVIEW } from '../data/mockPickups';
import { DEMO_STATISTICS, COMPLAINTS_OVER_TIME, COMPLAINTS_BY_CATEGORY, RESOLUTION_RATE_DATA, WASTE_TYPE_DISTRIBUTION, COMPLAINTS_BY_AREA, RECURRING_PROBLEM_ANALYSIS } from '../data/mockAnalytics';
import { MOCK_USERS } from '../data/mockUsers';

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Storage keys for demo persistence and auth tokens
const STORAGE_KEYS = {
  COMPLAINTS: 'nexus_clean_complaints',
  PICKUPS: 'nexus_clean_pickups',
  HOTSPOTS: 'nexus_clean_hotspots',
  AUTH: 'nexus_clean_auth_user',
  TOKEN: 'nexus_clean_auth_token'
};

// Helper: read and write local storage
const getStoredData = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading ${key} from storage:`, e);
    return fallback;
  }
};

const setStoredData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error saving ${key} to storage:`, e);
  }
};

const getAuthToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN) || null;
};

const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
};

/**
 * Core HTTP Request Helper
 * Adds JSON headers and JWT Bearer authorization automatically
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    ...(options.isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data?.error?.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.code = data?.error?.code || 'API_ERROR';
    err.data = data;
    throw err;
  }

  return data;
};

export const apiService = {
  // --------------------------------------------------------------------------
  // AUTHENTICATION
  // --------------------------------------------------------------------------
  async login(email, password, role = 'citizen') {
    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const user = res.user || res.data?.user;
      const token = res.token || res.data?.token;
      setStoredData(STORAGE_KEYS.AUTH, user);
      setAuthToken(token);
      return { success: true, user, token };
    } catch (err) {
      console.warn('[API Service] Backend login failed, falling back to local demo profile:', err.message);
      const user = role === 'admin' || (email && email.toLowerCase().includes('admin'))
        ? MOCK_USERS.admin
        : MOCK_USERS.citizen;
      setStoredData(STORAGE_KEYS.AUTH, user);
      setAuthToken('mock-jwt-token-nexus-clean');
      return { success: true, user, token: 'mock-jwt-token-nexus-clean' };
    }
  },

  async register(userData) {
    try {
      const res = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      const user = res.user || res.data?.user;
      const token = res.token || res.data?.token;
      setStoredData(STORAGE_KEYS.AUTH, user);
      setAuthToken(token);
      return { success: true, user, token };
    } catch (err) {
      console.warn('[API Service] Backend register failed, using local registration fallback:', err.message);
      const newUser = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        name: userData.name || 'New Citizen',
        email: userData.email,
        role: 'citizen',
        location: userData.location || 'Central Ward',
        ecoScore: {
          total: 50,
          max: 100,
          level: 'Eco Starter (Tier I)',
          monthlyImprovement: '+0%',
          breakdown: [
            { category: 'Waste Reporting', points: 10, max: 25 },
            { category: 'Proper Segregation', points: 15, max: 30 },
            { category: 'Community Participation', points: 15, max: 25 },
            { category: 'Awareness Activities', points: 10, max: 20 }
          ],
          achievements: []
        }
      };
      setStoredData(STORAGE_KEYS.AUTH, newUser);
      setAuthToken('mock-jwt-token-nexus-clean');
      return { success: true, user: newUser, token: 'mock-jwt-token-nexus-clean' };
    }
  },

  getCurrentUser() {
    return getStoredData(STORAGE_KEYS.AUTH, null);
  },

  async fetchCurrentUser() {
    const token = getAuthToken();
    if (!token) return null;
    try {
      const res = await apiRequest('/users/me', { method: 'GET' });
      const user = res.user || res.data;
      if (user) setStoredData(STORAGE_KEYS.AUTH, user);
      return user;
    } catch (e) {
      return this.getCurrentUser();
    }
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    setAuthToken(null);
    return { success: true };
  },

  // --------------------------------------------------------------------------
  // COMPLAINTS API
  // --------------------------------------------------------------------------
  // GET /api/complaints
  async getComplaints(filter = {}) {
    try {
      const params = new URLSearchParams();
      if (filter.status && filter.status !== 'All') params.append('status', filter.status);
      if (filter.priority && filter.priority !== 'All') params.append('priority', filter.priority);
      if (filter.category && filter.category !== 'All') params.append('category', filter.category);
      if (filter.area && filter.area !== 'All') params.append('area', filter.area);
      if (filter.search) params.append('search', filter.search);

      const qs = params.toString() ? `?${params.toString()}` : '';
      const res = await apiRequest(`/complaints${qs}`, { method: 'GET' });
      return { success: true, data: res.data || [] };
    } catch (err) {
      console.warn('[API Service] getComplaints failed, falling back to local dataset:', err.message);
      let list = getStoredData(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
      if (filter.status && filter.status !== 'All') {
        list = list.filter((c) => c.status === filter.status);
      }
      if (filter.priority && filter.priority !== 'All') {
        list = list.filter((c) => c.priority === filter.priority);
      }
      if (filter.search) {
        const q = filter.search.toLowerCase();
        list = list.filter((c) =>
          c.title?.toLowerCase().includes(q) ||
          c.id?.toLowerCase().includes(q) ||
          c.area?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q)
        );
      }
      return { success: true, data: list };
    }
  },

  // GET /api/complaints/:id
  async getComplaintById(id) {
    try {
      const res = await apiRequest(`/complaints/${id}`, { method: 'GET' });
      return { success: true, data: res.data };
    } catch (err) {
      console.warn(`[API Service] getComplaintById(${id}) fallback:`, err.message);
      const list = getStoredData(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
      const complaint = list.find((c) => c.id.toLowerCase() === id.toLowerCase());
      if (!complaint) {
        throw new Error(`Complaint with ID ${id} not found`);
      }
      return { success: true, data: complaint };
    }
  },

  // POST /api/complaints
  async createComplaint(complaintData) {
    try {
      const res = await apiRequest('/complaints', {
        method: 'POST',
        body: JSON.stringify(complaintData)
      });
      return { success: true, data: res.data };
    } catch (err) {
      console.warn('[API Service] createComplaint backend failed, saving locally:', err.message);
      const list = getStoredData(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
      const newId = `NC-${1040 + list.length + 1}`;

      const newComplaint = {
        id: newId,
        title: `${complaintData.category} at ${complaintData.area || 'Neighborhood'}`,
        category: complaintData.category,
        description: complaintData.description || 'Reported by citizen via Nexus Clean web app.',
        address: complaintData.address || 'Street Location',
        area: complaintData.area || 'Civil Lines',
        priority: complaintData.aiAnalysis?.priority || 'High',
        status: 'Pending',
        submittedAt: new Date().toISOString(),
        assignedTeam: 'Pending Dispatch',
        beforeImage: complaintData.photoUrl || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
        afterImage: null,
        aiAnalysis: complaintData.aiAnalysis || {
          detectedIssue: complaintData.category,
          confidence: 94,
          priority: 'HIGH',
          suggestedAction: 'Schedule inspection within 4 hours.',
          isPrototype: true
        },
        verification: null,
        timeline: [
          { step: 1, title: 'Complaint Submitted', time: 'Just now', completed: true, current: true, actor: 'Citizen' },
          { step: 2, title: 'Admin Reviewed', time: 'Pending', completed: false, actor: 'Central Dispatch' },
          { step: 3, title: 'Collection Team Assigned', time: '--', completed: false, actor: '--' },
          { step: 4, title: 'Cleanup In Progress', time: '--', completed: false, actor: '--' },
          { step: 5, title: 'Resolution Verification', time: '--', completed: false, actor: '--' },
          { step: 6, title: 'Resolved', time: '--', completed: false, actor: '--' }
        ]
      };

      const updated = [newComplaint, ...list];
      setStoredData(STORAGE_KEYS.COMPLAINTS, updated);
      return { success: true, data: newComplaint };
    }
  },

  // PATCH /api/complaints/:id/status
  async updateComplaintStatus(id, newStatus, additionalData = {}) {
    try {
      const res = await apiRequest(`/complaints/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus, ...additionalData })
      });
      return { success: true, data: res.data };
    } catch (err) {
      console.warn(`[API Service] updateComplaintStatus(${id}) fallback:`, err.message);
      const list = getStoredData(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
      const index = list.findIndex((c) => c.id === id);

      if (index === -1) {
        throw new Error(`Complaint ${id} not found`);
      }

      const item = { ...list[index], status: newStatus, ...additionalData };

      if (newStatus === 'Assigned') {
        if (item.timeline[1]) item.timeline[1].completed = true;
        if (item.timeline[2]) { item.timeline[2].completed = true; item.timeline[2].current = true; }
      } else if (newStatus === 'In Progress') {
        if (item.timeline[1]) item.timeline[1].completed = true;
        if (item.timeline[2]) item.timeline[2].completed = true;
        if (item.timeline[3]) { item.timeline[3].completed = true; item.timeline[3].current = true; }
      } else if (newStatus === 'Resolution Submitted') {
        if (item.timeline[3]) item.timeline[3].completed = true;
        if (item.timeline[4]) { item.timeline[4].completed = true; item.timeline[4].current = true; }
      } else if (newStatus === 'Resolved') {
        item.timeline.forEach((step) => {
          step.completed = true;
          step.current = false;
        });
        if (item.timeline[5]) { item.timeline[5].completed = true; item.timeline[5].time = 'Just now'; }
      }

      list[index] = item;
      setStoredData(STORAGE_KEYS.COMPLAINTS, list);
      return { success: true, data: item };
    }
  },

  // DELETE /api/complaints/:id
  async deleteComplaint(id) {
    try {
      const res = await apiRequest(`/complaints/${id}`, { method: 'DELETE' });
      return { success: true, data: res.data };
    } catch (err) {
      console.warn(`[API Service] deleteComplaint(${id}) fallback:`, err.message);
      const list = getStoredData(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
      const updated = list.filter((c) => c.id !== id);
      setStoredData(STORAGE_KEYS.COMPLAINTS, updated);
      return { success: true, data: { id, deleted: true } };
    }
  },

  // --------------------------------------------------------------------------
  // PICKUP REQUESTS API
  // --------------------------------------------------------------------------
  // GET /api/pickups
  async getPickups() {
    try {
      const res = await apiRequest('/pickups', { method: 'GET' });
      return {
        success: true,
        data: res.data || [],
        smartRoute: res.smartRoute || SMART_ROUTE_PREVIEW
      };
    } catch (err) {
      console.warn('[API Service] getPickups fallback:', err.message);
      const list = getStoredData(STORAGE_KEYS.PICKUPS, INITIAL_PICKUPS);
      return { success: true, data: list, smartRoute: SMART_ROUTE_PREVIEW };
    }
  },

  // POST /api/pickups
  async createPickup(pickupData) {
    try {
      const res = await apiRequest('/pickups', {
        method: 'POST',
        body: JSON.stringify(pickupData)
      });
      return { success: true, data: res.data };
    } catch (err) {
      console.warn('[API Service] createPickup fallback:', err.message);
      const list = getStoredData(STORAGE_KEYS.PICKUPS, INITIAL_PICKUPS);
      const newId = `PK-${2080 + list.length + 1}`;

      const newPickup = {
        id: newId,
        requesterName: pickupData.requesterName || 'Aarav Sharma',
        requesterPhone: pickupData.requesterPhone || '+91 98765 43210',
        wasteType: pickupData.wasteType,
        estimatedQuantity: pickupData.estimatedQuantity || 'Standard Collection Sack',
        address: pickupData.address,
        area: pickupData.area || 'Civil Lines',
        zone: 'Zone 3',
        preferredDate: pickupData.preferredDate || new Date().toISOString().split('T')[0],
        preferredTime: pickupData.preferredTime || '10:00 AM - 12:00 PM',
        photo: pickupData.photo || null,
        status: 'Pickup Requested',
        priority: pickupData.priority || 'Medium',
        assignedCrew: 'Central Dispatch Routing',
        createdAt: new Date().toISOString()
      };

      const updated = [newPickup, ...list];
      setStoredData(STORAGE_KEYS.PICKUPS, updated);
      return { success: true, data: newPickup };
    }
  },

  async updatePickupStatus(id, newStatus) {
    try {
      const res = await apiRequest(`/pickups/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      return { success: true, data: res.data };
    } catch (err) {
      return { success: true, data: { id, status: newStatus } };
    }
  },

  // DELETE /api/pickups/:id
  async deletePickup(id) {
    try {
      const res = await apiRequest(`/pickups/${id}`, { method: 'DELETE' });
      return { success: true, data: res.data };
    } catch (err) {
      console.warn(`[API Service] deletePickup(${id}) fallback:`, err.message);
      const list = getStoredData(STORAGE_KEYS.PICKUPS, INITIAL_PICKUPS);
      const updated = list.filter((p) => p.id !== id);
      setStoredData(STORAGE_KEYS.PICKUPS, updated);
      return { success: true, data: { id, deleted: true } };
    }
  },

  // --------------------------------------------------------------------------
  // PREDICTIVE HOTSPOTS API
  // --------------------------------------------------------------------------
  // GET /api/hotspots
  async getHotspots() {
    try {
      const res = await apiRequest('/hotspots', { method: 'GET' });
      return { success: true, data: res.data || [] };
    } catch (err) {
      console.warn('[API Service] getHotspots fallback:', err.message);
      const list = getStoredData(STORAGE_KEYS.HOTSPOTS, MOCK_HOTSPOTS);
      return { success: true, data: list };
    }
  },

  async regenerateForecast() {
    try {
      const res = await apiRequest('/hotspots/regenerate', { method: 'POST' });
      return { success: true, data: res.data || [], timestamp: res.timestamp };
    } catch (err) {
      console.warn('[API Service] regenerateForecast fallback:', err.message);
      const list = getStoredData(STORAGE_KEYS.HOTSPOTS, MOCK_HOTSPOTS);
      return { success: true, data: list, timestamp: new Date().toLocaleTimeString() };
    }
  },

  // --------------------------------------------------------------------------
  // ANALYTICS API
  // --------------------------------------------------------------------------
  // GET /api/analytics
  async getAnalytics() {
    try {
      const res = await apiRequest('/analytics', { method: 'GET' });
      const stats = res.stats || res.data?.stats;
      return {
        success: true,
        stats,
        complaintsOverTime: res.complaintsOverTime || res.data?.complaintsOverTime || COMPLAINTS_OVER_TIME,
        complaintsByCategory: res.complaintsByCategory || res.data?.complaintsByCategory || COMPLAINTS_BY_CATEGORY,
        resolutionRateData: res.resolutionRateData || res.data?.resolutionRateData || RESOLUTION_RATE_DATA,
        wasteTypeDistribution: res.wasteTypeDistribution || res.data?.wasteTypeDistribution || WASTE_TYPE_DISTRIBUTION,
        complaintsByArea: res.complaintsByArea || res.data?.complaintsByArea || COMPLAINTS_BY_AREA,
        recurringProblems: res.recurringProblems || res.data?.recurringProblems || RECURRING_PROBLEM_ANALYSIS
      };
    } catch (err) {
      console.warn('[API Service] getAnalytics fallback:', err.message);
      const complaints = getStoredData(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
      const pickups = getStoredData(STORAGE_KEYS.PICKUPS, INITIAL_PICKUPS);

      const totalComplaints = complaints.length;
      const pendingComplaints = complaints.filter((c) => c.status === 'Pending').length;
      const inProgressComplaints = complaints.filter((c) => c.status === 'In Progress' || c.status === 'Assigned').length;
      const resolvedComplaints = complaints.filter((c) => c.status === 'Resolved').length;
      const highPriorityComplaints = complaints.filter((c) => c.priority === 'High').length;

      return {
        success: true,
        stats: {
          totalComplaints,
          pendingComplaints,
          inProgressComplaints,
          resolvedComplaints,
          highPriorityComplaints,
          pickupRequests: pickups.length,
          highRiskHotspots: 12,
          resolutionRate: totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 91,
          avgResolutionHours: 4.8,
          isDemoData: true
        },
        complaintsOverTime: COMPLAINTS_OVER_TIME,
        complaintsByCategory: COMPLAINTS_BY_CATEGORY,
        resolutionRateData: RESOLUTION_RATE_DATA,
        wasteTypeDistribution: WASTE_TYPE_DISTRIBUTION,
        complaintsByArea: COMPLAINTS_BY_AREA,
        recurringProblems: RECURRING_PROBLEM_ANALYSIS
      };
    }
  },

  // --------------------------------------------------------------------------
  // AI-ASSISTED WASTE INTELLIGENCE
  // POST /api/ai/analyze-waste
  // --------------------------------------------------------------------------
  async analyzeWasteImage(imageFileOrCategory) {
    try {
      const res = await apiRequest('/ai/analyze-waste', {
        method: 'POST',
        body: JSON.stringify({ category: imageFileOrCategory })
      });
      return { success: true, data: res.data };
    } catch (err) {
      console.warn('[API Service] analyzeWasteImage fallback:', err.message);
      const categoryMatches = {
        'Overflowing Bin': {
          detectedIssue: 'Overflowing Bin (High Density Organic & Plastic)',
          confidence: 94,
          priority: 'HIGH',
          suggestedAction: 'Schedule collection within 4 hours. Recommend deploying secondary 1100L bin.',
          breakdown: { organic: '65%', plastic: '25%', other: '10%' }
        },
        'Roadside Garbage': {
          detectedIssue: 'Roadside Litter Accumulation (Commercial & Single-Use)',
          confidence: 91,
          priority: 'MEDIUM',
          suggestedAction: 'Dispatch mechanical street sweepers during off-peak window.',
          breakdown: { packaging: '50%', beverage: '40%', other: '10%' }
        },
        'Illegal Dumping': {
          detectedIssue: 'Unauthorized Debris Dump Site',
          confidence: 93,
          priority: 'HIGH',
          suggestedAction: 'Deploy heavy duty tipper truck. Escalate to municipal zoning inspectors.',
          breakdown: { constructionRubble: '60%', mixedDebris: '40%' }
        },
        'default': {
          detectedIssue: 'High-Density Unsegregated Municipal Waste',
          confidence: 92,
          priority: 'HIGH',
          suggestedAction: 'Schedule immediate dispatch crew within 4 hours.',
          breakdown: { organic: '50%', recyclables: '35%', other: '15%' }
        }
      };

      const result = categoryMatches[imageFileOrCategory] || categoryMatches['default'];
      return {
        success: true,
        data: {
          ...result,
          isPrototype: true,
          notice: 'Prototype Intelligence — Gemini credentials will be connected later.'
        }
      };
    }
  },

  // --------------------------------------------------------------------------
  // AI RESOLUTION VERIFICATION
  // POST /api/ai/verify-resolution
  // --------------------------------------------------------------------------
  async verifyResolution(complaintId, beforeImageUrl, afterImageUrl) {
    try {
      const res = await apiRequest('/ai/verify-resolution', {
        method: 'POST',
        body: JSON.stringify({ complaintId, beforeImageUrl, afterImageUrl })
      });
      return { success: true, data: res.data };
    } catch (err) {
      console.warn('[API Service] verifyResolution fallback:', err.message);
      return {
        success: true,
        data: {
          verified: true,
          confidenceScore: 92,
          score: 92,
          summary: 'Resolution appears successful. 92% visual clearance of pavement and perimeter detected.',
          status: 'Pending Admin Approval',
          isPrototype: true
        }
      };
    }
  },

  // --------------------------------------------------------------------------
  // CIVIC GAMIFICATION (ECO-SCORE)
  // GET /api/eco-score
  // --------------------------------------------------------------------------
  async getEcoScore() {
    try {
      const res = await apiRequest('/eco-score', { method: 'GET' });
      return { success: true, data: res.data || res };
    } catch (err) {
      console.warn('[API Service] getEcoScore fallback:', err.message);
      return { success: true, data: MOCK_USERS.citizen.ecoScore };
    }
  },

  // --------------------------------------------------------------------------
  // AWARENESS & QUIZ
  // --------------------------------------------------------------------------
  async getAwareness() {
    try {
      const res = await apiRequest('/awareness', { method: 'GET' });
      return { success: true, data: res.data || [] };
    } catch (err) {
      console.warn('[API Service] getAwareness fallback:', err.message);
      return { success: true, data: [] };
    }
  },

  async getQuiz() {
    try {
      const res = await apiRequest('/awareness/quiz', { method: 'GET' });
      return { success: true, data: res.data || [] };
    } catch (err) {
      console.warn('[API Service] getQuiz fallback:', err.message);
      return { success: true, data: [] };
    }
  },

  // --------------------------------------------------------------------------
  // ADMIN DASHBOARD
  // --------------------------------------------------------------------------
  async getAdminDashboard() {
    try {
      const res = await apiRequest('/admin/dashboard', { method: 'GET' });
      return { success: true, data: res.data };
    } catch (err) {
      console.warn('[API Service] getAdminDashboard fallback:', err.message);
      return { success: true, data: null };
    }
  },

  // Reset demo storage to factory defaults
  resetDemoData() {
    localStorage.removeItem(STORAGE_KEYS.COMPLAINTS);
    localStorage.removeItem(STORAGE_KEYS.PICKUPS);
    localStorage.removeItem(STORAGE_KEYS.HOTSPOTS);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    setAuthToken(null);
    return { success: true };
  }
};
