import React, { useContext, useState, useEffect } from 'react';
import { Menu, MenuItem, Icon, Confirm } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../api/AuthContext';

const Sidebar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [activeItem, setActiveItem] = useState('');
  const [customWatchlists, setCustomWatchlists] = useState([]);
  const [watchlistsOpen, setWatchlistsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.email;
      const watchlistKeys = Object.keys(localStorage).filter(key => key.startsWith(`watchlist_${userId}_`) && key !== `watchlist_${userId}`);
      setCustomWatchlists(watchlistKeys.map(key => key.replace(`watchlist_${userId}_`, '')));
    }
  }, [currentUser]);

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
    if (name === 'home') {
      navigate('/');
    } else if (name === 'watchlist') {
      navigate('/watchlist');
    } else if (name.startsWith('userlist_')) {
      navigate(`/userlist/${name.replace('userlist_', '')}`);
    }
  };

  const handleLogout = () => {
    setConfirmOpen(true);
  };

  const confirmLogout = () => {
    logout();
    setConfirmOpen(false);
    window.location.reload();
  };

  const handleDeleteWatchlist = (listName) => {
    if (currentUser) {
      const userId = currentUser.email;
      const watchlistKey = `watchlist_${userId}_${listName}`;
      localStorage.removeItem(watchlistKey);
      setCustomWatchlists(customWatchlists.filter(list => list !== listName));
      window.location.reload();
    }
  };

  return (
    <div className="w-80 h-screen flex flex-col">
      <Menu fluid vertical className="flex-1 text-white border-none shadow-lg">
        <h1 className="text-5xl mb-6 text-red-500 font-bold tracking-wide ml-6">WatchLists</h1>
        <div className="flex-grow">
          <MenuItem
            className="text-2xl p-2 rounded cursor-pointer hover:bg-red-500 flex items-center"
            style={{ marginTop: "auto" }}
          >
            {currentUser ? (
              <>
                <Icon name='logout' onClick={handleLogout} />
                <span className="ml-2">{currentUser.fullName}</span>
              </>
            ) : (
              <>
                <Icon name='user' className="mr-2" onClick={() => navigate('/auth')} />
                <span className="ml-2">Guest</span>
              </>
            )}
          </MenuItem>
        </div>
        <MenuItem
          name='home'
          active={activeItem === 'home'}
          onClick={handleItemClick}
          className={`text-2xl p-2 rounded mb-4 cursor-pointer ${
            activeItem === 'home' ? 'bg-red-700' : 'hover:bg-red-500'
          }`}
        >
          Home
        </MenuItem>

        <MenuItem
          name='lists'
          active={activeItem === 'lists'}
          onClick={() => setWatchlistsOpen(!watchlistsOpen)}
          className={`text-2xl p-2 rounded mb-4 cursor-pointer ${
            activeItem === 'lists' ? 'bg-red-700' : 'hover:bg-red-500'
          }`}
        >
          My Lists
          <Icon name={watchlistsOpen ? 'angle up' : 'angle down'} className="ml-2" />
        </MenuItem>
        {watchlistsOpen && (
          <Menu fluid vertical className="ml-4" size='massive'>
            <MenuItem
              name='watchlist'
              active={activeItem === 'watchlist'}
              onClick={handleItemClick}
              className={`text-xl p-2 rounded mb-2 cursor-pointer ${
                activeItem === 'watchlist' ? 'bg-red-600' : 'hover:bg-red-400'
              }`}
            >
              Watchlist
            </MenuItem>
            {customWatchlists.map((list, index) => (
              <MenuItem
                key={index}
                name={`userlist_${list}`}
                active={activeItem === `userlist_${list}`}
                onClick={handleItemClick}
                className={`text-xl p-2 rounded mb-2 cursor-pointer flex justify-between ${
                  activeItem === `userlist_${list}` ? 'bg-red-600' : 'hover:bg-red-400'
                }`}
              >
                {list}
                <Icon
                  name='trash alternate'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteWatchlist(list);
                  }}
                />
              </MenuItem>
            ))}
          </Menu>
        )}
      </Menu>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmLogout}
        content='Are you sure you want to logout?'
      />
    </div>
  );
};

export default Sidebar;
