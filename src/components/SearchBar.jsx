import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({ searchQuery, onSearchChange }) => {
    return (
        <div className="relative flex-1">
            <div className="relative">
                <FontAwesomeIcon 
                    icon={Icons.faSearch} 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 z-10 pointer-events-none"
                />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Поиск покемонов..."
                    className="w-full pl-12 pr-10 py-3 rounded-lg border-2 border-white/30 bg-white/90 backdrop-blur-sm focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition text-base shadow-lg"
                />
                {searchQuery && (
                    <button
                        onClick={() => onSearchChange('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition z-10"
                    >
                        <FontAwesomeIcon icon={Icons.faTimes} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
