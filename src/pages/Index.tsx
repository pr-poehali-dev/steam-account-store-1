import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';
import { useDeviceMode } from '@/hooks/use-device-mode';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Account = {
  id: number;
  game: string;
  rank: string;
  level: number;
  hours: number;
  price: number;
  rating: number;
  reviews: number;
  inventory: string[];
  badges: string[];
  description: string;
  image: string;
};

const generateAccounts = (): Account[] => {
  const games = ['CS:GO', 'Dota 2', 'PUBG', 'Apex Legends', 'Valorant', 'Rainbow Six', 'Overwatch', 'Rust', 'GTA V', 'ARK'];
  const ranks = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster', 'Challenger'];
  const inventory = ['Knife', 'AWP Asiimov', 'AK-47 Redline', 'Glock Fade', 'M4A4 Howl', 'Butterfly Knife'];
  const badges = ['Prime', 'Verified', 'Ranked', 'Achievements', 'Skins'];
  
  const descriptions = [
    'Прокачанный аккаунт с отличной статистикой. Много редких скинов и достижений.',
    'Аккаунт с Prime статусом. Все операции пройдены, богатый инвентарь.',
    'Высокий ранг, много часов игры. Идеально для серьёзных игроков.',
    'Аккаунт в отличном состоянии, без банов. Множество редких предметов.',
    'Проверенный аккаунт с хорошей репутацией и уникальными скинами.',
  ];

  const gameImages: Record<string, string> = {
    'CS:GO': 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg',
    'Dota 2': 'https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg',
    'PUBG': 'https://cdn.akamai.steamstatic.com/steam/apps/578080/header.jpg',
    'Apex Legends': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg',
    'Valorant': 'https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt5c61f2bd82e247a1/5eb26f133b09ef0e76f3ea78/V_AGENTS_587x408_Jett.jpg',
    'Rainbow Six': 'https://cdn.akamai.steamstatic.com/steam/apps/359550/header.jpg',
    'Overwatch': 'https://images.blz-contentstack.com/v3/assets/blt2477dcaf4ebd440c/blt5159232b9f7bc88b/62ea89e7e7799a109d1f0353/overwatch-logo-ow2.png',
    'Rust': 'https://cdn.akamai.steamstatic.com/steam/apps/252490/header.jpg',
    'GTA V': 'https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg',
    'ARK': 'https://cdn.akamai.steamstatic.com/steam/apps/346110/header.jpg',
  };

  return Array.from({ length: 100 }, (_, i) => {
    const game = games[Math.floor(Math.random() * games.length)];
    return {
      id: i + 1,
      game,
      rank: ranks[Math.floor(Math.random() * ranks.length)],
      level: Math.floor(Math.random() * 100) + 10,
      hours: Math.floor(Math.random() * 3000) + 100,
      price: Math.floor(Math.random() * 400) + 50,
      rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
      reviews: Math.floor(Math.random() * 150) + 5,
      inventory: Array.from({ length: Math.floor(Math.random() * 4) + 2 }, () => 
        inventory[Math.floor(Math.random() * inventory.length)]
      ),
      badges: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
        badges[Math.floor(Math.random() * badges.length)]
      ),
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      image: gameImages[game] || 'https://via.placeholder.com/460x215/0a0a0f/00f0ff?text=Steam+Account'
    };
  });
};

