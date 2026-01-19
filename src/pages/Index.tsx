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
  title: string;
  games: string[];
  gamesCount: number;
  price: number;
  rating: number;
  reviews: number;
  privileges: string[];
  region: string;
  email: string;
  hours: number;
  level: number;
  description: string;
  fullDescription: string;
  image: string;
  category: 'budget' | 'standard' | 'premium' | 'ultimate';
};

const generateAccounts = (): Account[] => {
  const allGames = [
    'CS:GO', 'Dota 2', 'PUBG', 'GTA V', 'Red Dead Redemption 2', 'Cyberpunk 2077',
    'Elden Ring', 'The Witcher 3', 'Dark Souls 3', 'Sekiro', 'Baldur\'s Gate 3',
    'Starfield', 'Hogwarts Legacy', 'Resident Evil 4', 'Dead Space', 'FIFA 24',
    'Apex Legends', 'Rust', 'ARK', 'Valheim', 'Terraria', 'Stardew Valley',
    'Hades', 'Hollow Knight', 'Celeste', 'Dead Cells', 'Rainbow Six Siege'
  ];

  const privileges = [
    'Steam Guard включен',
    'Нет ограничений торговли',
    'Полный доступ к Market',
    'Возможность добавлять друзей',
    'Участие в сообществе',
    'Prime Status',
    'Family Sharing доступен',
    'Без VAC банов',
    'Email подтвержден',
    'Номер телефона привязан'
  ];

  const regions = ['Россия', 'Казахстан', 'Украина', 'Европа', 'Любой регион'];

  const accountTemplates = [
    {
      category: 'budget' as const,
      gamesCount: [3, 5],
      priceRange: [299, 599],
      levelRange: [5, 15],
      hoursRange: [50, 200],
      privilegesCount: [3, 5]
    },
    {
      category: 'standard' as const,
      gamesCount: [5, 10],
      priceRange: [699, 1499],
      levelRange: [15, 30],
      hoursRange: [200, 500],
      privilegesCount: [5, 7]
    },
    {
      category: 'premium' as const,
      gamesCount: [10, 20],
      priceRange: [1599, 3499],
      levelRange: [30, 60],
      hoursRange: [500, 1500],
      privilegesCount: [7, 9]
    },
    {
      category: 'ultimate' as const,
      gamesCount: [20, 50],
      priceRange: [3999, 8999],
      levelRange: [60, 150],
      hoursRange: [1500, 5000],
      privilegesCount: [8, 10]
    }
  ];

  return Array.from({ length: 100 }, (_, i) => {
    const template = accountTemplates[Math.floor(Math.random() * accountTemplates.length)];
    const gamesCount = Math.floor(Math.random() * (template.gamesCount[1] - template.gamesCount[0] + 1)) + template.gamesCount[0];
    const selectedGames = [...allGames].sort(() => 0.5 - Math.random()).slice(0, gamesCount);
    const price = Math.floor(Math.random() * (template.priceRange[1] - template.priceRange[0] + 1)) + template.priceRange[0];
    const level = Math.floor(Math.random() * (template.levelRange[1] - template.levelRange[0] + 1)) + template.levelRange[0];
    const hours = Math.floor(Math.random() * (template.hoursRange[1] - template.hoursRange[0] + 1)) + template.hoursRange[0];
    const privilegesCount = Math.floor(Math.random() * (template.privilegesCount[1] - template.privilegesCount[0] + 1)) + template.privilegesCount[0];
    const selectedPrivileges = [...privileges].sort(() => 0.5 - Math.random()).slice(0, privilegesCount);
    const region = regions[Math.floor(Math.random() * regions.length)];

    const categoryNames = {
      budget: 'Стартовый',
      standard: 'Стандарт',
      premium: 'Премиум',
      ultimate: 'Ультимейт'
    };

    return {
      id: i + 1,
      title: `Steam аккаунт "${categoryNames[template.category]}" — ${gamesCount} игр`,
      games: selectedGames,
      gamesCount,
      price,
      rating: parseFloat((Math.random() * 0.8 + 4.2).toFixed(1)),
      reviews: Math.floor(Math.random() * 200) + 20,
      privileges: selectedPrivileges,
      region,
      email: 'Включен в покупку',
      hours,
      level,
      description: `${gamesCount} ${gamesCount === 1 ? 'игра' : gamesCount < 5 ? 'игры' : 'игр'} • Уровень ${level} • ${hours} часов наиграно`,
      fullDescription: `Аккаунт Steam категории "${categoryNames[template.category]}" с ${gamesCount} платными играми. После покупки вы получите полный доступ к аккаунту: логин, пароль, email и пароль от email. Все игры активированы и готовы к запуску. Аккаунт проверен, без банов и ограничений.`,
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg',
      category: template.category
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
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [purchasedAccount, setPurchasedAccount] = useState<Account | null>(null);

  const allCategories = useMemo(() => {
    return ['all', 'budget', 'standard', 'premium', 'ultimate'];
  }, []);

  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = acc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.games.some(game => game.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedGame === 'all' || acc.category === selectedGame;
    const matchesPrice = acc.price >= priceRange[0] && acc.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const addToCart = (account: Account) => {
    if (!cart.find(item => item.id === account.id)) {
      setCart([...cart, account]);
      toast({
        title: "Добавлено в корзину",
        description: account.title,
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
      if (cart.length === 1) {
        setPurchasedAccount(cart[0]);
        setShowSuccessDialog(true);
      } else {
        toast({
          title: "Покупка успешна!",
          description: `Вы приобрели ${cart.length} аккаунт(ов). Данные отправлены на email.`,
        });
      }
      setCart([]);
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
            
            <div className="flex items-center gap-2 md:gap-4">
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
                  Steam аккаунты с платными играми. Полный доступ сразу после оплаты
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
                <p className="text-muted-foreground">От 299₽ за Steam аккаунт с играми</p>
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
                    <div className="aspect-video overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                      <img 
                        src={account.image} 
                        alt={account.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <CardHeader className="space-y-2">
                      <CardTitle className="text-sm md:text-base text-primary group-hover:neon-glow transition-all line-clamp-2">
                        {account.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-foreground/70">
                        {account.description}
                      </CardDescription>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {account.games.slice(0, 3).map((game, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-primary/30">
                            {game}
                          </Badge>
                        ))}
                        {account.games.length > 3 && (
                          <Badge variant="outline" className="text-xs border-secondary/30 text-secondary">
                            +{account.games.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardFooter className="flex items-center justify-between pt-0">
                      <div className="text-xl md:text-2xl font-bold text-primary neon-glow">
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
                  placeholder="Поиск по названию или игре..."
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
                      Категория
                    </Label>
                    <select
                      value={selectedGame}
                      onChange={(e) => setSelectedGame(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-primary/30 bg-background text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="all">Все категории</option>
                      <option value="budget">Стартовый (3-5 игр)</option>
                      <option value="standard">Стандарт (5-10 игр)</option>
                      <option value="premium">Премиум (10-20 игр)</option>
                      <option value="ultimate">Ультимейт (20+ игр)</option>
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
                  <div className="aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                    <img 
                      src={account.image} 
                      alt={account.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm text-primary group-hover:neon-glow transition-all line-clamp-2">
                        {account.title}
                      </CardTitle>
                      <Badge variant="outline" className="border-secondary text-secondary shrink-0">
                        ★ {account.rating}
                      </Badge>
                    </div>
                    <CardDescription className="mt-2 text-xs text-foreground/70">
                      {account.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="Gamepad2" className="h-3 w-3 text-primary" />
                        {account.gamesCount} игр в библиотеке
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="TrendingUp" className="h-3 w-3 text-primary" />
                        Уровень {account.level}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="Clock" className="h-3 w-3 text-secondary" />
                        {account.hours} часов наиграно
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {account.games.slice(0, 3).map((game, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {game}
                        </Badge>
                      ))}
                      {account.games.length > 3 && (
                        <Badge variant="outline" className="text-xs border-primary/30">
                          +{account.games.length - 3}
                        </Badge>
                      )}
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
                        <CardContent className="flex items-center justify-between p-4 gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-base md:text-lg text-primary line-clamp-1">{account.title}</h3>
                            <p className="text-xs md:text-sm text-muted-foreground">{account.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {account.games.slice(0, 2).map((game, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {game}
                                </Badge>
                              ))}
                              {account.games.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{account.games.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 md:gap-4 shrink-0">
                            <div className="text-lg md:text-xl font-bold text-primary">{account.price} ₽</div>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-primary/30 neon-border">
          {selectedAccount && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl md:text-3xl text-primary neon-glow pr-8">
                  {selectedAccount.title}
                </DialogTitle>
                <DialogDescription className="text-base text-foreground/80">
                  {selectedAccount.description}
                </DialogDescription>
              </DialogHeader>
              
              <ScrollArea className="max-h-[70vh]">
                <div className="space-y-6 pr-4">
                  <div className="aspect-video overflow-hidden rounded-lg border border-primary/30">
                    <img 
                      src={selectedAccount.image} 
                      alt={selectedAccount.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/30">
                    <h4 className="font-bold mb-2 text-secondary flex items-center gap-2">
                      <Icon name="Info" className="h-4 w-4" />
                      Полное описание
                    </h4>
                    <p className="text-sm text-foreground/80 leading-relaxed">{selectedAccount.fullDescription}</p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Icon name="Gamepad2" className="h-4 w-4 text-primary" />
                        <p className="text-xs text-muted-foreground">Игр</p>
                      </div>
                      <p className="font-bold text-lg text-foreground">{selectedAccount.gamesCount}</p>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Icon name="TrendingUp" className="h-4 w-4 text-primary" />
                        <p className="text-xs text-muted-foreground">Уровень</p>
                      </div>
                      <p className="font-bold text-lg text-foreground">{selectedAccount.level}</p>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Icon name="Clock" className="h-4 w-4 text-secondary" />
                        <p className="text-xs text-muted-foreground">Часов</p>
                      </div>
                      <p className="font-bold text-lg text-foreground">{selectedAccount.hours}</p>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Icon name="Star" className="h-4 w-4 text-primary" />
                        <p className="text-xs text-muted-foreground">Рейтинг</p>
                      </div>
                      <p className="font-bold text-lg text-foreground">{selectedAccount.rating}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold mb-3 text-secondary flex items-center gap-2">
                      <Icon name="Library" className="h-4 w-4" />
                      Игры в библиотеке ({selectedAccount.games.length})
                    </h4>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                      {selectedAccount.games.map((game, idx) => (
                        <Badge key={idx} variant="outline" className="border-primary/50 text-primary">
                          {game}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold mb-3 text-secondary flex items-center gap-2">
                      <Icon name="Shield" className="h-4 w-4" />
                      Привилегии и возможности
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedAccount.privileges.map((privilege, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded bg-secondary/5 border border-secondary/20">
                          <Icon name="Check" className="h-4 w-4 text-secondary shrink-0" />
                          <span className="text-sm text-foreground/90">{privilege}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                    <h4 className="font-bold mb-2 text-primary flex items-center gap-2">
                      <Icon name="Package" className="h-4 w-4" />
                      Что вы получите после оплаты:
                    </h4>
                    <ul className="space-y-1 text-sm text-foreground/80">
                      <li className="flex items-center gap-2">
                        <Icon name="Check" className="h-3 w-3 text-primary" />
                        Логин Steam аккаунта
                      </li>
                      <li className="flex items-center gap-2">
                        <Icon name="Check" className="h-3 w-3 text-primary" />
                        Пароль Steam аккаунта
                      </li>
                      <li className="flex items-center gap-2">
                        <Icon name="Check" className="h-3 w-3 text-primary" />
                        Email привязанный к аккаунту
                      </li>
                      <li className="flex items-center gap-2">
                        <Icon name="Check" className="h-3 w-3 text-primary" />
                        Пароль от Email
                      </li>
                      <li className="flex items-center gap-2">
                        <Icon name="Check" className="h-3 w-3 text-primary" />
                        Инструкция по смене данных
                      </li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 bg-card/95 p-4 -mx-4 -mb-4 border-t border-primary/20">
                    <div className="text-3xl md:text-4xl font-bold text-primary neon-glow">
                      {selectedAccount.price} ₽
                    </div>
                    <Button 
                      size="lg"
                      onClick={() => {
                        addToCart(selectedAccount);
                        setSelectedAccount(null);
                      }}
                      className="neon-border w-full sm:w-auto"
                    >
                      <Icon name="ShoppingCart" className="mr-2 h-5 w-5" />
                      Добавить в корзину
                    </Button>
                  </div>
                </div>
              </ScrollArea>
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

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-xl border-primary/30 neon-border">
          {purchasedAccount && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl md:text-3xl text-primary neon-glow flex items-center gap-2">
                  <Icon name="CheckCircle" className="h-8 w-8 text-secondary" />
                  Покупка успешна!
                </DialogTitle>
                <DialogDescription className="text-base text-foreground/80">
                  Вы успешно приобрели аккаунт. Ниже данные для входа:
                </DialogDescription>
              </DialogHeader>
              
              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-4 pr-4">
                  <Card className="p-4 bg-secondary/10 border-secondary/30">
                    <h3 className="font-bold text-lg mb-2 text-secondary flex items-center gap-2">
                      <Icon name="Package" className="h-5 w-5" />
                      {purchasedAccount.title}
                    </h3>
                    <p className="text-sm text-foreground/70">{purchasedAccount.description}</p>
                  </Card>

                  <Card className="p-4 bg-primary/10 border-primary/30">
                    <h4 className="font-bold mb-3 text-primary flex items-center gap-2">
                      <Icon name="Key" className="h-5 w-5" />
                      Данные для входа
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-background/50 rounded border border-primary/20">
                        <p className="text-xs text-muted-foreground mb-1">Логин Steam</p>
                        <p className="font-mono text-sm text-foreground font-bold">steam_user_{purchasedAccount.id}</p>
                      </div>
                      <div className="p-3 bg-background/50 rounded border border-primary/20">
                        <p className="text-xs text-muted-foreground mb-1">Пароль Steam</p>
                        <p className="font-mono text-sm text-foreground font-bold">Pass{purchasedAccount.id}@Steam2024</p>
                      </div>
                      <div className="p-3 bg-background/50 rounded border border-primary/20">
                        <p className="text-xs text-muted-foreground mb-1">Email</p>
                        <p className="font-mono text-sm text-foreground font-bold">account{purchasedAccount.id}@steamshop.com</p>
                      </div>
                      <div className="p-3 bg-background/50 rounded border border-primary/20">
                        <p className="text-xs text-muted-foreground mb-1">Пароль от Email</p>
                        <p className="font-mono text-sm text-foreground font-bold">Email{purchasedAccount.id}@Pass2024</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-background/50 border-secondary/30">
                    <h4 className="font-bold mb-2 text-secondary flex items-center gap-2">
                      <Icon name="Library" className="h-4 w-4" />
                      Игры в библиотеке ({purchasedAccount.games.length})
                    </h4>
                    <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                      {purchasedAccount.games.map((game, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {game}
                        </Badge>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-4 bg-background/50 border-primary/30">
                    <h4 className="font-bold mb-2 text-primary flex items-center gap-2">
                      <Icon name="Shield" className="h-4 w-4" />
                      Привилегии аккаунта
                    </h4>
                    <div className="grid grid-cols-1 gap-1 text-sm">
                      {purchasedAccount.privileges.map((privilege, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Icon name="Check" className="h-3 w-3 text-secondary" />
                          <span className="text-foreground/80">{privilege}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-4 bg-primary/5 border-primary/30">
                    <h4 className="font-bold mb-2 text-primary flex items-center gap-2">
                      <Icon name="Info" className="h-4 w-4" />
                      Важная информация
                    </h4>
                    <ul className="space-y-1 text-xs text-foreground/80">
                      <li className="flex items-start gap-2">
                        <Icon name="Dot" className="h-4 w-4 text-secondary shrink-0" />
                        Данные отправлены на вашу почту
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="Dot" className="h-4 w-4 text-secondary shrink-0" />
                        Рекомендуем сменить пароли после первого входа
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="Dot" className="h-4 w-4 text-secondary shrink-0" />
                        Сохраните эти данные в надёжном месте
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="Dot" className="h-4 w-4 text-secondary shrink-0" />
                        При возникновении проблем обратитесь в поддержку
                      </li>
                    </ul>
                  </Card>

                  <Button 
                    className="w-full neon-border"
                    onClick={() => {
                      setShowSuccessDialog(false);
                      setCurrentView('profile');
                    }}
                  >
                    Перейти в профиль
                  </Button>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;