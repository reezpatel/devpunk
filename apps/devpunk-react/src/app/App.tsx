import React, { useState, useEffect } from 'react';
import './App.scss';
import AppHeader from '../componentes/AppHeader';
import { http } from '../utils/http';
import { SitesResponse } from '@devpunk/models';
import FeedsContainer from '../componentes/FeedsContainer';

export const App = () => {
  const [sites, setSites] = useState<SitesResponse[]>([]);
  const [activeSite, setActiveSite] = useState<string>('ALL');
  const [isMenuActive, setMenuActive] = useState<boolean>(false);

  const init = async () => {
    setSites((await http.getSites()).data);
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    setMenuActive(false);
  }, [activeSite]);

  const handleToggleMenu = () => {
    setMenuActive(!isMenuActive);
  };

  return (
    <div className="app">
      <div className={`header ${isMenuActive ? 'active' : ''}`}>
        <AppHeader
          setActiveSite={setActiveSite}
          activeSite={activeSite}
          sites={sites}
        />
      </div>
      <div className="content">
        <FeedsContainer toggleMenu={handleToggleMenu} activeSite={activeSite} />
      </div>
    </div>
  );
};

export default App;
