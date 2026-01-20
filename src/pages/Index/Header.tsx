import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

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
  const userEmail = localStorage.getItem('user_email') || '';
  
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [supportForm, setSupportForm] = useState({
    name: userName,
    email: userEmail,
    message: ''
  });
  const [isSending, setIsSending] = useState(false);

  const handleLogout = () => {
    window.location.reload();
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch('https://functions.poehali.dev/b0061fb1-24b7-478a-a6ec-7e5dba753eeb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supportForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Сообщение отправлено!',
          description: 'Мы свяжемся с вами в ближайшее время.',
        });
        setShowSupportDialog(false);
        setSupportForm({ name: userName, email: userEmail, message: '' });
      } else {
        toast({
          title: 'Ошибка отправки',
          description: data.error || 'Не удалось отправить сообщение',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить сообщение',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
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
                onClick={() => setShowSupportDialog(true)}
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

      <Dialog open={showSupportDialog} onOpenChange={setShowSupportDialog}>
        <DialogContent className={`${isMobile ? 'w-[95vw] max-w-[95vw]' : 'max-w-md'}`}>
          <DialogHeader>
            <DialogTitle>Связаться с поддержкой</DialogTitle>
            <DialogDescription>
              Заполните форму ниже и мы свяжемся с вами в ближайшее время
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSupportSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="support-name">Ваше имя</Label>
              <Input
                id="support-name"
                value={supportForm.name}
                onChange={(e) => setSupportForm({ ...supportForm, name: e.target.value })}
                placeholder="Введите ваше имя"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="support-email">Email</Label>
              <Input
                id="support-email"
                type="email"
                value={supportForm.email}
                onChange={(e) => setSupportForm({ ...supportForm, email: e.target.value })}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="support-message">Сообщение</Label>
              <Textarea
                id="support-message"
                value={supportForm.message}
                onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                placeholder="Опишите вашу проблему или вопрос..."
                rows={5}
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSupportDialog(false)}
                className="flex-1"
                disabled={isSending}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  <>
                    <Icon name="Send" className="mr-2 h-4 w-4" />
                    Отправить
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  );
};