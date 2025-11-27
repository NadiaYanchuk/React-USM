import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePokemon } from '../context/PokemonContext';
import ConfirmModal from '../components/ConfirmModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faTrash, faRulerVertical, faWeightHanging, faHeart, faBolt, faShield, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const PokemonDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getById, deleteEntity, pokemons, loading } = usePokemon();
    const [showConfirm, setShowConfirm] = useState(false);

    const pokemon = getById(id);
    
    // Найти индекс текущего покемона
    const currentIndex = pokemons.findIndex(p => p.id === parseInt(id));
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < pokemons.length - 1;
    
    const handlePrevious = () => {
        if (hasPrevious) {
            const previousPokemon = pokemons[currentIndex - 1];
            navigate(`/pokemon/${previousPokemon.id}`);
        }
    };
    
    const handleNext = () => {
        if (hasNext) {
            const nextPokemon = pokemons[currentIndex + 1];
            navigate(`/pokemon/${nextPokemon.id}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                <div className="pokeball-spinner"></div>
            </div>
        );
    }

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

    const handleDelete = () => {
        setShowConfirm(true);
    };

    const handleConfirmDelete = () => {
        deleteEntity(id);
        navigate('/');
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
    };

    const handleEdit = () => {
        navigate(`/edit/${id}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 py-8 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-semibold transition shadow-lg"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="md:mr-2" />
                        <span className="hidden md:inline">Назад к списку</span>
                    </button>
                    
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrevious}
                            disabled={!hasPrevious}
                            className={`${
                                hasPrevious 
                                    ? 'bg-white hover:bg-gray-100 text-gray-800' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            } px-4 py-2 rounded-lg font-semibold transition shadow-lg flex items-center gap-2`}
                            title="Предыдущий покемон"
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                            <span className="hidden md:inline">Предыдущий</span>
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={!hasNext}
                            className={`${
                                hasNext 
                                    ? 'bg-white hover:bg-gray-100 text-gray-800' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            } px-4 py-2 rounded-lg font-semibold transition shadow-lg flex items-center gap-2`}
                            title="Следующий покемон"
                        >
                            <span className="hidden md:inline">Следующий</span>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-4xl font-bold capitalize mb-2">{pokemon.name}</h1>
                                <div className="flex gap-2">
                                    {pokemon.types?.map((type, index) => (
                                        <span
                                            key={index}
                                            className={`${getTypeColor(type.type.name)} px-4 py-2 rounded-full text-sm font-semibold uppercase shadow-md`}
                                        >
                                            {type.type.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleEdit}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-semibold transition shadow-lg"
                                >
                                    <FontAwesomeIcon icon={faEdit} className="md:mr-2" />
                                    <span className="hidden md:inline">Редактировать</span>
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition shadow-lg"
                                >
                                    <FontAwesomeIcon icon={faTrash} className="md:mr-2" />
                                    <span className="hidden md:inline">Удалить</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl p-8 flex items-center justify-center">
                                <img
                                    src={pokemon.sprites?.front_default || 'https://via.placeholder.com/300'}
                                    alt={pokemon.name}
                                    className="w-64 h-64 object-contain drop-shadow-2xl"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300';
                                    }}
                                />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Характеристики</h2>
                                
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-600 font-semibold">
                                                <FontAwesomeIcon icon={faRulerVertical} className="mr-2 text-blue-500" />
                                                Рост
                                            </span>
                                            <span className="text-gray-800 font-bold">{pokemon.height / 10} м</span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-600 font-semibold">
                                                <FontAwesomeIcon icon={faWeightHanging} className="mr-2 text-green-500" />
                                                Вес
                                            </span>
                                            <span className="text-gray-800 font-bold">{pokemon.weight / 10} кг</span>
                                        </div>
                                    </div>

                                    {pokemon.stats && (
                                        <>
                                            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Статистика</h3>
                                            {pokemon.stats.map((stat, index) => {
                                                const statIcons = {
                                                    hp: faHeart,
                                                    attack: faBolt,
                                                    defense: faShield,
                                                };
                                                const icon = statIcons[stat.stat.name] || '';
                                                const statColors = {
                                                    hp: 'bg-red-500',
                                                    attack: 'bg-orange-500',
                                                    defense: 'bg-blue-500',
                                                };
                                                const color = statColors[stat.stat.name] || 'bg-gray-500';

                                                return (
                                                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-gray-600 font-semibold capitalize">
                                                                <FontAwesomeIcon icon={icon} className="mr-2" />
                                                                {stat.stat.name}
                                                            </span>
                                                            <span className="text-gray-800 font-bold">{stat.base_stat}</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                                            <div
                                                                className={`${color} h-3 rounded-full transition-all duration-500`}
                                                                style={{ width: `${Math.min((stat.base_stat / 100) * 100, 100)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {showConfirm && (
                <ConfirmModal
                    message={`Вы уверены, что хотите удалить ${pokemon.name}?`}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>
    );
};

export default PokemonDetailPage;
