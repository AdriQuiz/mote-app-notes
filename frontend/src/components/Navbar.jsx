import React, { useState } from 'react'
import Search from './SearchBar/Search'
import ProfileInfo from './Cards/ProfileInfo';
import { useNavigate } from 'react-router-dom';

const Navbar = ({userInfo, onSearchNote, handleClearSearch}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if(searchQuery) {
      onSearchNote(searchQuery);
    }
  }

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  }

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className='bg-color-2 flex items-center justify-between px-6 py-2 drop-shadow'>
      <h2 className='text-xl font-medium text-white py-2'>Notes</h2>
      <Search value={searchQuery} handleSearch={handleSearch} onClearSearch={onClearSearch} onChange={({ target }) => {
        setSearchQuery(target.value);
      }} />
      {userInfo && (
        <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
      )}
    </div>
  )
}

export default Navbar