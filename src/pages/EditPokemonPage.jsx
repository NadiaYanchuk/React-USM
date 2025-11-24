import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePokemon } from '../context/PokemonContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faUser, faRulerVertical, faWeightHanging, faImage, faHeart, faBolt, faShield } from '@fortawesome/free-solid-svg-icons';
import Toast from '../components/Toast';

const EditPokemonPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getById, updateEntity } = usePokemon();

    const pokemon = getById(id);
    const [toast, setToast] = useState(null);

    const getInitialFormData = () => {
        if (pokemon) {
            return {
                id: pokemon.id,
                name: pokemon.name,
                height: pokemon.height,
                weight: pokemon.weight,
                image: pokemon.sprites?.front_default || '',
                types: pokemon.types?.map(t => t.type.name) || [],
                hp: pokemon.stats?.find(s => s.stat.name === 'hp')?.base_stat || '',
                attack: pokemon.stats?.find(s => s.stat.name === 'attack')?.base_stat || '',
                defense: pokemon.stats?.find(s => s.stat.name === 'defense')?.base_stat || '',
            };
        }
        return {
            id: '',
            name: '',
            height: '',
            weight: '',
            image: '',
            types: [],
            hp: '',
            attack: '',
            defense: '',
        };
    };

    const [formData, setFormData] = useState(getInitialFormData);

    if (!pokemon) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-white text-3xl font-bold mb-4">Покемон не найден 😢</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Вернуться к списку
                    </button>
                </div>
            </div>
        );
    }

    const pokemonTypes = [
        'normal', 'fire', 'water', 'electric', 'grass', 'ice',
        'fighting', 'poison', 'ground', 'flying', 'psychic',
        'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTypeToggle = (type) => {
        setFormData(prev => ({
            ...prev,
            types: prev.types.includes(type)
                ? prev.types.filter(t => t !== type)
                : [...prev.types, type]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            setToast({ message: 'Введите имя покемона!', type: 'error' });
            return;
        }

        if (formData.types.length === 0) {
            setToast({ message: 'Выберите хотя бы один тип!', type: 'error' });
            return;
        }

        updateEntity(formData);
        navigate(`/pokemon/${id}`);
    };

    const getTypeColor = (type) => {
        const colors = {
            normal: 'bg-gray-400', fire: 'bg-red-500', water: 'bg-blue-500',
            electric: 'bg-yellow-400', grass: 'bg-green-500', ice: 'bg-blue-200',
            fighting: 'bg-red-700', poison: 'bg-purple-500', ground: 'bg-yellow-600',
            flying: 'bg-indigo-400', psychic: 'bg-pink-500', bug: 'bg-green-400',
            rock: 'bg-yellow-700', ghost: 'bg-purple-700', dragon: 'bg-indigo-700',
            dark: 'bg-gray-700', steel: 'bg-gray-500', fairy: 'bg-pink-300',
        };
        return colors[type] || 'bg-gray-400';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 py-8 px-4">
            <div className="container mx-auto max-w-3xl">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => navigate(`/pokemon/${id}`)}
                            className="text-gray-700 hover:text-gray-900 transition text-2xl"
                            title="Назад к деталям"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Редактировать: <span className="capitalize text-blue-600">{pokemon.name}</span>
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <FontAwesomeIcon icon={faUser} className="mr-2" />
                                Имя покемона *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                                placeholder="Введите имя покемона"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <FontAwesomeIcon icon={faRulerVertical} className="mr-2" />
                                    Рост (дм)
                                </label>
                                <input
                                    type="number"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <FontAwesomeIcon icon={faWeightHanging} className="mr-2" />
                                    Вес (гг)
                                </label>
                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <FontAwesomeIcon icon={faImage} className="mr-2" />
                                URL изображения
                            </label>
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Типы покемона *
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {pokemonTypes.map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => handleTypeToggle(type)}
                                        className={`${
                                            formData.types.includes(type)
                                                ? `${getTypeColor(type)} text-white`
                                                : 'bg-gray-200 text-gray-700'
                                        } px-4 py-2 rounded-full text-sm font-semibold uppercase transition hover:scale-105`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="border-t-2 pt-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Статистика</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <FontAwesomeIcon icon={faHeart} className="mr-2 text-red-500" />
                                        HP
                                    </label>
                                    <input
                                        type="number"
                                        name="hp"
                                        value={formData.hp}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <FontAwesomeIcon icon={faBolt} className="mr-2 text-orange-500" />
                                        Attack
                                    </label>
                                    <input
                                        type="number"
                                        name="attack"
                                        value={formData.attack}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <FontAwesomeIcon icon={faShield} className="mr-2 text-blue-500" />
                                        Defense
                                    </label>
                                    <input
                                        type="number"
                                        name="defense"
                                        value={formData.defense}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition shadow-lg"
                            >
                                <FontAwesomeIcon icon={faSave} className="mr-2" />
                                Сохранить изменения
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(`/pokemon/${id}`)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg transition"
                            >
                                Отмена
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default EditPokemonPage;
