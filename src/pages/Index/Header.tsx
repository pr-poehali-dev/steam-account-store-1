import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

type HeaderProps = {
  currentView: 'home' | 'catalog' | 'cart';
  setCurrentView: (view: 'home' | 'catalog' | 'cart') => void;
  isMobile: boolean;
  mode: string;
  setDeviceMode: (mode: 'mobile' | 'desktop') => void;
};

export const Header = ({ currentView, setCurrentView, isMobile, mode, setDeviceMode }: HeaderProps) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || '';
  const userPhoto = localStorage.getItem('user_photo') || '';

  const handleLogout = () => {
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_photo');
    localStorage.removeItem('user_uid');
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/20">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <div
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Icon name="Gamepad2" className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </div>
          <h1 className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'} neon-glow`}>
            STEAM<span className="text-secondary">SHOP</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {!isMobile && (
            <nav className="flex items-center gap-4">
              <Button
                variant={currentView === 'home' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('home')}
                className={currentView === 'home' ? 'neon-border' : ''}
              >
                <Icon name="Home" className="mr-2 h-4 w-4" />
                Главная
              </Button>
              <Button
                variant={currentView === 'catalog' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('catalog')}
                className={currentView === 'catalog' ? 'neon-border' : ''}
              >
                <Icon name="Store" className="mr-2 h-4 w-4" />
                Каталог
              </Button>
              <Button
                variant="ghost"
                onClick={() => window.open('https://t.me/yoursupport', '_blank')}
              >
                <Icon name="MessageCircle" className="mr-2 h-4 w-4" />
                Поддержка
              </Button>
            </nav>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userPhoto} alt={userName} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userName.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                <Icon name="User" className="mr-2 h-4 w-4" />
                Личный кабинет
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <Icon name="LogOut" className="mr-2 h-4 w-4" />
                Выйти
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Icon name={mode === 'mobile' ? 'Smartphone' : 'Monitor'} className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setDeviceMode('mobile')}>
                <Icon name="Smartphone" className="mr-2 h-4 w-4" />
                Мобильная версия
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeviceMode('desktop')}>
                <Icon name="Monitor" className="mr-2 h-4 w-4" />
                Десктопная версия
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};