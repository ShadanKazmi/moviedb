import React, { useState } from 'react';
import { Card, Icon, Image, Button, Modal } from 'semantic-ui-react';

const MovieList = ({ watchlist, removeFromList }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (movie) => {
    setSelectedMovie(movie);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setModalOpen(false);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {watchlist.map(movie => (
          <Card
            key={movie.imdbID}
            className="cursor-pointer bg-white shadow-lg rounded-lg relative transition-transform duration-300 transform hover:scale-105 hover:shadow-xl"
            onClick={() => openModal(movie)}
          >
            <Image src={movie.Poster} wrapped ui={false} className="rounded-t-lg" />
            <Icon
              name='remove circle'
              size='big'
              className="text-gray-600 cursor-pointer absolute z-10 top-3 left-3 transition-colors duration-300 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                removeFromList(movie);
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
    </div>
  );
};

export default MovieList;
