import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';

const FilterPanel = ({ 
    filters, 
    onFilterChange, 
    onResetFilters, 
    availableTypes,
    foundCount
}) => {
    const pokemonTypes = availableTypes || [
        'normal', 'fire', 'water', 'electric', 'grass', 'ice',
        'fighting', 'poison', 'ground', 'flying', 'psychic', 
        'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
    ];

    const sortOptions = [
        { value: 'name-asc', label: 'Имя (А-Я)' },
        { value: 'name-desc', label: 'Имя (Я-А)' },
        { value: 'height-asc', label: 'Рост (возр.)' },
        { value: 'height-desc', label: 'Рост (убыв.)' },
        { value: 'weight-asc', label: 'Вес (возр.)' },
        { value: 'weight-desc', label: 'Вес (убыв.)' },
    ];

    const handleTypeToggle = (type) => {
        const newTypes = filters.types.includes(type)
            ? filters.types.filter(t => t !== type)
            : [...filters.types, type];
        onFilterChange({ ...filters, types: newTypes });
    };

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
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg mb-6 p-6 transition-all">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold text-sm">
                    <FontAwesomeIcon icon={Icons.faCheckCircle} className="mr-2" />
                    Найдено: {foundCount}
                </div>
                <button
                    onClick={onResetFilters}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
                >
                    <FontAwesomeIcon icon={Icons.faUndo} />
                    Сбросить
                </button>
            </div>

            <div>
                {/* Сортировка */}
                <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FontAwesomeIcon icon={Icons.faSort} className="mr-2" />
                    Сортировка
                </label>
                <select
                    value={filters.sortBy}
                    onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                >
                    {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Типы покемонов */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <FontAwesomeIcon icon={Icons.faTags} className="mr-2" />
                    Типы покемонов ({filters.types.length} выбрано)
                </label>
                <div className="flex flex-wrap gap-2">
                    {pokemonTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => handleTypeToggle(type)}
                            className={`${getTypeColor(type)} ${
                                filters.types.includes(type) 
                                    ? 'ring-4 ring-offset-2 ring-yellow-400 scale-105' 
                                    : 'opacity-50 hover:opacity-100'
                            } text-white px-4 py-2 rounded-full text-sm font-semibold uppercase transition transform hover:scale-105`}
                        >
                            {filters.types.includes(type) && (
                                <FontAwesomeIcon icon={Icons.faCheck} className="mr-1" />
                            )}
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Диапазон роста */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Максимальный рост: {filters.heightRange[1]} дм ({filters.heightRange[1] / 10}м)
                </label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.heightRange[1]}
                    onChange={(e) => onFilterChange({ 
                        ...filters, 
                        heightRange: [0, parseInt(e.target.value)] 
                    })}
                    className="w-full"
                />
            </div>

            {/* Диапазон веса */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Максимальный вес: {filters.weightRange[1]} гг ({filters.weightRange[1] / 10}кг)
                </label>
                <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.weightRange[1]}
                    onChange={(e) => onFilterChange({ 
                        ...filters, 
                        weightRange: [0, parseInt(e.target.value)] 
                    })}
                    className="w-full"
                />
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;
