import React from 'react';
import PokemonCard from './PokemonCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';

const PokemonList = ({ pokemons, loading, onViewPokemon, currentPage, totalPages, onPageChange }) => {
    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                {pokemons.map((pokemon) => (
                    <PokemonCard
                        key={pokemon.uniqueKey || `${pokemon.id}-${pokemon.name}`}
                        pokemon={pokemon}
                        onClick={() => onViewPokemon(pokemon)}
                    />
                ))}
            </div>

            {loading && (
                <div className="text-center py-8">
                    <div className="pokeball-spinner mx-auto"></div>
                    <p className="text-white text-xl mt-4 font-bold">Загрузка покемонов...</p>
                </div>
            )}

            {!loading && pokemons.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-white text-2xl font-bold">Покемоны не найдены!</p>
                    <p className="text-white/80 mt-2">Попробуйте изменить фильтры или добавьте нового покемона</p>
                </div>
            )}

            {!loading && pokemons.length > 0 && (
                <div className="flex justify-center items-center gap-2 py-8">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                            currentPage === 1
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:scale-105'
                        }`}
                    >
                        <FontAwesomeIcon icon={Icons.faChevronLeft} className="md:mr-2" />
                        <span className="hidden md:inline">Предыдущая</span>
                    </button>

                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`w-10 h-10 rounded-lg font-bold transition ${
                                    currentPage === page
                                        ? 'bg-yellow-400 text-gray-900 shadow-lg scale-110'
                                        : 'bg-white text-purple-600 hover:bg-gray-100 shadow-md hover:scale-105'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                            currentPage === totalPages
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:scale-105'
                        }`}
                    >
                        <span className="hidden md:inline">Следующая</span>
                        <FontAwesomeIcon icon={Icons.faChevronRight} className="md:ml-2" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default PokemonList;
