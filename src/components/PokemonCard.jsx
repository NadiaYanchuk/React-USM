import React from 'react';

const PokemonCard = ({ pokemon, onClick }) => {
    const getTypeColor = (type) => {
        const colors = {
            normal: 'bg-gray-400',
            fire: 'bg-red-500',
            water: 'bg-blue-500',
            electric: 'bg-yellow-400',
            grass: 'bg-green-500',
            ice: 'bg-blue-200',
            fighting: 'bg-red-700',
            poison: 'bg-purple-500',
            ground: 'bg-yellow-600',
            flying: 'bg-indigo-400',
            psychic: 'bg-pink-500',
            bug: 'bg-green-400',
            rock: 'bg-yellow-700',
            ghost: 'bg-purple-700',
            dragon: 'bg-indigo-700',
            dark: 'bg-gray-700',
            steel: 'bg-gray-500',
            fairy: 'bg-pink-300',
        };
        return colors[type] || 'bg-gray-400';
    };

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl shadow-lg pokemon-card-hover cursor-pointer overflow-hidden relative group"
        >
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 flex justify-center items-center h-48 relative">
                <img
                    src={pokemon.sprites?.front_default || 'https://via.placeholder.com/150'}
                    alt={pokemon.name}
                    className="w-32 h-32 object-contain drop-shadow-2xl group-hover:animate-bounce-slow transition-all duration-300"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150';
                    }}
                />
            </div>
            
            <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 capitalize mb-2 text-center transition-colors">
                    {pokemon.name}
                </h3>
                
                <div className="flex justify-center gap-2 mb-3 flex-wrap">
                    {pokemon.types?.map((type, index) => (
                        <span
                            key={index}
                            className={`${getTypeColor(type.type.name)} text-white px-3 py-1 rounded-full text-xs font-semibold uppercase`}
                            >
                            {type.type.name}
                        </span>
                    ))}
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                        <span>Рост:</span>
                        <span className="font-semibold">{pokemon.height / 10} м</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Вес:</span>
                        <span className="font-semibold">{pokemon.weight / 10} кг</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PokemonCard;
