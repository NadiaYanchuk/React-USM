import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';

const PokemonModal = ({
    pokemon,
    isOpen,
    isCreateMode,
    onClose,
    onCreate,
    onUpdate,
    onDelete,
    onOpenDetailPage,
}) => {
    const [isEditMode, setIsEditMode] = useState(isCreateMode);
    
    const getInitialFormData = () => {
        if (pokemon && !isCreateMode) {
            return {
                id: pokemon.id,
                name: pokemon.name,
                height: pokemon.height,
                weight: pokemon.weight,
                types: pokemon.types?.map((t) => t.type.name).join(', ') || '',
                abilities: pokemon.abilities?.map((a) => a.ability.name).join(', ') || '',
                image: pokemon.sprites?.front_default || '',
                hp: pokemon.stats?.find((s) => s.stat.name === 'hp')?.base_stat || '',
                attack: pokemon.stats?.find((s) => s.stat.name === 'attack')?.base_stat || '',
                defense: pokemon.stats?.find((s) => s.stat.name === 'defense')?.base_stat || '',
            };
        }
        return {
            id: '',
            name: '',
            height: '',
            weight: '',
            types: '',
            abilities: '',
            image: '',
            hp: '',
            attack: '',
            defense: '',
        };
    };

    const [formData, setFormData] = useState(getInitialFormData());

    // Обновляем форму при изменении покемона
    useEffect(() => {
        setFormData(getInitialFormData());
        setIsEditMode(isCreateMode);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pokemon?.id, isCreateMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isCreateMode) {
            onCreate(formData);
        } else {
            onUpdate(formData);
        }
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold capitalize">
                            {isCreateMode ? (
                                <>
                                    <FontAwesomeIcon icon={Icons.faPlus} className="mr-2" />
                                    Создать покемона
                                </>
                            ) : (
                                pokemon?.name || 'Покемон'
                            )}
                        </h2>
                        <div className="flex items-center gap-3">
                            {/* Кнопка открытия на отдельной странице */}
                            {!isCreateMode && onOpenDetailPage && (
                                <button
                                    onClick={() => {
                                        onOpenDetailPage(pokemon);
                                        onClose();
                                    }}
                                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={Icons.faExternalLinkAlt} />
                                    Открыть страницу
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="text-white hover:text-gray-200 text-3xl font-bold transition hover:scale-110"
                            >
                                <FontAwesomeIcon icon={Icons.faTimes} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {!isEditMode && !isCreateMode && pokemon && (
                        <div>
                            <div className="flex justify-center mb-6">
                                <img
                                    src={pokemon.sprites?.front_default || 'https://via.placeholder.com/150'}
                                    alt={pokemon.name}
                                    className="w-48 h-48 object-contain drop-shadow-2xl"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/150';
                                    }}
                                />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1 flex items-center">
                                        <FontAwesomeIcon icon={Icons.faTag} className="mr-2" />
                                        Типы
                                    </h3>
                                    <div className="flex gap-2">
                                        {pokemon.types?.map((type, index) => (
                                            <span
                                                key={index}
                                                className={`${getTypeColor(type.type.name)} text-white px-4 py-2 rounded-full text-sm font-semibold uppercase`}
                                            >
                                                {type.type.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1 flex items-center">
                                            Рост
                                        </h3>
                                        <p className="text-2xl font-bold text-gray-800">
                                            {pokemon.height / 10} м
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1 flex items-center">
                                            Вес
                                        </h3>
                                        <p className="text-2xl font-bold text-gray-800">
                                            {pokemon.weight / 10} кг
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2 flex items-center">
                                        Способности
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {pokemon.abilities?.map((ability, index) => (
                                            <span
                                                key={index}
                                                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm capitalize"
                                            >
                                                {ability.ability.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2 flex items-center">
                                        <FontAwesomeIcon icon={Icons.faChartBar} className="mr-2" />
                                        Характеристики
                                    </h3>
                                    <div className="space-y-2">
                                        {pokemon.stats?.slice(0, 6).map((stat, index) => (
                                            <div key={index}>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm font-medium text-gray-700 capitalize">
                                                        {stat.stat.name}
                                                    </span>
                                                    <span className="text-sm font-bold text-gray-800">
                                                        {stat.base_stat}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                                                        style={{ width: `${Math.min((stat.base_stat / 255) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setIsEditMode(true)}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition"
                                >
                                    <FontAwesomeIcon icon={Icons.faEdit} className="mr-2" />
                                    Редактировать
                                </button>
                                <button
                                    onClick={() => onDelete(pokemon.id)}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition"
                                >
                                    <FontAwesomeIcon icon={Icons.faTrash} className="mr-2" />
                                    Удалить
                                </button>
                            </div>
                        </div>
                    )}

                    {(isEditMode || isCreateMode) && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Имя *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Например: Pikachu"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Рост (дм) *
                                    </label>
                                    <input
                                        type="number"
                                        name="height"
                                        value={formData.height}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="4"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Вес (гектограмм) *
                                    </label>
                                    <input
                                        type="number"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="60"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Типы (через запятую) *
                                </label>
                                <input
                                    type="text"
                                    name="types"
                                    value={formData.types}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="electric, fairy"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Способности (через запятую) *
                                </label>
                                <input
                                    type="text"
                                    name="abilities"
                                    value={formData.abilities}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="static, lightning-rod"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    URL изображения
                                </label>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        <FontAwesomeIcon icon={Icons.faHeart} className="mr-2" />
                                        HP
                                    </label>
                                    <input
                                        type="number"
                                        name="hp"
                                        value={formData.hp}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="45"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        <FontAwesomeIcon icon={Icons.faFistRaised} className="mr-2" />
                                        Атака
                                    </label>
                                    <input
                                        type="number"
                                        name="attack"
                                        value={formData.attack}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="49"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        <FontAwesomeIcon icon={Icons.faShield} className="mr-2" />
                                        Защита
                                    </label>
                                    <input
                                        type="number"
                                        name="defense"
                                        value={formData.defense}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="49"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition"
                                >
                                    <FontAwesomeIcon icon={isCreateMode ? Icons.faPlus : Icons.faSave} className="mr-2" />
                                    {isCreateMode ? 'Создать' : 'Сохранить'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => (isCreateMode ? onClose() : setIsEditMode(false))}
                                    className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition"
                                >
                                    <FontAwesomeIcon icon={Icons.faTimes} className="mr-2" />
                                    Отмена
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PokemonModal;
