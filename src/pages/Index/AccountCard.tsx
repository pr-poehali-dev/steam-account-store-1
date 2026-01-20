import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import type { Account } from './types';

type AccountCardProps = {
  account: Account;
  onSelect: (account: Account) => void;
  isMobile?: boolean;
};

export const AccountCard = ({ account, onSelect, isMobile }: AccountCardProps) => {
  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:neon-border bg-card/50 backdrop-blur-sm border-primary/20"
      onClick={() => onSelect(account)}
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
          <CardTitle className={`${isMobile ? 'text-base' : 'text-xl'} line-clamp-2 flex-1`}>
            {account.title}
          </CardTitle>
          <Badge className="bg-secondary/20 text-secondary border-secondary/30 shrink-0">
            {account.code}
          </Badge>
        </div>
        <CardDescription className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
          {account.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Icon name="Star" className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span className="font-semibold">{account.rating}</span>
            <span className="text-muted-foreground">({account.reviews} отзывов)</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {account.games.slice(0, 3).map((game, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {game}
              </Badge>
            ))}
            {account.gamesCount > 3 && (
              <Badge variant="outline" className="text-xs">
                +{account.gamesCount - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div>
          <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-primary`}>
            {account.price}₽
          </div>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
            {account.region}
          </div>
        </div>
        <Button
          size={isMobile ? 'sm' : 'default'}
          className="neon-border bg-primary hover:bg-primary/90"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(account);
          }}
        >
          <Icon name="Eye" className="mr-2 h-4 w-4" />
          Подробнее
        </Button>
      </CardFooter>
    </Card>
  );
};
