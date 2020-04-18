import React, { useState, useEffect, useRef, useReducer } from 'react';
import { FeedResponse } from '@devpunk/models';
import FeedsItem from '../FeedsItem';
import { http } from '../../utils/http';

import './FeedsContainer.scss';
import { SearchIcon } from '../Icons/SearchIcon';
import { CloseIcon } from '../Icons/CloseIcon';

const LOAD_FEED_OFFSET = 520;

const getColumns = (): number => {
  if (window.matchMedia('(max-width: 700px)').matches) {
    return 2;
  }

  if (window.matchMedia('(max-width: 1200px)').matches) {
    return 3;
  }

  return 4;
};

const columns = getColumns();

interface FeedsContainerProps {
  activeSite: string;
  toggleMenu: () => void;
}

const FeedsContainer: (props: FeedsContainerProps) => JSX.Element = ({
  activeSite,
  toggleMenu
}) => {
  const feeds = useRef<FeedResponse[][]>(
    Array(columns)
      .fill(1)
      .map(() => [])
  );
  const loading = useRef(false);
  const page = useRef(0);
  const hasNext = useRef(true);
  const timeout = useRef<any>();
  const container = useRef<HTMLDivElement>();
  const [pendingFeeds, setPendingFeeds] = useState<FeedResponse[]>([]);
  const [query, setQuery] = useState<string>('');
  const [isSearchEnabled, setSearchEnabled] = useState(false);

  const addToContainer = () => {
    if (pendingFeeds.length === 0) {
      return;
    }

    let index = 0;
    let minHeight = Number.MAX_SAFE_INTEGER;

    const _feeds = JSON.parse(JSON.stringify(pendingFeeds)) as FeedResponse[];
    const feed = _feeds.splice(0, 1);

    container.current.childNodes.forEach((node: HTMLDivElement, i) => {
      const height = node.clientHeight;
      if (height < minHeight) {
        minHeight = height;
        index = i;
      }
    });

    feeds.current[index].push(feed[0]);

    setPendingFeeds(_feeds);
  };

  const addFeeds = async () => {
    if (loading.current || !hasNext.current || pendingFeeds.length !== 0) {
      return;
    }
    loading.current = true;

    const newFeeds = await http.getFeeds(page.current + 1, activeSite, query);
    hasNext.current = newFeeds.meta.hasNext;
    page.current = page.current + 1;
    loading.current = false;

    setPendingFeeds(newFeeds.data);
  };

  const handleIconClick = () => {
    toggleMenu();
  };

  const handleWrapperScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const {
      clientHeight,
      scrollHeight,
      scrollTop
    } = e.target as HTMLDivElement;

    if (clientHeight + scrollTop + LOAD_FEED_OFFSET >= scrollHeight) {
      addFeeds();
    }
  };

  const handleActionButtonClicked = () => {
    if (isSearchEnabled) {
      setQuery('');
    }
    setSearchEnabled(!isSearchEnabled);
  };

  const handleInputChange = e => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }

    const { value } = e.target;
    timeout.current = setTimeout(() => {
      setQuery(value);
      timeout.current = null;
    }, 600);
  };

  useEffect(() => {
    addToContainer();
  }, [pendingFeeds.length]);

  useEffect(() => {
    feeds.current = Array(columns)
      .fill(1)
      .map(() => []);
    page.current = 0;
    hasNext.current = true;
    addFeeds();
  }, [activeSite, query]);

  return (
    <div className="feeds-container">
      <header>
        <div className="header-title">
          <h1>DevPunk</h1>
          <h3>Latest news at you fingertips</h3>
        </div>
        <div className="header-options">
          <div className="header-search">
            {isSearchEnabled && (
              <input onChange={handleInputChange} type="text"></input>
            )}
            {isSearchEnabled ? (
              <CloseIcon onClick={handleActionButtonClicked} />
            ) : (
              <SearchIcon onClick={handleActionButtonClicked} />
            )}
          </div>
          <div className="header-logo">
            <img
              onClick={handleIconClick}
              src={http.getSiteIcon(activeSite)}
            ></img>
          </div>
        </div>
      </header>
      <div className="feed-wrapper" onScroll={handleWrapperScroll}>
        <div
          ref={r => {
            container.current = r;
          }}
          className={`feeds-list-container col-${columns}`}
        >
          {feeds.current.map((col, i) => (
            <div key={i} className="feeds-column">
              {col.map(feed => (
                <FeedsItem key={feed.id} feed={feed} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedsContainer;
