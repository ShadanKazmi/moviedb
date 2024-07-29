import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../api/AuthContext';
import WatchlistGrid from '../components/List';

const CustomList = () => {
  const { currentUser } = useContext(AuthContext);
  const { name } = useParams();
  const [customList, setCustomList] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.email;
      const customListKey = `watchlist_${userId}_${name}`;
      const storedCustomList = JSON.parse(localStorage.getItem(customListKey)) || [];
      setCustomList(storedCustomList);
    }
  }, [currentUser, name]);

  const removeFromCustomList = (movie) => {
    if (currentUser) {
      const userId = currentUser.email;
      const customListKey = `watchlist_${userId}_${name}`;
      const updatedCustomList = customList.filter(item => item.imdbID !== movie.imdbID);
      setCustomList(updatedCustomList);
      localStorage.setItem(customListKey, JSON.stringify(updatedCustomList));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl mb-6">{name} Watchlist</h1>
      <WatchlistGrid watchlist={customList} removeFromList={removeFromCustomList} />
    </div>
  );
};

export default CustomList;
