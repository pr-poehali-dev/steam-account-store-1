import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/b0061fb1-24b7-478a-a6ec-7e5dba753eeb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно!',
          description: 'Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.',
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось отправить сообщение',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при отправке сообщения',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const faqItems = [
    {
      question: 'Как происходит передача аккаунта после покупки?',
      answer: 'После оплаты вы мгновенно получите доступ к личным данным аккаунта: логин, пароль, email и пароль от email. Все данные отправляются в личный кабинет и на вашу почту.'
    },
    {
      question: 'Что делать, если данные от аккаунта не подходят?',
      answer: 'Если вы столкнулись с проблемами при входе, немедленно свяжитесь с нами через форму обратной связи или напишите на steamshop202@gmail.com. Мы проверим данные и предоставим замену или вернём деньги в течение 24 часов.'
    },
    {
      question: 'Можно ли вернуть деньги за аккаунт?',
      answer: 'Да, возврат возможен в течение 24 часов после покупки, если аккаунт не соответствует описанию или возникли технические проблемы. Обратите внимание: после первого входа в аккаунт возврат не производится, если все данные верны.'
    },
    {
      question: 'Безопасна ли покупка аккаунтов?',
      answer: 'Мы гарантируем безопасность всех транзакций. Все аккаунты проверены, не имеют банов и ограничений. Мы используем защищенные каналы для передачи данных и работаем официально.'
    },
    {
      question: 'Как долго обрабатывается заказ?',
      answer: 'Большинство заказов обрабатываются автоматически и мгновенно. В редких случаях (при оплате через некоторые банки) обработка может занять до 15 минут. Если прошло больше времени — свяжитесь с поддержкой.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 neon-border mb-4">
            <Icon name="Headphones" className="w-10 h-10 text-primary neon-glow" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
            Поддержка
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Свяжитесь с нами по любым вопросам. Мы всегда рады помочь!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="neon-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Icon name="Mail" className="w-6 h-6 text-primary" />
                Форма обратной связи
              </CardTitle>
              <CardDescription>
                Заполните форму и мы свяжемся с вами в ближайшее время
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ваше имя</label>
                  <Input
                    placeholder="Иван Иванов"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border-primary/30 focus:border-primary"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="example@mail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-primary/30 focus:border-primary"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Сообщение</label>
                  <Textarea
                    placeholder="Опишите ваш вопрос или проблему..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="min-h-[150px] border-primary/30 focus:border-primary resize-none"
                    disabled={loading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full neon-border"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Icon name="Loader2" className="mr-2 h-5 w-5 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Icon name="Send" className="mr-2 h-5 w-5" />
                      Отправить сообщение
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="neon-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Icon name="Contact" className="w-6 h-6 text-primary" />
                  Контакты
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <Icon name="Mail" className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-muted-foreground mb-1">Email поддержки</p>
                    <a 
                      href="mailto:steamshop202@gmail.com" 
                      className="text-primary hover:text-primary/80 font-mono transition-colors"
                    >
                      steamshop202@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/5 border border-secondary/20">
                  <Icon name="Clock" className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-muted-foreground mb-1">Время работы</p>
                    <p className="text-foreground">Ежедневно, 24/7</p>
                    <p className="text-xs text-muted-foreground mt-1">Среднее время ответа: 2-4 часа</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-accent/5 border border-accent/20">
                  <Icon name="Shield" className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-muted-foreground mb-1">Гарантии</p>
                    <p className="text-foreground text-sm">
                      Все аккаунты проверены. Гарантия возврата денег в течение 24 часов при наличии проблем.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="neon-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Icon name="HelpCircle" className="w-6 h-6 text-primary" />
              Часто задаваемые вопросы
            </CardTitle>
            <CardDescription>
              Ответы на популярные вопросы о покупке аккаунтов
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    <span className="font-medium">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Не нашли ответ на свой вопрос? Напишите нам — мы обязательно поможем!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Support;
