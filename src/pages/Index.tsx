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
  const [accounts] = useState<Account[]>(generateAccounts());
  const [cart, setCart] = useState<Account[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [balance, setBalance] = useState(5000);
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'cart' | 'profile'>('home');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);

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
    if (balance >= cartTotal) {
      setBalance(balance - cartTotal);
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

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <header className="sticky top-0 z-50 border-b border-primary/20 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold neon-glow text-primary">STEAM<span className="text-secondary">SHOP</span></h1>
            
            <div className="flex items-center gap-4">
              <Button 
                variant={currentView === 'home' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('home')}
                className="neon-border"
              >
                <Icon name="Home" className="mr-2 h-4 w-4" />
                Главная
              </Button>

              <Button 
                variant={currentView === 'catalog' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('catalog')}
                className="neon-border"
              >
                <Icon name="Store" className="mr-2 h-4 w-4" />
                Каталог
              </Button>
              
              <Button 
                variant={currentView === 'cart' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('cart')}
                className="relative neon-border-purple"
              >
                <Icon name="ShoppingCart" className="mr-2 h-4 w-4" />
                Корзина
                {cart.length > 0 && (
                  <Badge className="ml-2 bg-secondary text-secondary-foreground">{cart.length}</Badge>
                )}
              </Button>
              
              <Button 
                variant={currentView === 'profile' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('profile')}
              >
                <Icon name="User" className="mr-2 h-4 w-4" />
                Профиль
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentView === 'home' && (
          <div className="space-y-12">
            <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden rounded-2xl border border-primary/30">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 cyber-grid"></div>
              <div className="relative z-10 text-center space-y-8 px-4">
                <h1 className="text-7xl md:text-9xl font-bold neon-glow">
                  STEAM<span className="text-secondary">SHOP</span>
                </h1>
                <p className="text-2xl md:text-3xl text-foreground/80 max-w-3xl mx-auto">
                  Магазин игровых аккаунтов премиум качества
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    onClick={() => setCurrentView('catalog')}
                    className="neon-border text-xl h-16 px-8"
                  >
                    <Icon name="Store" className="mr-2 h-6 w-6" />
                    Перейти в каталог
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => setCurrentView('profile')}
                    className="neon-border-purple text-xl h-16 px-8"
                  >
                    <Icon name="Wallet" className="mr-2 h-6 w-6" />
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
              <h2 className="text-4xl font-bold mb-8 text-center neon-glow text-primary">
                Популярные предложения
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 neon-glow text-primary">Профиль</h2>
            
            <Card className="mb-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 neon-border">
                    <AvatarFallback className="bg-primary/20 text-primary text-2xl">US</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl text-primary">User#12345</CardTitle>
                    <CardDescription className="text-foreground/70">Покупатель</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

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
    </div>
  );
};

export default Index;