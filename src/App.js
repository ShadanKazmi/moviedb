import { Route, Routes } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import WatchList from './pages/WatchList'
import Auth from './pages/Auth';
import CustomList from './pages/CustomList';

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watchlist" element={<WatchList />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/userlist/:name" element={<CustomList />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
