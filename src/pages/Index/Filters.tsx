import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Account } from './types';

type FiltersProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchType: 'all' | 'code' | 'game';
  setSearchType: (type: 'all' | 'code' | 'game') => void;
  selectedGame: string;
  setSelectedGame: (game: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  accounts: Account[];
  filteredCount: number;
  isMobile: boolean;
};

export const Filters = ({
  searchQuery,
  setSearchQuery,
  searchType,
  setSearchType,
  selectedGame,
  setSelectedGame,
  priceRange,
  setPriceRange,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  accounts,
  filteredCount,
  isMobile
}: FiltersProps) => {
  const allGames = Array.from(new Set(accounts.flatMap(a => a.games))).sort();

  const handleResetFilters = () => {
    setSearchQuery('');
    setSearchType('all');
    setSelectedGame('all');
    setPriceRange([0, 10000]);
    setSelectedCategory('all');
    setSortBy('price-asc');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={
              searchType === 'code' ? 'Поиск по коду (например: PR001)' :
              searchType === 'game' ? 'Поиск по игре (например: CS:GO)' :
              'Поиск аккаунтов...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 neon-border-input h-12"
          />
        </div>
        <Select value={searchType} onValueChange={(value: 'all' | 'code' | 'game') => setSearchType(value)}>
          <SelectTrigger className="w-full sm:w-48 neon-border-input h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Везде</SelectItem>
            <SelectItem value="code">По коду</SelectItem>
            <SelectItem value="game">По игре</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-4'} gap-4`}>
        <Select value={selectedGame} onValueChange={setSelectedGame}>
          <SelectTrigger className="neon-border-input">
            <SelectValue placeholder="Выберите игру" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все игры</SelectItem>
            {allGames.slice(0, 50).map((game) => (
              <SelectItem key={game} value={game}>{game}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={`${priceRange[0]}-${priceRange[1]}`} onValueChange={(value) => {
          const [min, max] = value.split('-').map(Number);
          setPriceRange([min, max]);
        }}>
          <SelectTrigger className="neon-border-input">
            <SelectValue placeholder="Цена" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-10000">Любая цена</SelectItem>
            <SelectItem value="0-500">До 500₽</SelectItem>
            <SelectItem value="500-1000">500₽ - 1000₽</SelectItem>
            <SelectItem value="1000-2000">1000₽ - 2000₽</SelectItem>
            <SelectItem value="2000-10000">От 2000₽</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="neon-border-input">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            <SelectItem value="budget">Стартовый</SelectItem>
            <SelectItem value="standard">Стандарт</SelectItem>
            <SelectItem value="premium">Премиум</SelectItem>
            <SelectItem value="ultimate">Ультимейт</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="neon-border-input">
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Сначала дешевые</SelectItem>
            <SelectItem value="price-desc">Сначала дорогие</SelectItem>
            <SelectItem value="games-desc">Больше игр</SelectItem>
            <SelectItem value="rating-desc">Лучший рейтинг</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="outline" className="text-sm py-1">
          Найдено: {filteredCount} аккаунтов
        </Badge>
        {(searchQuery || selectedGame !== 'all' || priceRange[0] !== 0 || priceRange[1] !== 10000 || selectedCategory !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="text-secondary hover:text-secondary/80"
          >
            <Icon name="X" className="mr-2 h-4 w-4" />
            Сбросить фильтры
          </Button>
        )}
      </div>
    </div>
  );
};
