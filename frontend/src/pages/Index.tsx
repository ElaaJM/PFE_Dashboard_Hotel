import React, { useState, useEffect } from 'react';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import Profile from '../components/Profile';
import AdminSetup from '../components/AdminSetup';
import { useNavigate } from 'react-router-dom';

interface UserAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  jobTitle: string;
  role: 'admin' | 'analyst';
  profileImage?: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile'>('dashboard');
  const [showSignUp, setShowSignUp] = useState(false);
  const [adminLogo, setAdminLogo] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [users, setUsers] = useState<UserAccount[]>([
    {
      id: 'admin-1',
      email: 'demo@hotel.com',
      password: 'password',
      name: 'James Wilson',
      jobTitle: 'Marketing Director',
      role: 'admin',
      profileImage: undefined
    }
  ]);
  
  useEffect(() => {
    const storedUsers = localStorage.getItem('hotelUsers');
    const storedLogo = localStorage.getItem('hotelLogo');
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    
    if (storedLogo) {
      setAdminLogo(storedLogo);
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('hotelUsers', JSON.stringify(users));
    if (adminLogo) {
      localStorage.setItem('hotelLogo', adminLogo);
    }
  }, [users, adminLogo]);
  
  const handleLogin = (email: string, password: string) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
    setCurrentUser(null);
    navigate('/login'); // Redirect to the login page after logout
  };
  
  const navigateToProfile = () => {
    setCurrentView('profile');
  };
  
  const navigateToDashboard = () => {
    setCurrentView('dashboard');
  };
  
  const handleSignUp = (email: string, password: string, logoUrl: string) => {
    const newAdmin: UserAccount = {
      id: Date.now().toString(),
      email,
      password,
      name: 'Hotel Administrator',
      jobTitle: 'Administrator',
      role: 'admin',
      profileImage: undefined
    };
    
    setUsers([...users, newAdmin]);
    setAdminLogo(logoUrl);
    setShowSignUp(false);
  };
  
  const updateUserInfo = (updatedInfo: Partial<UserAccount>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedInfo };
      setCurrentUser(updatedUser);
      setUsers(users.map(user => 
        user.id === currentUser.id ? updatedUser : user
      ));
    }
  };
  
  const addAnalystAccount = (newAnalyst: Omit<UserAccount, 'id' | 'role'>) => {
    const analyst: UserAccount = {
      ...newAnalyst,
      id: Date.now().toString(),
      role: 'analyst'
    };
    
    setUsers([...users, analyst]);
  };
  
  const removeAnalystAccount = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };
  
  if (!isAuthenticated) {
    if (showSignUp) {
      return <AdminSetup onBack={() => setShowSignUp(false)} onSignUp={handleSignUp} />;
    }
    return <Login onLogin={handleLogin} onSignUp={() => setShowSignUp(true)} />;
  }
  
  if (currentView === 'profile') {
    return (
      <Profile 
        onLogout={handleLogout} 
        onBack={navigateToDashboard}
        userRole={currentUser?.role}
        userInfo={{
          name: currentUser?.name || 'User',
          jobTitle: currentUser?.jobTitle || 'Staff',
          profileImage: currentUser?.profileImage
        }}
      />
    );
  }
  
  return (
    <Dashboard 
      onLogout={handleLogout} 
      onNavigateToProfile={navigateToProfile} 
      userInfo={{
        name: currentUser?.name || 'User',
        jobTitle: currentUser?.jobTitle || 'Staff',
        profileImage: currentUser?.profileImage
      }}
    />
  );
};

export default Index;
