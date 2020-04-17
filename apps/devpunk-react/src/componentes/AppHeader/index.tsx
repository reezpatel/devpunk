import React from 'react';
import { SitesResponse } from '@devpunk/models';
import './AppHeader.scss';

interface AppHeaderProps {
  sites: SitesResponse[];
  setActiveSite: React.Dispatch<React.SetStateAction<string>>;
  activeSite: string;
}

const AppHeader: (props: AppHeaderProps) => JSX.Element = ({
  sites,
  activeSite,
  setActiveSite
}) => {
  const onItemSelected = site => () => {
    setActiveSite(site);
  };

  return (
    <nav>
      <h1>Feeds</h1>
      <ul>
        <li>
          <a
            className={activeSite === 'ALL' ? 'active' : ''}
            onClick={onItemSelected('ALL')}
          >
            All Feeds
          </a>
        </li>
        <li>
          <a
            className={activeSite === 'PINNED' ? 'active' : ''}
            onClick={onItemSelected('PINNED')}
          >
            Pinned Feeds
          </a>
        </li>
        {sites.map(site => (
          <li key={site.id}>
            <a
              className={activeSite === site.id ? 'active' : ''}
              onClick={onItemSelected(site.id)}
            >
              {site.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AppHeader;
