import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

const Header = () => {
    return (
        <div className="w-full mx-auto my-4 p-4 bg-white rounded-lg shadow-lg border-4 border-red-600">
            <h1 className="text-5xl font-bold text-center">
                <span className="text-black">Welcome to </span>
                <span className="text-red-600">WatchLists</span>
            </h1>      
            <p className="text-2xl mt-10">
                Browse movies, add them to watchlists and share them with friends.
            </p>
            <p className="text-2xl mb-4 mt-1">
                Just click the <Icon name='bookmark' /> to add a movie, click the poster to see more details or to mark the movie as watched.
            </p>
        </div>
    );
};

export default Header;
