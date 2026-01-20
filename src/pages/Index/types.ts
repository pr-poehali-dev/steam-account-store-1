export type Account = {
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

export const generateAccounts = (): Account[] => {
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