const Index = () => {
  const { mode, isMobile, setDeviceMode } = useDeviceMode();
  const [accounts] = useState<Account[]>(generateAccounts());
  const [cart, setCart] = useState<Account[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [balance, setBalance] = useState(5000);
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'cart' | 'profile'>('home');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; avatar: string } | null>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<Account[]>([]);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const allGames = useMemo(() => {
    const games = Array.from(new Set(accounts.map(acc => acc.game)));
    return ['all', ...games.sort()];
  }, [accounts]);

  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = acc.game.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.rank.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGame = selectedGame === 'all' || acc.game === selectedGame;
    const matchesPrice = acc.price >= priceRange[0] && acc.price <= priceRange[1];
    return matchesSearch && matchesGame && matchesPrice;
  });

  const addToCart = (account: Account) => {
    if (!cart.find(item => item.id === account.id)) {
      setCart([...cart, account]);
      toast({
        title: "Добавлено в корзину",
        description: `${account.game} - ${account.rank}`,
      });
    }
  };

  const removeFromCart = (accountId: number) => {
    setCart(cart.filter(item => item.id !== accountId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handlePurchase = () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      toast({
        title: "Требуется авторизация",
        description: "Войдите в аккаунт для покупки",
        variant: "destructive",
      });
      return;
    }
    if (balance >= cartTotal) {
      setBalance(balance - cartTotal);
      setPurchaseHistory([...purchaseHistory, ...cart]);
      setCart([]);
      toast({
        title: "Покупка успешна!",
        description: `Вы приобрели ${cart.length} аккаунт(ов)`,
      });
      setCurrentView('profile');
    } else {
      toast({
        title: "Недостаточно средств",
        description: "Пополните баланс",
        variant: "destructive",
      });
    }
  };

  const handleTopUp = () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      toast({
        title: "Требуется авторизация",
        description: "Войдите в аккаунт для пополнения баланса",
        variant: "destructive",
      });
      return;
    }
    const amount = parseInt(topUpAmount);
    if (amount > 0) {
      setBalance(balance + amount);
      setTopUpAmount('');
      toast({
        title: "Баланс пополнен",
        description: `+${amount} ₽`,
      });
    }
  };

  const handleGoogleLogin = () => {
    setIsAuthenticated(true);
    setUser({
      name: 'Пользователь Google',
      email: 'user@gmail.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GoogleUser'
    });
    setShowAuthDialog(false);
    toast({
      title: "Вход выполнен",
      description: "Добро пожаловать!",
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setPurchaseHistory([]);
    setBalance(5000);
    toast({
      title: "Выход выполнен",
      description: "До скорой встречи!",
    });
  };

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <header className="sticky top-0 z-50 border-b border-primary/20 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-xl md:text-3xl font-bold neon-glow text-primary">STEAM<span className="text-secondary">SHOP</span></h1>
            
            <div className="flex items-center gap-1 md:gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size={isMobile ? "sm" : "default"} className="gap-2">
                    <Icon name={mode === 'mobile' ? 'Smartphone' : mode === 'desktop' ? 'Monitor' : 'TabletSmartphone'} className="h-4 w-4" />
                    {!isMobile && <span className="hidden lg:inline">{mode === 'auto' ? 'Авто' : mode === 'mobile' ? 'Моб' : 'ПК'}</span>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setDeviceMode('auto')}>
                    <Icon name="TabletSmartphone" className="mr-2 h-4 w-4" />
                    Автоматически
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDeviceMode('mobile')}>
                    <Icon name="Smartphone" className="mr-2 h-4 w-4" />
                    Мобильный
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDeviceMode('desktop')}>
                    <Icon name="Monitor" className="mr-2 h-4 w-4" />
                    Компьютер
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className={`flex items-center gap-1 ${isMobile ? 'md:gap-2' : 'gap-4'}`}>
              <Button 
                variant={currentView === 'home' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('home')}
                className="neon-border"
                size={isMobile ? "icon" : "default"}
              >
                <Icon name="Home" className={isMobile ? "h-4 w-4" : "mr-2 h-4 w-4"} />
                {!isMobile && "Главная"}
              </Button>

              <Button 
                variant={currentView === 'catalog' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('catalog')}
                className="neon-border"
                size={isMobile ? "icon" : "default"}
              >
                <Icon name="Store" className={isMobile ? "h-4 w-4" : "mr-2 h-4 w-4"} />
                {!isMobile && "Каталог"}
              </Button>
              
              <Button 
                variant={currentView === 'cart' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('cart')}
                className="relative neon-border-purple"
                size={isMobile ? "icon" : "default"}
              >
                <Icon name="ShoppingCart" className={isMobile ? "h-4 w-4" : "mr-2 h-4 w-4"} />
                {!isMobile && "Корзина"}
                {cart.length > 0 && (
                  <Badge className={`${isMobile ? 'absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs' : 'ml-2'} bg-secondary text-secondary-foreground`}>
                    {cart.length}
                  </Badge>
                )}
              </Button>
              
              {isAuthenticated ? (
                <Button 
                  variant={currentView === 'profile' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('profile')}
                  className="flex items-center gap-2"
                  size={isMobile ? "icon" : "default"}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-primary/20 text-primary">
                      {user?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {!isMobile && "Профиль"}
                </Button>
              ) : (
                <Button 
                  onClick={() => setShowAuthDialog(true)}
                  className="neon-border"
                  size={isMobile ? "icon" : "default"}
                >
                  <Icon name="LogIn" className={isMobile ? "h-4 w-4" : "mr-2 h-4 w-4"} />
                  {!isMobile && "Войти"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentView === 'home' && (
          <div className="space-y-12">
            <section className={`relative ${isMobile ? 'min-h-[50vh]' : 'min-h-[70vh]'} flex items-center justify-center overflow-hidden rounded-2xl border border-primary/30`}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 cyber-grid"></div>
              <div className="relative z-10 text-center space-y-4 md:space-y-8 px-4">
                <h1 className={`${isMobile ? 'text-4xl' : 'text-7xl md:text-9xl'} font-bold neon-glow`}>
                  STEAM<span className="text-secondary">SHOP</span>
                </h1>
                <p className={`${isMobile ? 'text-base' : 'text-2xl md:text-3xl'} text-foreground/80 max-w-3xl mx-auto`}>
                  Магазин игровых аккаунтов премиум качества
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
                  <Button 
                    size={isMobile ? "default" : "lg"}
                    onClick={() => setCurrentView('catalog')}
                    className={`neon-border ${isMobile ? 'text-base h-12 px-6 w-full sm:w-auto' : 'text-xl h-16 px-8'}`}
                  >
                    <Icon name="Store" className={`mr-2 ${isMobile ? 'h-4 w-4' : 'h-6 w-6'}`} />
                    Перейти в каталог
                  </Button>
                  <Button 
                    size={isMobile ? "default" : "lg"}
                    variant="outline"
                    onClick={() => setCurrentView('profile')}
                    className={`neon-border-purple ${isMobile ? 'text-base h-12 px-6 w-full sm:w-auto' : 'text-xl h-16 px-8'}`}
                  >
                    <Icon name="Wallet" className={`mr-2 ${isMobile ? 'h-4 w-4' : 'h-6 w-6'}`} />
                    Пополнить баланс
                  </Button>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 text-center hover:neon-border transition-all">
                <Icon name="Shield" className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2 text-primary">Безопасность</h3>
                <p className="text-muted-foreground">Все аккаунты проверены и защищены</p>
              </Card>
              
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 text-center hover:neon-border-purple transition-all">
                <Icon name="Zap" className="h-12 w-12 mx-auto mb-4 text-secondary" />
                <h3 className="text-xl font-bold mb-2 text-secondary">Мгновенно</h3>
                <p className="text-muted-foreground">Получите доступ сразу после оплаты</p>
              </Card>
              
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 text-center hover:neon-border transition-all">
                <Icon name="DollarSign" className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2 text-primary">Низкие цены</h3>
                <p className="text-muted-foreground">От 50₽ за прокачанный аккаунт</p>
              </Card>
            </section>

            <section>
              <h2 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold mb-6 md:mb-8 text-center neon-glow text-primary`}>
                Популярные предложения
              </h2>
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'} gap-4 md:gap-6`}>
                {accounts.slice(0, 8).map((account) => (
                  <Card 
                    key={account.id} 
                    className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:neon-border bg-card/50 backdrop-blur-sm border-primary/20"
                    onClick={() => setSelectedAccount(account)}
                  >
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img 
                        src={account.image} 
                        alt={account.game}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-primary group-hover:neon-glow transition-all">
                        {account.game}
                      </CardTitle>
                      <CardDescription className="text-foreground/70">
                        {account.rank}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-primary neon-glow">
                        {account.price} ₽
                      </div>
                      <Badge variant="outline" className="border-secondary text-secondary">
                        ★ {account.rating}
                      </Badge>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button 
                  size="lg"
                  onClick={() => setCurrentView('catalog')}
                  className="neon-border"
                >
                  Показать все {accounts.length} аккаунтов
                  <Icon name="ArrowRight" className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </section>
          </div>
        )}

        {currentView === 'catalog' && (
          <>
            <div className="mb-8 space-y-6">
              <div className="relative max-w-2xl mx-auto">
                <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Поиск по игре или рангу..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 border-primary/30 focus:border-primary neon-border"
                />
              </div>

              <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-foreground flex items-center gap-2">
                      <Icon name="Gamepad2" className="h-4 w-4 text-primary" />
                      Игра
                    </Label>
                    <select
                      value={selectedGame}
                      onChange={(e) => setSelectedGame(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-primary/30 bg-background text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="all">Все игры</option>
                      {allGames.slice(1).map((game) => (
                        <option key={game} value={game}>{game}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground flex items-center gap-2">
                      <Icon name="DollarSign" className="h-4 w-4 text-secondary" />
                      Цена: {priceRange[0]} - {priceRange[1]} ₽
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        className="border-primary/30 focus:border-primary"
                        placeholder="От"
                      />
                      <span className="text-muted-foreground">—</span>
                      <Input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 20000])}
                        className="border-primary/30 focus:border-primary"
                        placeholder="До"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Найдено аккаунтов: <span className="text-primary font-bold">{filteredAccounts.length}</span>
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedGame('all');
                      setPriceRange([0, 20000]);
                      setSearchQuery('');
                    }}
                    className="border-secondary/50 hover:border-secondary"
                  >
                    <Icon name="X" className="h-4 w-4 mr-1" />
                    Сбросить
                  </Button>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAccounts.map((account) => (
                <Card 
                  key={account.id} 
                  className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:neon-border bg-card/50 backdrop-blur-sm border-primary/20 overflow-hidden"
                  onClick={() => setSelectedAccount(account)}
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={account.image} 
                      alt={account.game}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-primary group-hover:neon-glow transition-all">
                          {account.game}
                        </CardTitle>
                        <CardDescription className="mt-1 text-foreground/70">
                          {account.rank}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="border-secondary text-secondary">
                        ★ {account.rating}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="TrendingUp" className="h-4 w-4 text-primary" />
                        Уровень {account.level}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="Clock" className="h-4 w-4 text-secondary" />
                        {account.hours} часов
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="MessageSquare" className="h-4 w-4 text-primary" />
                        {account.reviews} отзывов
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-1">
                      {account.badges.slice(0, 3).map((badge, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary neon-glow">
                      {account.price} ₽
                    </div>
                    <Button 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(account);
                      }}
                      className="neon-border"
                    >
                      <Icon name="ShoppingCart" className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}

        {currentView === 'cart' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 neon-glow text-primary">Корзина</h2>
            
            {cart.length === 0 ? (
              <Card className="p-12 text-center bg-card/50 backdrop-blur-sm border-primary/20">
                <Icon name="ShoppingCart" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-muted-foreground">Корзина пуста</p>
                <Button onClick={() => setCurrentView('catalog')} className="mt-4 neon-border">
                  Перейти к каталогу
                </Button>
              </Card>
            ) : (
              <>
                <ScrollArea className="h-[500px] mb-6">
                  <div className="space-y-4">
                    {cart.map((account) => (
                      <Card key={account.id} className="bg-card/50 backdrop-blur-sm border-primary/20">
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-primary">{account.game}</h3>
                            <p className="text-sm text-muted-foreground">{account.rank} • Уровень {account.level}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-xl font-bold text-primary">{account.price} ₽</div>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => removeFromCart(account.id)}
                            >
                              <Icon name="Trash2" className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>

                <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 neon-border">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl">Итого:</span>
                    <span className="text-3xl font-bold text-primary neon-glow">{cartTotal} ₽</span>
                  </div>
                  <div className="flex items-center justify-between mb-4 text-muted-foreground">
                    <span>Ваш баланс:</span>
                    <span className="text-xl font-bold text-secondary">{balance} ₽</span>
                  </div>
                  <Separator className="my-4" />
                  <Button 
                    className="w-full neon-border text-lg h-12"
                    onClick={handlePurchase}
                    disabled={balance < cartTotal}
                  >
                    <Icon name="CreditCard" className="mr-2 h-5 w-5" />
                    Оплатить {cartTotal} ₽
                  </Button>
                </Card>
              </>
            )}
          </div>
        )}

        {currentView === 'profile' && (
          <div className="max-w-4xl mx-auto">
            {!isAuthenticated ? (
              <Card className="p-12 text-center bg-card/50 backdrop-blur-sm border-primary/20">
                <Icon name="UserX" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2 text-foreground">Требуется авторизация</h2>
                <p className="text-muted-foreground mb-6">Войдите в аккаунт для доступа к профилю</p>
                <Button onClick={() => setShowAuthDialog(true)} className="neon-border">
                  <Icon name="LogIn" className="mr-2 h-5 w-5" />
                  Войти через Google
                </Button>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold neon-glow text-primary">Профиль</h2>
                  <Button variant="outline" onClick={handleLogout} className="border-destructive/50 hover:border-destructive">
                    <Icon name="LogOut" className="mr-2 h-4 w-4" />
                    Выйти
                  </Button>
                </div>
                
                <Card className="mb-6 bg-card/50 backdrop-blur-sm border-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20 neon-border">
                          {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                              {user?.name.charAt(0)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <CardTitle className="text-2xl text-primary">{user?.name}</CardTitle>
                          <CardDescription className="text-foreground/70">{user?.email}</CardDescription>
                          <Badge className="mt-2 bg-secondary/20 text-secondary border-secondary">
                            <Icon name="Shield" className="h-3 w-3 mr-1" />
                            Проверенный аккаунт
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Куплено аккаунтов</p>
                        <p className="text-3xl font-bold text-primary neon-glow">{purchaseHistory.length}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card className="bg-card/50 backdrop-blur-sm border-primary/20 neon-border-purple">
                    <CardHeader>
                      <CardTitle className="text-2xl text-secondary neon-glow">Баланс</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-5xl font-bold text-primary neon-glow mb-6">
                        {balance} ₽
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <Tabs defaultValue="card" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="card">Карта</TabsTrigger>
                          <TabsTrigger value="crypto">Электронные</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="card" className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="amount">Сумма пополнения</Label>
                            <Input
                              id="amount"
                              type="number"
                              placeholder="Введите сумму"
                              value={topUpAmount}
                              onChange={(e) => setTopUpAmount(e.target.value)}
                              className="border-primary/30 focus:border-primary"
                            />
                          </div>
                          <Button 
                            className="w-full neon-border h-12"
                            onClick={handleTopUp}
                          >
                            <Icon name="CreditCard" className="mr-2 h-5 w-5" />
                            Пополнить картой
                          </Button>
                        </TabsContent>
                        
                        <TabsContent value="crypto" className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="amount2">Сумма пополнения</Label>
                            <Input
                              id="amount2"
                              type="number"
                              placeholder="Введите сумму"
                              value={topUpAmount}
                              onChange={(e) => setTopUpAmount(e.target.value)}
                              className="border-primary/30 focus:border-primary"
                            />
                          </div>
                          <Button 
                            className="w-full neon-border-purple h-12"
                            onClick={handleTopUp}
                          >
                            <Icon name="Wallet" className="mr-2 h-5 w-5" />
                            Пополнить электронным кошельком
                          </Button>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-2xl text-primary">Статистика</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon name="ShoppingBag" className="h-5 w-5 text-primary" />
                          <span className="text-foreground/80">Всего покупок</span>
                        </div>
                        <span className="text-xl font-bold text-primary">{purchaseHistory.length}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon name="DollarSign" className="h-5 w-5 text-secondary" />
                          <span className="text-foreground/80">Потрачено</span>
                        </div>
                        <span className="text-xl font-bold text-secondary">
                          {purchaseHistory.reduce((sum, acc) => sum + acc.price, 0)} ₽
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon name="Star" className="h-5 w-5 text-primary" />
                          <span className="text-foreground/80">Средний рейтинг</span>
                        </div>
                        <span className="text-xl font-bold text-primary">
                          {purchaseHistory.length > 0 
                            ? (purchaseHistory.reduce((sum, acc) => sum + acc.rating, 0) / purchaseHistory.length).toFixed(1)
                            : '0.0'
                          }
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {purchaseHistory.length > 0 && (
                  <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-2xl text-primary">История покупок</CardTitle>
                      <CardDescription>Ваши приобретённые аккаунты</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-4">
                          {purchaseHistory.map((account, idx) => (
                            <Card key={idx} className="bg-background/50 border-primary/10">
                              <CardContent className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-20 h-12 rounded overflow-hidden">
                                    <img 
                                      src={account.image} 
                                      alt={account.game}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-primary">{account.game}</h4>
                                    <p className="text-sm text-muted-foreground">{account.rank} • Уровень {account.level}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <Badge variant="outline" className="border-secondary text-secondary">
                                    ★ {account.rating}
                                  </Badge>
                                  <div className="text-lg font-bold text-primary">{account.price} ₽</div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        )}
      </main>

      <Dialog open={!!selectedAccount} onOpenChange={() => setSelectedAccount(null)}>
        <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-xl border-primary/30 neon-border">
          {selectedAccount && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl text-primary neon-glow">
                  {selectedAccount.game}
                </DialogTitle>
                <DialogDescription className="text-lg text-foreground/80">
                  {selectedAccount.rank} • Уровень {selectedAccount.level}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="aspect-video overflow-hidden rounded-lg border border-primary/30">
                  <img 
                    src={selectedAccount.image} 
                    alt={selectedAccount.game}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h4 className="font-bold mb-2 text-secondary">Описание</h4>
                  <p className="text-foreground/80 leading-relaxed">{selectedAccount.description}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Icon name="Clock" className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Наиграно</p>
                      <p className="font-bold text-foreground">{selectedAccount.hours} часов</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Icon name="Star" className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Рейтинг</p>
                      <p className="font-bold text-foreground">{selectedAccount.rating} ({selectedAccount.reviews} отзывов)</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold mb-2 text-secondary">Инвентарь</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAccount.inventory.map((item, idx) => (
                      <Badge key={idx} variant="outline" className="border-primary text-primary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold mb-2 text-secondary">Достижения</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAccount.badges.map((badge, idx) => (
                      <Badge key={idx} variant="secondary">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-bold text-primary neon-glow">
                    {selectedAccount.price} ₽
                  </div>
                  <Button 
                    size="lg"
                    onClick={() => {
                      addToCart(selectedAccount);
                      setSelectedAccount(null);
                    }}
                    className="neon-border"
                  >
                    <Icon name="ShoppingCart" className="mr-2 h-5 w-5" />
                    Добавить в корзину
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-primary/30 neon-border">
          <DialogHeader>
            <DialogTitle className="text-3xl text-primary neon-glow text-center">
              Добро пожаловать!
            </DialogTitle>
            <DialogDescription className="text-center text-foreground/80">
              Войдите для доступа ко всем функциям
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-6">
            <Button 
              className="w-full h-14 neon-border text-lg"
              onClick={handleGoogleLogin}
            >
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Войти через Google
              </div>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Безопасный вход
                </span>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Ваши данные защищены и используются только для авторизации</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;