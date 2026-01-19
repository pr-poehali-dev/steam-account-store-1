import { useState, useEffect } from 'react';

type DeviceMode = 'auto' | 'mobile' | 'desktop';

export const useDeviceMode = () => {
  const [mode, setMode] = useState<DeviceMode>(() => {
    const saved = localStorage.getItem('device-mode');
    return (saved as DeviceMode) || 'auto';
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      if (mode === 'auto') {
        setIsMobile(window.innerWidth < 768);
      } else if (mode === 'mobile') {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, [mode]);

  const setDeviceMode = (newMode: DeviceMode) => {
    setMode(newMode);
    localStorage.setItem('device-mode', newMode);
  };

  return { mode, isMobile, setDeviceMode };
};
