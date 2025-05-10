import React from 'react';
import { Button } from '@/components/ui/button';
import { UserCircle, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onLogout: () => void;
  logo?: string | null;
  userInfo?: {
    name: string;
    jobTitle: string;
    profileImage?: string;
  };
}

const Header: React.FC<HeaderProps> = ({ onLogout, logo, userInfo }) => {
  const navigate = useNavigate();

  const getInitials = (name: string) =>
    name?.split(' ').map(part => part[0]).join('').toUpperCase() || 'U';

  const navigateToProfile = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    navigate('/login'); // Redirect to the login page
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-bizerta-lightgold/20 py-3 px-4 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {logo ? (
            <img src={logo} alt="Logo" className="h-9 w-auto object-contain" />
          ) : (
            <img
              src="/lovable-uploads/5ff8de11-ae87-4ba7-bcc8-7d3e95e9d85f.png"
              alt="Bizerta Resort"
              className="h-9 w-auto object-contain"
            />
          )}
          <div className="text-lg font-semibold text-bizerta-charcoal hidden md:block">
            Resort Performance
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-bizerta-charcoal hover:text-bizerta-gold hover:bg-bizerta-beige/20 flex items-center"
            onClick={navigateToProfile}
          >
            {userInfo?.profileImage ? (
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={userInfo.profileImage} />
                <AvatarFallback>{getInitials(userInfo.name)}</AvatarFallback>
              </Avatar>
            ) : (
              <UserCircle className="h-5 w-5 mr-1" />
            )}
            <span className="hidden sm:inline">{userInfo?.name || "Profile"}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-bizerta-charcoal hover:text-bizerta-gold hover:bg-bizerta-beige/20"
            onClick={handleLogout} // Use the updated handleLogout function
          >
            <LogOut className="h-5 w-5 mr-1" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
