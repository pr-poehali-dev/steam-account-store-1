import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const generateUserId = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let userId = localStorage.getItem('user_uid');
    
    if (!userId) {
      userId = generateUserId();
      localStorage.setItem('user_uid', userId);
    }

    localStorage.setItem('user_email', `user${userId}@steamshop.local`);
    localStorage.setItem('user_name', `Пользователь ${userId}`);
    localStorage.setItem('user_photo', `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`);

    navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg">Загрузка...</p>
      </div>
    </div>
  );
};

export default Login;