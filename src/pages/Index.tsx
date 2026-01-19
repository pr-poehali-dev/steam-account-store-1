import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
  code: string;
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
    'Hades', 'Hollow Knight', 'Celeste', 'Dead Cells', 'Rainbow Six Siege',
    'Counter-Strike 2', 'Team Fortress 2', 'Left 4 Dead 2', 'Portal 2', 'Half-Life 2',
    'Garry\'s Mod', 'Call of Duty: Modern Warfare', 'Battlefield 2042', 'Overwatch 2',
    'Fortnite', 'Warzone 2.0', 'Minecraft', 'Among Us', 'Fall Guys',
    'Rocket League', 'FIFA 23', 'NBA 2K24', 'Madden NFL 24', 'UFC 5',
    'Mortal Kombat 11', 'Street Fighter 6', 'Tekken 8', 'Dragon Ball Z Kakarot',
    'Naruto Storm 4', 'One Piece Odyssey', 'Assassin\'s Creed Valhalla', 'Far Cry 6',
    'Watch Dogs Legion', 'Ghost Recon Breakpoint', 'The Division 2', 'Splinter Cell',
    'Prince of Persia', 'Rayman Legends', 'Metal Gear Solid V', 'Death Stranding',
    'Horizon Zero Dawn', 'God of War', 'Spider-Man Remastered', 'Days Gone',
    'The Last of Us Part I', 'Uncharted 4', 'Bloodborne', 'Demon\'s Souls',
    'Nioh 2', 'Ghost of Tsushima', 'Control', 'Alan Wake 2', 'Quantum Break',
    'Max Payne 3', 'Mafia Definitive Edition', 'Hitman 3', 'Dishonored 2',
    'Prey', 'BioShock Infinite', 'Borderlands 3', 'Destiny 2', 'Warframe',
    'Path of Exile', 'Diablo IV', 'Lost Ark', 'Black Desert Online', 'Guild Wars 2',
    'Final Fantasy XIV', 'World of Warcraft', 'Elder Scrolls Online', 'New World',
    'Star Wars Jedi Survivor', 'Hogwarts Legacy', 'Dying Light 2', 'Dead Island 2',
    'Resident Evil Village', 'Resident Evil 2', 'Silent Hill 2', 'Outlast 2',
    'Amnesia Rebirth', 'Phasmophobia', 'Lethal Company', 'Content Warning',
    'Sons of The Forest', 'Palworld', 'Enshrouded', 'V Rising', 'Conan Exiles',
    'Subnautica', 'Subnautica Below Zero', 'No Man\'s Sky', 'Elite Dangerous',
    'Star Citizen', 'Kerbal Space Program', 'Stellaris', 'Civilization VI',
    'Total War Warhammer 3', 'Age of Empires IV', 'Starcraft II', 'Command & Conquer',
    'XCOM 2', 'Divinity Original Sin 2', 'Pillars of Eternity', 'Wasteland 3',
    'Fallout 4', 'Fallout 76', 'Skyrim Special Edition', 'Oblivion', 'Morrowind',
    'Dragon Age Inquisition', 'Mass Effect Legendary', 'Witcher 2', 'Witcher 1',
    'Kingdom Come Deliverance', 'Mount & Blade II', 'Crusader Kings 3', 'Europa Universalis IV',
    'Hearts of Iron IV', 'Victoria 3', 'Cities Skylines', 'Planet Zoo', 'Planet Coaster',
    'Two Point Hospital', 'RimWorld', 'Oxygen Not Included', 'Factorio', 'Satisfactory',
    'Automation', 'BeamNG.drive', 'Euro Truck Simulator 2', 'American Truck Simulator',
    'Farming Simulator 22', 'Microsoft Flight Simulator', 'DCS World', 'X-Plane 12',
    'iRacing', 'Assetto Corsa', 'Project Cars 3', 'F1 2023', 'WRC Generations',
    'MotoGP 23', 'RIDE 5', 'Gran Turismo 7', 'Forza Horizon 5', 'Forza Motorsport'
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

  return Array.from({ length: 732 }, (_, i) => {
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

    const code = `${template.category.substring(0, 2).toUpperCase()}${String(i + 1).padStart(3, '0')}`;
    
    return {
      id: i + 1,
      code,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'code' | 'game'>('all');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'cart'>('home');
  const [showBuyInstructionDialog, setShowBuyInstructionDialog] = useState(false);
  const [selectedPurchaseAccount, setSelectedPurchaseAccount] = useState<Account | null>(null);
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);

  const allCategories = useMemo(() => {
    return ['all', 'budget', 'standard', 'premium', 'ultimate'];
  }, []);

  const filteredAccounts = accounts.filter(acc => {
    let matchesSearch = true;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      if (searchType === 'code') {
        matchesSearch = acc.code.toLowerCase().includes(query);
      } else if (searchType === 'game') {
        matchesSearch = acc.games.some(game => game.toLowerCase().includes(query));
      } else {
        matchesSearch = acc.title.toLowerCase().includes(query) ||
          acc.code.toLowerCase().includes(query) ||
          acc.games.some(game => game.toLowerCase().includes(query));
      }
    }
    
    const matchesCategory = selectedGame === 'all' || acc.category === selectedGame;
    const matchesPrice = acc.price >= priceRange[0] && acc.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleBuyClick = (account: Account) => {
    setSelectedPurchaseAccount(account);
    setShowBuyInstructionDialog(true);
  };

  const handleProceedToVK = () => {
    window.open('https://vk.com/steamshop_nnd', '_blank');
    setShowBuyInstructionDialog(false);
    toast({
      title: "Переход в VK",
      description: "Не забудьте указать код товара!",
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
                variant="ghost"
                onClick={() => window.open('https://vk.com/steamshop_nnd', '_blank')}
                className="neon-border-purple"
                size={isMobile ? "icon" : "default"}
              >
                <Icon name="MessageCircle" className={isMobile ? "h-4 w-4" : "mr-2 h-4 w-4"} />
                {!isMobile && "Связаться"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentView === 'home' && (
          <div className="space-y-12">
            <section className={`relative ${isMobile ? 'min-h-[60vh]' : 'min-h-[80vh]'} flex items-center justify-center overflow-hidden rounded-2xl border-2 border-primary/40`}>
              <div className="absolute inset-0">
                <img 
                  src="https://cdn.poehali.dev/projects/db4e1f04-0046-48d1-9285-137548b5fdfa/files/f8ac1226-b287-4022-9b74-72c978445ff3.jpg"
                  alt="Gaming Hero"
                  className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
              </div>
              <div className="relative z-10 text-center space-y-6 md:space-y-10 px-4">
                <h1 className={`${isMobile ? 'text-5xl' : 'text-8xl md:text-9xl'} font-bold neon-glow tracking-wider`}>
                  STEAM<span className="text-secondary">SHOP</span>
                </h1>
                <p className={`${isMobile ? 'text-lg' : 'text-3xl md:text-4xl'} text-foreground/90 max-w-4xl mx-auto font-semibold`}>
                  🎮 Лучшие Steam аккаунты с играми<br/>
                  Полный доступ · Мгновенная доставка · Низкие цены
                </p>
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center pt-4">
                  <Button 
                    size={isMobile ? "default" : "lg"}
                    onClick={() => setCurrentView('catalog')}
                    className={`neon-border bg-primary hover:bg-primary/90 ${isMobile ? 'text-lg h-14 px-8 w-full sm:w-auto' : 'text-2xl h-20 px-12'}`}
                  >
                    <Icon name="Store" className={`mr-3 ${isMobile ? 'h-5 w-5' : 'h-7 w-7'}`} />
                    Открыть каталог
                  </Button>
                  <Button 
                    size={isMobile ? "default" : "lg"}
                    variant="outline"
                    onClick={() => window.open('https://vk.com/steamshop_nnd', '_blank')}
                    className={`neon-border-purple border-2 ${isMobile ? 'text-lg h-14 px-8 w-full sm:w-auto' : 'text-2xl h-20 px-12'}`}
                  >
                    <Icon name="MessageCircle" className={`mr-3 ${isMobile ? 'h-5 w-5' : 'h-7 w-7'}`} />
                    Связаться с нами
                  </Button>
                </div>
              </div>
            </section>

            <section id="features" className="space-y-8">
              <h2 className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-bold text-center neon-glow text-primary mb-12`}>
                Почему выбирают нас?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 text-center hover:neon-border transition-all hover:scale-105">
                  <Icon name="Shield" className="h-16 w-16 mx-auto mb-6 text-primary" />
                  <h3 className="text-2xl font-bold mb-3 text-primary">100% Безопасность</h3>
                  <p className="text-muted-foreground text-base">Все аккаунты проверены, без банов и ограничений. Гарантия качества!</p>
                </Card>
                
                <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 text-center hover:neon-border-purple transition-all hover:scale-105">
                  <Icon name="Zap" className="h-16 w-16 mx-auto mb-6 text-secondary" />
                  <h3 className="text-2xl font-bold mb-3 text-secondary">Мгновенная выдача</h3>
                  <p className="text-muted-foreground text-base">Получите полный доступ к аккаунту сразу после связи с нами</p>
                </Card>
                
                <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 text-center hover:neon-border transition-all hover:scale-105">
                  <Icon name="DollarSign" className="h-16 w-16 mx-auto mb-6 text-primary" />
                  <h3 className="text-2xl font-bold mb-3 text-primary">Лучшие цены</h3>
                  <p className="text-muted-foreground text-base">Аккаунты от 299₽ · Большой выбор категорий · Скидки постоянным клиентам</p>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm border-primary/30">
                  <Icon name="Package" className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-3 text-primary">Что входит в покупку?</h3>
                  <ul className="space-y-2 text-foreground/80">
                    <li className="flex items-center gap-2"><Icon name="Check" className="h-4 w-4 text-secondary" /> Логин и пароль Steam</li>
                    <li className="flex items-center gap-2"><Icon name="Check" className="h-4 w-4 text-secondary" /> Email с полным доступом</li>
                    <li className="flex items-center gap-2"><Icon name="Check" className="h-4 w-4 text-secondary" /> Все игры активированы</li>
                    <li className="flex items-center gap-2"><Icon name="Check" className="h-4 w-4 text-secondary" /> Инструкция по смене данных</li>
                  </ul>
                </Card>
                
                <Card className="p-8 bg-gradient-to-br from-secondary/10 to-primary/10 backdrop-blur-sm border-secondary/30">
                  <Icon name="HeartHandshake" className="h-12 w-12 mb-4 text-secondary" />
                  <h3 className="text-xl font-bold mb-3 text-secondary">Наши гарантии</h3>
                  <ul className="space-y-2 text-foreground/80">
                    <li className="flex items-center gap-2"><Icon name="Check" className="h-4 w-4 text-primary" /> Быстрая поддержка 24/7</li>
                    <li className="flex items-center gap-2"><Icon name="Check" className="h-4 w-4 text-primary" /> Замена при проблемах</li>
                    <li className="flex items-center gap-2"><Icon name="Check" className="h-4 w-4 text-primary" /> Проверка перед продажей</li>
                    <li className="flex items-center gap-2"><Icon name="Check" className="h-4 w-4 text-primary" /> Честные описания</li>
                  </ul>
                </Card>
              </div>
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
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm md:text-base text-primary group-hover:neon-glow transition-all line-clamp-2 flex-1">
                          {account.title}
                        </CardTitle>
                        <Badge className="bg-primary/20 text-primary border border-primary text-xs font-mono font-bold shrink-0">
                          {account.code}
                        </Badge>
                      </div>
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
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Icon name="Search" className="h-6 w-6 text-primary neon-glow" />
                    <h3 className="text-xl font-bold text-primary">Поиск аккаунтов</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Button
                      variant={searchType === 'all' ? 'default' : 'outline'}
                      onClick={() => setSearchType('all')}
                      className={searchType === 'all' ? 'neon-border' : ''}
                    >
                      <Icon name="List" className="mr-2 h-4 w-4" />
                      Все поля
                    </Button>
                    <Button
                      variant={searchType === 'code' ? 'default' : 'outline'}
                      onClick={() => setSearchType('code')}
                      className={searchType === 'code' ? 'neon-border' : ''}
                    >
                      <Icon name="Hash" className="mr-2 h-4 w-4" />
                      По коду
                    </Button>
                    <Button
                      variant={searchType === 'game' ? 'default' : 'outline'}
                      onClick={() => setSearchType('game')}
                      className={searchType === 'game' ? 'neon-border' : ''}
                    >
                      <Icon name="Gamepad2" className="mr-2 h-4 w-4" />
                      По игре
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchType('all');
                        setSelectedGame('all');
                        setPriceRange([0, 20000]);
                      }}
                      className="border-secondary/50 hover:border-secondary"
                      title="Очистить все фильтры"
                    >
                      <Icon name="X" className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder={
                        searchType === 'code' ? 'Введите код товара (например: BU001, ST025)...' :
                        searchType === 'game' ? 'Введите название игры (например: CS:GO, Dota 2)...' :
                        'Поиск по коду, названию или игре...'
                      }
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 border-primary/30 focus:border-primary neon-border"
                    />
                  </div>
                  
                  {searchQuery && (
                    <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/30">
                      <p className="text-sm text-foreground/80">
                        Поиск: <span className="text-primary font-bold">{searchType === 'code' ? 'по коду' : searchType === 'game' ? 'по игре' : 'везде'}</span>
                        {' • '}
                        Запрос: <span className="text-primary font-mono font-bold">"{searchQuery}"</span>
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchQuery('')}
                        className="h-8"
                      >
                        <Icon name="X" className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-foreground flex items-center gap-2 text-sm font-medium">
                      <Icon name="Gamepad2" className="h-4 w-4 text-primary" />
                      Категория
                    </label>
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
                    <label className="text-foreground flex items-center gap-2 text-sm font-medium">
                      <Icon name="DollarSign" className="h-4 w-4 text-secondary" />
                      Цена: {priceRange[0]} - {priceRange[1]} ₽
                    </label>
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
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-sm text-primary group-hover:neon-glow transition-all line-clamp-2 flex-1">
                        {account.title}
                      </CardTitle>
                      <Badge variant="outline" className="border-secondary text-secondary shrink-0">
                        ★ {account.rating}
                      </Badge>
                    </div>
                    <Badge className="bg-primary/20 text-primary border border-primary text-xs font-mono font-bold w-fit mb-2">
                      Код: {account.code}
                    </Badge>
                    <CardDescription className="text-xs text-foreground/70">
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
                        handleBuyClick(account);
                      }}
                      className="neon-border bg-primary hover:bg-primary/90"
                    >
                      <Icon name="ShoppingBag" className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}

        {currentView === 'cart' && (
          <div className="max-w-4xl mx-auto">
            <Card className="p-12 text-center bg-card/50 backdrop-blur-sm border-primary/20">
              <Icon name="MessageCircle" className="h-16 w-16 mx-auto mb-4 text-primary neon-glow" />
              <h2 className="text-3xl font-bold mb-4 neon-glow text-primary">Оформление заказа</h2>
              <p className="text-xl text-muted-foreground mb-6">Для покупки аккаунтов свяжитесь с нами в VK</p>
              <Button 
                size="lg"
                onClick={() => window.open('https://vk.com/steamshop_nnd', '_blank')}
                className="neon-border bg-primary hover:bg-primary/90"
              >
                <Icon name="MessageCircle" className="mr-2 h-5 w-5" />
                Связаться в VK
              </Button>
            </Card>
          </div>
        )}


      </main>

      <Dialog open={!!selectedAccount} onOpenChange={() => setSelectedAccount(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-primary/30 neon-border">
          {selectedAccount && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <DialogTitle className="text-2xl md:text-3xl text-primary neon-glow pr-8">
                    {selectedAccount.title}
                  </DialogTitle>
                  <Badge className="bg-primary/20 text-primary border-2 border-primary text-base px-3 py-1 font-mono font-bold neon-glow shrink-0">
                    {selectedAccount.code}
                  </Badge>
                </div>
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
                        handleBuyClick(selectedAccount);
                        setSelectedAccount(null);
                      }}
                      className="neon-border w-full sm:w-auto bg-primary hover:bg-primary/90"
                    >
                      <Icon name="ShoppingBag" className="mr-2 h-5 w-5" />
                      Купить аккаунт
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showBuyInstructionDialog} onOpenChange={setShowBuyInstructionDialog}>
        <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-xl border-primary/30 neon-border">
          <DialogHeader>
            <DialogTitle className="text-3xl text-primary neon-glow flex items-center gap-3">
              <Icon name="ShoppingBag" className="h-8 w-8" />
              Инструкция по покупке
            </DialogTitle>
            <DialogDescription className="text-base text-foreground/80 mt-4">
              Чтобы купить аккаунт, выполните следующие шаги:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {selectedPurchaseAccount && (
              <Card className="p-4 bg-primary/10 border-primary/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-lg text-primary mb-1">{selectedPurchaseAccount.title}</h4>
                    <p className="text-sm text-muted-foreground">{selectedPurchaseAccount.description}</p>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-2 border-primary text-lg px-4 py-2 font-mono font-bold neon-glow">
                    {selectedPurchaseAccount.code}
                  </Badge>
                </div>
                <Separator className="my-3" />
                <div className="text-2xl font-bold text-primary neon-glow">
                  {selectedPurchaseAccount.price} ₽
                </div>
              </Card>
            )}

            <div className="space-y-4">
              <Card className="p-4 bg-secondary/10 border-secondary/30">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/20 text-secondary font-bold shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-secondary mb-1">Перейдите по кнопке "Купить"</h4>
                    <p className="text-sm text-foreground/80">Вы будете перенаправлены в группу VKонтакте</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-secondary/10 border-secondary/30">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/20 text-secondary font-bold shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-secondary mb-1">Нажмите кнопку "Сообщение"</h4>
                    <p className="text-sm text-foreground/80">Она находится снизу названия сообщества</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-secondary/10 border-secondary/30">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/20 text-secondary font-bold shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-secondary mb-1">Напишите код товара</h4>
                    <p className="text-sm text-foreground/80 mb-2">Отправьте код в сообщения сообщества для оформления покупки</p>
                    {selectedPurchaseAccount && (
                      <Badge className="bg-primary/20 text-primary border border-primary text-base px-3 py-1 font-mono font-bold">
                        Ваш код: {selectedPurchaseAccount.code}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            <div className="pt-4 space-y-3">
              <Button 
                size="lg"
                className="w-full neon-border bg-primary hover:bg-primary/90 text-lg h-14"
                onClick={handleProceedToVK}
              >
                <Icon name="MessageCircle" className="mr-2 h-6 w-6" />
                Перейти в VK и купить
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="w-full"
                onClick={() => setShowBuyInstructionDialog(false)}
              >
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;