import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';
import { useDeviceMode } from '@/hooks/use-device-mode';
import { Account, generateAccounts } from '@/pages/Index/types';
import { Header } from '@/pages/Index/Header';
import { AccountCard } from '@/pages/Index/AccountCard';
import { Filters } from '@/pages/Index/Filters';

const Index = () => {
  const navigate = useNavigate();
  const { mode, isMobile, setDeviceMode } = useDeviceMode();
  const [accounts] = useState<Account[]>(generateAccounts());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'code' | 'game'>('all');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'cart'>('home');
  const [showBuyInstructionDialog, setShowBuyInstructionDialog] = useState(false);
  const [selectedPurchaseAccount, setSelectedPurchaseAccount] = useState<Account | null>(null);
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('price-asc');

  useEffect(() => {
    const userEmail = localStorage.getItem('user_email');
    if (!userEmail) {
      navigate('/login');
    }
  }, [navigate]);

  const filteredAndSortedAccounts = useMemo(() => {
    let filtered = accounts;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((account) => {
        if (searchType === 'code') {
          return account.code.toLowerCase().includes(query);
        } else if (searchType === 'game') {
          return account.games.some(game => game.toLowerCase().includes(query));
        } else {
          return (
            account.title.toLowerCase().includes(query) ||
            account.code.toLowerCase().includes(query) ||
            account.description.toLowerCase().includes(query) ||
            account.games.some(game => game.toLowerCase().includes(query))
          );
        }
      });
    }

    if (selectedGame !== 'all') {
      filtered = filtered.filter(account => account.games.includes(selectedGame));
    }

    if (priceRange[0] !== 0 || priceRange[1] !== 10000) {
      filtered = filtered.filter(account => 
        account.price >= priceRange[0] && account.price <= priceRange[1]
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(account => account.category === selectedCategory);
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'games-desc':
          return b.gamesCount - a.gamesCount;
        case 'rating-desc':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return sorted;
  }, [accounts, searchQuery, searchType, selectedGame, priceRange, selectedCategory, sortBy]);

  const handleBuyClick = (account: Account) => {
    setSelectedPurchaseAccount(account);
    setShowBuyInstructionDialog(true);
  };

  const handleConfirmPurchase = () => {
    if (selectedPurchaseAccount) {
      toast({
        title: "Покупка оформлена!",
        description: `Аккаунт ${selectedPurchaseAccount.code} добавлен в корзину. Перейдите в личный кабинет для завершения покупки.`,
      });
      setShowBuyInstructionDialog(false);
      setSelectedAccount(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        isMobile={isMobile}
        mode={mode}
        setDeviceMode={setDeviceMode}
      />

      <main className="container mx-auto px-4 pt-24 md:pt-28 pb-12">
        {currentView === 'home' && (
          <div className="space-y-8 md:space-y-12">
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20 p-8 md:p-12">
              <div className="relative z-10">
                <h2 className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'} font-bold mb-4 neon-glow`}>
                  Добро пожаловать в STEAMSHOP
                </h2>
                <p className={`${isMobile ? 'text-base' : 'text-lg md:text-xl'} text-muted-foreground mb-6 md:mb-8 max-w-2xl`}>
                  Лучшие Steam аккаунты с играми по выгодным ценам. Гарантия качества и безопасности.
                </p>
                <Button
                  size={isMobile ? 'default' : 'lg'}
                  onClick={() => setCurrentView('catalog')}
                  className="neon-border bg-primary hover:bg-primary/90"
                >
                  <Icon name="Store" className="mr-2 h-5 w-5" />
                  Перейти в каталог
                </Button>
              </div>
            </section>

            <section>
              <h3 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-6`}>
                Популярные предложения
              </h3>
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                {accounts.slice(0, 6).map((account) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    onSelect={setSelectedAccount}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {currentView === 'catalog' && (
          <div className="space-y-6">
            <div>
              <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl md:text-4xl'} font-bold mb-2`}>
                Каталог аккаунтов
              </h2>
              <p className="text-muted-foreground">
                Найдите идеальный аккаунт Steam для себя
              </p>
            </div>

            <Filters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchType={searchType}
              setSearchType={setSearchType}
              selectedGame={selectedGame}
              setSelectedGame={setSelectedGame}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              accounts={accounts}
              filteredCount={filteredAndSortedAccounts.length}
              isMobile={isMobile}
            />

            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
              {filteredAndSortedAccounts.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onSelect={setSelectedAccount}
                  isMobile={isMobile}
                />
              ))}
            </div>

            {filteredAndSortedAccounts.length === 0 && (
              <div className="text-center py-12">
                <Icon name="Search" className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Аккаунты не найдены</h3>
                <p className="text-muted-foreground">
                  Попробуйте изменить параметры поиска или фильтры
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <Dialog open={selectedAccount !== null} onOpenChange={() => setSelectedAccount(null)}>
        <DialogContent className={`${isMobile ? 'w-[95vw] max-w-[95vw]' : 'max-w-3xl'}`}>
          {selectedAccount && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <DialogTitle className={`${isMobile ? 'text-xl' : 'text-2xl'} mb-2`}>
                      {selectedAccount.title}
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-2">
                      <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                        {selectedAccount.code}
                      </Badge>
                      <span className="text-sm">•</span>
                      <span className="flex items-center gap-1">
                        <Icon name="Star" className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-semibold">{selectedAccount.rating}</span>
                        <span className="text-muted-foreground">({selectedAccount.reviews})</span>
                      </span>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <ScrollArea className={`${isMobile ? 'max-h-[60vh]' : 'max-h-[70vh]'} pr-4`}>
                <div className="space-y-6">
                  <div className="aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                    <img
                      src={selectedAccount.image}
                      alt={selectedAccount.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Описание</h4>
                    <p className="text-muted-foreground">{selectedAccount.fullDescription}</p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Игры в аккаунте ({selectedAccount.gamesCount})</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAccount.games.map((game, idx) => (
                        <Badge key={idx} variant="outline">
                          {game}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-3">Характеристики</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Icon name="Award" className="h-4 w-4 text-primary" />
                          <span>Уровень: {selectedAccount.level}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="Clock" className="h-4 w-4 text-primary" />
                          <span>Часов наиграно: {selectedAccount.hours}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="Globe" className="h-4 w-4 text-primary" />
                          <span>Регион: {selectedAccount.region}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="Mail" className="h-4 w-4 text-primary" />
                          <span>Email: {selectedAccount.email}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Преимущества</h4>
                      <div className="space-y-2">
                        {selectedAccount.privileges.map((privilege, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <Icon name="CheckCircle" className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>{privilege}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                    <div>
                      <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-primary`}>
                        {selectedAccount.price}₽
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Полный доступ к аккаунту
                      </div>
                    </div>
                    <Button
                      size={isMobile ? 'default' : 'lg'}
                      onClick={() => handleBuyClick(selectedAccount)}
                      className="neon-border bg-primary hover:bg-primary/90"
                    >
                      <Icon name="ShoppingCart" className="mr-2 h-5 w-5" />
                      Купить сейчас
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showBuyInstructionDialog} onOpenChange={setShowBuyInstructionDialog}>
        <DialogContent className={`${isMobile ? 'w-[95vw] max-w-[95vw]' : 'max-w-2xl'}`}>
          <DialogHeader>
            <DialogTitle className={`${isMobile ? 'text-xl' : 'text-2xl'}`}>
              Подтверждение покупки
            </DialogTitle>
            <DialogDescription>
              Вы собираетесь приобрести аккаунт {selectedPurchaseAccount?.code}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-primary/10 rounded-lg space-y-2">
              <h4 className="font-semibold">Детали покупки:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Аккаунт:</span>
                  <span className="font-medium">{selectedPurchaseAccount?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Код:</span>
                  <span className="font-medium">{selectedPurchaseAccount?.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Игр:</span>
                  <span className="font-medium">{selectedPurchaseAccount?.gamesCount}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Итого:</span>
                  <span className="font-bold text-primary">{selectedPurchaseAccount?.price}₽</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-secondary/10 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="Info" className="h-5 w-5 text-secondary" />
                Что вы получите:
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle" className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Логин и пароль от аккаунта Steam</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle" className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Доступ к привязанной почте</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle" className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Инструкция по безопасному использованию</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle" className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Гарантия замены в случае проблем</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowBuyInstructionDialog(false)}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                onClick={handleConfirmPurchase}
                className="flex-1 neon-border bg-primary hover:bg-primary/90"
              >
                <Icon name="CheckCircle" className="mr-2 h-5 w-5" />
                Подтвердить покупку
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
