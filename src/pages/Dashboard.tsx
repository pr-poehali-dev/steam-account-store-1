import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhoto, setUserPhoto] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('user_email');
    if (!email) {
      navigate('/login');
      return;
    }

    setUserEmail(email);
    setUserName(localStorage.getItem('user_name') || 'Пользователь');
    setUserPhoto(localStorage.getItem('user_photo') || '');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_photo');
    localStorage.removeItem('user_uid');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={() => navigate('/')}>
            <Icon name="Home" className="w-4 h-4 mr-2" />
            На главную
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            <Icon name="LogOut" className="w-4 h-4 mr-2" />
            Выйти
          </Button>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={userPhoto} alt={userName} />
                  <AvatarFallback className="text-2xl">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">Личный кабинет</CardTitle>
                  <CardDescription className="text-lg">{userName}</CardDescription>
                  <p className="text-sm text-muted-foreground">{userEmail}</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Icon name="ShoppingCart" className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Мои покупки</CardTitle>
                    <CardDescription>0 аккаунтов</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Icon name="Heart" className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Избранное</CardTitle>
                    <CardDescription>0 аккаунтов</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Icon name="Clock" className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">История</CardTitle>
                    <CardDescription>0 просмотров</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Последние действия</CardTitle>
              <CardDescription>
                Здесь будет отображаться история ваших действий
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="History" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>История пока пуста</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
