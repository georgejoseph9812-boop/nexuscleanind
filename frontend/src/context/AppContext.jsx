import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { MOCK_USERS } from '../data/mockUsers';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => apiService.getCurrentUser());
  const [complaints, setComplaints] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [smartRoute, setSmartRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Toast Notification Manager
  const addToast = (message, type = 'success', duration = 4000) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load Initial Application State via Service Layer
  const refreshData = async () => {
    try {
      setLoading(true);
      const [compRes, pickRes, hotRes, analRes] = await Promise.all([
        apiService.getComplaints(),
        apiService.getPickups(),
        apiService.getHotspots(),
        apiService.getAnalytics()
      ]);

      setComplaints(compRes.data || []);
      setPickups(pickRes.data || []);
      setSmartRoute(pickRes.smartRoute || null);
      setHotspots(hotRes.data || []);
      setAnalytics(analRes || null);
    } catch (err) {
      console.error('Failed to load application data:', err);
      addToast('Failed to load data from service layer.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    apiService.fetchCurrentUser().then((u) => {
      if (u) setCurrentUser(u);
    }).catch(() => {});
  }, []);

  // Authentication Actions
  const login = async (email, password, role = 'citizen') => {
    try {
      const res = await apiService.login(email, password, role);
      if (res.user) {
        setCurrentUser(res.user);
        addToast(`Signed in as ${res.user.name || 'User'}`, 'success');
        return res.user;
      }
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await apiService.register(userData);
      if (res.user) {
        setCurrentUser(res.user);
        addToast(`Account created for ${res.user.name || 'Citizen'}!`, 'success');
        return res.user;
      }
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
      throw err;
    }
  };

  // Demo Auth Switchers
  const loginAsCitizen = async () => {
    return login('citizen@nexusclean.org', 'demo123', 'citizen');
  };

  const loginAsAdmin = async () => {
    return login('admin@nexusclean.org', 'demo123', 'admin');
  };

  const logout = () => {
    apiService.logout();
    setCurrentUser(null);
    addToast('Logged out successfully', 'info');
  };

  // Complaint Actions
  const createComplaint = async (complaintData) => {
    try {
      const res = await apiService.createComplaint(complaintData);
      setComplaints((prev) => [res.data, ...prev]);
      addToast(`Complaint ${res.data.id} registered successfully!`, 'success');
      // Refresh analytics in background
      apiService.getAnalytics().then(setAnalytics).catch(() => {});
      return res.data;
    } catch (err) {
      addToast('Error submitting complaint', 'error');
      throw err;
    }
  };

  const updateComplaintStatus = async (id, status, extra = {}) => {
    try {
      const res = await apiService.updateComplaintStatus(id, status, extra);
      setComplaints((prev) => prev.map((c) => (c.id === id ? res.data : c)));
      addToast(`Complaint ${id} updated to "${status}"`, 'success');
      apiService.getAnalytics().then(setAnalytics).catch(() => {});
      return res.data;
    } catch (err) {
      addToast(`Error updating complaint ${id}`, 'error');
      throw err;
    }
  };

  // Pickup Actions
  const createPickup = async (pickupData) => {
    try {
      const res = await apiService.createPickup(pickupData);
      setPickups((prev) => [res.data, ...prev]);
      addToast(`Pickup request ${res.data.id} created!`, 'success');
      apiService.getAnalytics().then(setAnalytics).catch(() => {});
      return res.data;
    } catch (err) {
      addToast('Error creating pickup request', 'error');
      throw err;
    }
  };

  const updatePickupStatus = async (id, status) => {
    setPickups((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
    addToast(`Pickup ${id} status updated to ${status}`, 'success');
  };

  // Reset Demo Factory State
  const resetDemo = () => {
    apiService.resetDemoData();
    refreshData();
    setCurrentUser(MOCK_USERS.citizen);
    addToast('Application reset to clean demo baseline', 'info');
  };

  const value = {
    currentUser,
    setCurrentUser,
    login,
    register,
    loginAsCitizen,
    loginAsAdmin,
    logout,
    complaints,
    pickups,
    hotspots,
    analytics,
    smartRoute,
    loading,
    refreshData,
    createComplaint,
    updateComplaintStatus,
    createPickup,
    updatePickupStatus,
    resetDemo,
    toasts,
    addToast,
    removeToast
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
