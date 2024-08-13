import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../api/AuthContext';
import MovieList from '../components/List';

const WatchList = () => {
  const { currentUser } = useContext(AuthContext);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.email;
      const watchlistKey = `watchlist_${userId}`;
      const storedWatchlist = JSON.parse(localStorage.getItem(watchlistKey)) || [];
      setWatchlist(storedWatchlist);
    }
  }, [currentUser]);

  const removeFromWatchlist = (movie) => {
    if (currentUser) {
      const userId = currentUser.email;
      const watchlistKey = `watchlist_${userId}`;
      const updatedWatchlist = watchlist.filter(item => item.imdbID !== movie.imdbID);
      setWatchlist(updatedWatchlist);
      localStorage.setItem(watchlistKey, JSON.stringify(updatedWatchlist));
    }
  };

  if (!currentUser) {
    return (
      <div className="p-4">
        <h1 className="text-4xl mb-6">My Watchlist</h1>
        <p className="text-lg text-red-500">You must be logged in to see your watchlist.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-4xl mb-6">My Watchlist</h1>
      <MovieList watchlist={watchlist} removeFromList={removeFromWatchlist} />
    </div>
  );
};

export default WatchList;
