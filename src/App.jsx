import { useState, useEffect, useMemo } from 'react';
import PokemonList from './components/PokemonList';
import PokemonModal from './components/PokemonModal';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChevronDown, faChevronUp, faFilter } from '@fortawesome/free-solid-svg-icons';
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
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [filters, setFilters] = useState({
        types: [],
        sortBy: 'name-asc',
        heightRange: [0, 100],
        weightRange: [0, 1000],
    });

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

    // Мемоизированная фильтрация и поиск
    const filteredPokemons = useMemo(() => {
        let result = [...allPokemons];

        // Поиск по имени
        if (searchQuery) {
            result = result.filter(pokemon =>
                pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Фильтр по типам
        if (filters.types.length > 0) {
            result = result.filter(pokemon =>
                pokemon.types?.some(type =>
                    filters.types.includes(type.type.name)
                )
            );
        }

        // Фильтр по росту
        result = result.filter(pokemon =>
            pokemon.height >= filters.heightRange[0] &&
            pokemon.height <= filters.heightRange[1]
        );

        // Фильтр по весу
        result = result.filter(pokemon =>
            pokemon.weight >= filters.weightRange[0] &&
            pokemon.weight <= filters.weightRange[1]
        );

        // Сортировка
        switch (filters.sortBy) {
            case 'name-asc':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'height-asc':
                result.sort((a, b) => a.height - b.height);
                break;
            case 'height-desc':
                result.sort((a, b) => b.height - a.height);
                break;
            case 'weight-asc':
                result.sort((a, b) => a.weight - b.weight);
                break;
            case 'weight-desc':
                result.sort((a, b) => b.weight - a.weight);
                break;
            default:
                break;
        }

        return result;
    }, [allPokemons, searchQuery, filters]);

    useEffect(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setPokemons(filteredPokemons.slice(startIndex, endIndex));
    }, [currentPage, filteredPokemons]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filters]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Сброс фильтров
    const handleResetFilters = () => {
        setSearchQuery('');
        setFilters({
            types: [],
            sortBy: 'name-asc',
            heightRange: [0, 100],
            weightRange: [0, 1000],
        });
        setCurrentPage(1);
    };

    const calculatedTotalPages = Math.ceil(filteredPokemons.length / ITEMS_PER_PAGE) || 1;

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
        const pokemon = {
        id: Date.now(),
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

        setAllPokemons([pokemon, ...allPokemons]);
        setCurrentPage(1);
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

                <div className="flex items-center justify-between gap-4 mb-6">
                    <button
                        onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                        className="bg-white hover:bg-gray-50 text-gray-800 px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg whitespace-nowrap hover:shadow-xl transform hover:scale-105"
                    >
                        <FontAwesomeIcon icon={faFilter} className="text-blue-500" />
                        Фильтры
                        <FontAwesomeIcon 
                            icon={isFilterPanelOpen ? faChevronUp : faChevronDown} 
                            className={`text-blue-500 transition-transform duration-300 ${isFilterPanelOpen ? 'rotate-180' : 'rotate-0'}`}
                        />
                    </button>
                    
                    <SearchBar 
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                    />
                </div>

                <div 
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                        isFilterPanelOpen 
                            ? 'max-h-[2000px] opacity-100 mb-6' 
                            : 'max-h-0 opacity-0 mb-0'
                    }`}
                >
                    <FilterPanel
                        filters={filters}
                        onFilterChange={setFilters}
                        onResetFilters={handleResetFilters}
                        foundCount={filteredPokemons.length}
                    />
                </div>

                <PokemonList
                    pokemons={pokemons}
                    loading={loading}
                    onViewPokemon={handleViewPokemon}
                    currentPage={currentPage}
                    totalPages={calculatedTotalPages}
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
