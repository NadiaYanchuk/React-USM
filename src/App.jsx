import { useState, useEffect } from 'react';
import PokemonList from './components/PokemonList';
import PokemonModal from './components/PokemonModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
    const [pokemons, setPokemons] = useState([]);
    const [allPokemons, setAllPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages] = useState(5);

    const ITEMS_PER_PAGE = 20;
    const TOTAL_ITEMS = ITEMS_PER_PAGE * totalPages;

    const fetchAllPokemons = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_ITEMS}&offset=0`
            );
            const data = await response.json();

            // Получаем детальную информацию о каждом покемоне
            const detailedPokemons = await Promise.all(
                data.results.map(async (pokemon) => {
                    const res = await fetch(pokemon.url);
                    const pokemonData = await res.json();
                    // Добавляем уникальный ключ для избежания дубликатов
                    return {
                        ...pokemonData,
                        uniqueKey: `${pokemonData.id}-${Date.now()}-${Math.random()}`
                    };
                })
            );

            setAllPokemons(detailedPokemons);
            setLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки покемонов:', error);
            setLoading(false);
        }
    };

    // Загрузка всех покемонов при монтировании компонента
    useEffect(() => {
        fetchAllPokemons();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Обновление отображаемых покемонов при изменении страницы
    useEffect(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setPokemons(allPokemons.slice(startIndex, endIndex));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, allPokemons]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleViewPokemon = (pokemon) => {
        setSelectedPokemon(pokemon);
        setIsCreateMode(false);
        setIsModalOpen(true);
    };

    const handleCreatePokemon = () => {
        setSelectedPokemon(null);
        setIsCreateMode(true);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPokemon(null);
        setIsCreateMode(false);
    };

    const handleCreate = (newPokemon) => {
        console.log('Creating pokemon:', newPokemon);
        
        const pokemon = {
        id: Date.now(), // Генерируем уникальный ID
        uniqueKey: `custom-${Date.now()}-${Math.random()}`,
        name: newPokemon.name.toLowerCase(),
        height: parseInt(newPokemon.height),
        weight: parseInt(newPokemon.weight),
        types: newPokemon.types.split(',').map((type) => ({
            type: { name: type.trim().toLowerCase() },
        })),
        abilities: newPokemon.abilities.split(',').map((ability) => ({
            ability: { name: ability.trim().toLowerCase() },
        })),
        sprites: {
            front_default: newPokemon.image || 'https://via.placeholder.com/150',
        },
        stats: [
            { stat: { name: 'hp' }, base_stat: parseInt(newPokemon.hp) || 0 },
            { stat: { name: 'attack' }, base_stat: parseInt(newPokemon.attack) || 0 },
            { stat: { name: 'defense' }, base_stat: parseInt(newPokemon.defense) || 0 },
        ],
        };

        console.log('Pokemon object:', pokemon);
        setAllPokemons([pokemon, ...allPokemons]);
        setCurrentPage(1); // Переходим на первую страницу
        handleCloseModal();
    };

    const handleUpdate = (updatedPokemon) => {
        setAllPokemons(
        allPokemons.map((pokemon) =>
            pokemon.id === updatedPokemon.id
            ? {
                ...pokemon,
                name: updatedPokemon.name.toLowerCase(),
                height: parseInt(updatedPokemon.height),
                weight: parseInt(updatedPokemon.weight),
                types: updatedPokemon.types.split(',').map((type) => ({
                    type: { name: type.trim().toLowerCase() },
                })),
                abilities: updatedPokemon.abilities.split(',').map((ability) => ({
                    ability: { name: ability.trim().toLowerCase() },
                })),
                sprites: {
                    ...pokemon.sprites,
                    front_default: updatedPokemon.image || pokemon.sprites.front_default,
                },
                stats: [
                    { stat: { name: 'hp' }, base_stat: parseInt(updatedPokemon.hp) || 0 },
                    { stat: { name: 'attack' }, base_stat: parseInt(updatedPokemon.attack) || 0 },
                    { stat: { name: 'defense' }, base_stat: parseInt(updatedPokemon.defense) || 0 },
                ],
                }
            : pokemon
        )
        );
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этого покемона?')) {
            setAllPokemons(allPokemons.filter((pokemon) => pokemon.id !== id));
            handleCloseModal();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 py-8 px-4">
            <div className="container mx-auto max-w-7xl">
                <header className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <img 
                        src="/logo/main.svg" 
                        alt="Pokemon Logo" 
                        className="h-36 w-auto drop-shadow-2xl"
                    />
                </div>
                <p className="text-xl text-white/90 mb-6">
                    Управляй своей коллекцией покемонов
                </p>
                <button
                    onClick={handleCreatePokemon}
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Добавить покемона
                </button>
                </header>

                <PokemonList
                    pokemons={pokemons}
                    loading={loading}
                    onViewPokemon={handleViewPokemon}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />

                {isModalOpen && (
                <PokemonModal
                    pokemon={selectedPokemon}
                    isOpen={isModalOpen}
                    isCreateMode={isCreateMode}
                    onClose={handleCloseModal}
                    onCreate={handleCreate}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                />
                )}
            </div>
        </div>
    );
}

export default App;
