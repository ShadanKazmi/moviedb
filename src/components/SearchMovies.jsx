import React, { useState, useContext, useEffect } from 'react';
import { Input, Card, Icon, Image, Modal, Button, Form, Dropdown } from 'semantic-ui-react';
import { getMovieByTitle, getMovieBySearch } from '../api/getMovies';
import { AuthContext } from '../api/AuthContext';

const SearchMovies = () => {
  const { currentUser } = useContext(AuthContext);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [watchlistModalOpen, setWatchlistModalOpen] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [existingWatchlists, setExistingWatchlists] = useState([]);
  const [selectedWatchlist, setSelectedWatchlist] = useState('');

  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.email;
      const watchlistKeys = Object.keys(localStorage).filter(key => key.startsWith(`watchlist_${userId}_`));
      const watchlists = watchlistKeys.map(key => key.replace(`watchlist_${userId}_`, ''));
      setExistingWatchlists(watchlists);
    }
  }, [currentUser]);

  const handleSearch = async () => {
    try {
      const movie = await getMovieBySearch(query);
      if (movie) {
        setResults(movie);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error(`Error fetching movie: ${error.message}`);
      setResults([]);
    }
  };

  const openModal = (movie) => {
    setSelectedMovie(movie);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setModalOpen(false);
  };

  const openWatchlistModal = (movie) => {
    setSelectedMovie(movie);
    setWatchlistModalOpen(true);
  };

  const closeWatchlistModal = () => {
    setSelectedMovie(null);
    setWatchlistModalOpen(false);
    setNewWatchlistName('');
    setSelectedWatchlist('');
  };

  const addToWatchlist = (movie, watchlistName) => {
    if (!currentUser) {
      alert('Please log in to add movies to your watchlist');
      return;
    }

    const userId = currentUser.email;
    const watchlistKey = watchlistName ? `watchlist_${userId}_${watchlistName}` : `watchlist_${userId}`;
    const existingWatchlist = JSON.parse(localStorage.getItem(watchlistKey)) || [];
    const isAlreadyInWatchlist = existingWatchlist.some(item => item.imdbID === movie.imdbID);

    if (!isAlreadyInWatchlist) {
      const updatedWatchlist = [...existingWatchlist, movie];
      localStorage.setItem(watchlistKey, JSON.stringify(updatedWatchlist));
      closeWatchlistModal();
      window.location.reload();
    } else {
      alert(`${movie.Title} is already in the watchlist`);
    }
  };

  const isMovieInWatchlist = (movie) => {
    if (!currentUser) return false;
    const userId = currentUser.email;
    const watchlistKey = `watchlist_${userId}`;
    const existingWatchlist = JSON.parse(localStorage.getItem(watchlistKey)) || [];
    return existingWatchlist.some(item => item.imdbID === movie.imdbID);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <Input
          placeholder='Search movies, shows by their title...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          action={{
            color: 'black',
            labelPosition: 'left',
            icon: 'search',
            onClick: handleSearch,
            content:'Search',
          }}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {results.map(movie => (
          <Card
            key={movie.imdbID}
            className="cursor-pointer bg-white shadow-lg rounded-lg relative transition-transform duration-300 transform hover:scale-105 hover:shadow-xl"
            onClick={() => openModal(movie)}
          >
            <Image src={movie.Poster} wrapped ui={false} className="rounded-t-lg" />
            <Icon
              name={isMovieInWatchlist(movie) ? 'check' : 'bookmark'}
              size='big'
              className={`text-gray-600 cursor-pointer absolute z-10 top-3 left-3 transition-colors duration-300 ${isMovieInWatchlist(movie) ? 'text-green-600' : currentUser ? 'hover:text-blue-600' : 'opacity-50 cursor-not-allowed'}`}
              onClick={(e) => {
                e.stopPropagation();
                if (currentUser) {
                  openWatchlistModal(movie);
                } else {
                  alert('Please log in to add movies to your watchlist');
                }
              }}
            />
            <Card.Content className="mt-8">
              <Card.Header className="text-lg font-bold">{movie.Title} ({movie.Year})</Card.Header>
              <Card.Description className="text-gray-600">Cast: {movie.Actors}</Card.Description>
              <Card.Description className="text-gray-600">Genre: {movie.Genre}</Card.Description>
              <Card.Description className="text-gray-600">IMDb: {movie.imdbRating}</Card.Description>
            </Card.Content>
          </Card>
        ))}
      </div>

      {selectedMovie && (
        <Modal open={modalOpen} onClose={closeModal} size='small'>
          <Modal.Header>{selectedMovie.Title} ({selectedMovie.Year})</Modal.Header>
          <Modal.Content>
            <div className="flex justify-center mb-4">
              <Image src={selectedMovie.Poster} wrapped ui={false} className="rounded-lg max-w-full object-cover" />
            </div>
            <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
            <p><strong>Director:</strong> {selectedMovie.Director}</p>
            <p><strong>Cast:</strong> {selectedMovie.Actors}</p>
            <p><strong>Language:</strong> {selectedMovie.Language}</p>
            <p><strong>Plot:</strong> {selectedMovie.Plot}</p>
            <p><strong>BoxOffice:</strong> {selectedMovie.BoxOffice}</p>
            <p><strong>IMDb:</strong> {selectedMovie.imdbRating} <Icon name='star' color='yellow' /></p>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={closeModal} color='blue'>Close</Button>
          </Modal.Actions>
        </Modal>
      )}

      {watchlistModalOpen && (
        <Modal open={watchlistModalOpen} onClose={closeWatchlistModal} size='small'>
          <Modal.Header>Add to Watchlist</Modal.Header>
          <Modal.Content>
            <p>Would you like to add {selectedMovie?.Title} to an existing watchlist or create a new one?</p>
            <Form>
              <Form.Field>
                <label>New Watchlist Name</label>
                <Input
                  placeholder='Enter watchlist name...'
                  value={newWatchlistName}
                  onChange={(e) => setNewWatchlistName(e.target.value)}
                />
              </Form.Field>
              <Form.Field>
                <label>Select Existing Watchlist</label>
                <Dropdown
                  placeholder='Select Watchlist'
                  fluid
                  selection
                  options={existingWatchlists.map(watchlist => ({
                    key: watchlist,
                    text: watchlist,
                    value: watchlist,
                  }))}
                  value={selectedWatchlist}
                  onChange={(e, { value }) => setSelectedWatchlist(value)}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => addToWatchlist(selectedMovie, newWatchlistName)} color='blue'>Add to New Watchlist</Button>
            <Button onClick={() => addToWatchlist(selectedMovie, selectedWatchlist)} color='blue'>Add to Selected Watchlist</Button>
            <Button onClick={() => addToWatchlist(selectedMovie, '')} color='blue'>Add to Default</Button>
            <Button onClick={closeWatchlistModal} color='grey'>Cancel</Button>
          </Modal.Actions>
        </Modal>
      )}
    </div>
  );
};

export default SearchMovies;
