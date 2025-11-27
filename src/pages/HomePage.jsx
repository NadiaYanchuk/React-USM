import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemon } from '../context/PokemonContext';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import PokemonList from '../components/PokemonList';
import PokemonModal from '../components/PokemonModal';
import ConfirmModal from '../components/ConfirmModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChevronDown, faChevronUp, faFilter } from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {
    const { pokemons, loading, ITEMS_PER_PAGE, updateEntity, deleteEntity } = usePokemon();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [filters, setFilters] = useState({
        types: [],
        sortBy: 'name-asc',
        heightRange: [0, 200],
        weightRange: [0, 10000],
    });
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 5;

    // Фильтрация и сортировка покемонов
    const filteredPokemons = useMemo(() => {
        let result = [...pokemons];

        // Поиск по имени
        if (searchQuery) {
            result = result.filter(pokemon =>
                pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Фильтр по типам
        if (filters.types.length > 0) {
            result = result.filter(pokemon =>
                pokemon.types.some(type =>
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
        const [sortField, sortOrder] = filters.sortBy.split('-');
        result.sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];

            if (sortField === 'name') {
                aValue = a.name.toLowerCase();
                bValue = b.name.toLowerCase();
                return sortOrder === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        });

        return result;
    }, [pokemons, searchQuery, filters]);

    // Пагинация
    const paginatedPokemons = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredPokemons.slice(startIndex, endIndex);
    }, [filteredPokemons, currentPage, ITEMS_PER_PAGE]);

    const calculatedTotalPages = Math.ceil(filteredPokemons.length / ITEMS_PER_PAGE) || 1;

    const handleResetFilters = () => {
        setFilters({
            types: [],
            sortBy: 'name-asc',
            heightRange: [0, 200],
            weightRange: [0, 10000],
        });
        setCurrentPage(1);
    };

    const handleViewPokemon = (pokemon) => {
        setSelectedPokemon(pokemon);
        setIsModalOpen(true);
    };

    const handleOpenDetailPage = (pokemon) => {
        navigate(`/pokemon/${pokemon.id}`);
    };

    const handleCreatePokemon = () => {
        navigate('/create');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPokemon(null);
    };

    const handleUpdate = (updatedPokemon) => {
        updateEntity(updatedPokemon);
        handleCloseModal();
    };

    const handleDelete = (id) => {
        setConfirmDelete(id);
    };

    const handleConfirmDelete = () => {
        if (confirmDelete) {
            deleteEntity(confirmDelete);
            setConfirmDelete(null);
            handleCloseModal();
        }
    };

    const handleCancelDelete = () => {
        setConfirmDelete(null);
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
                    pokemons={paginatedPokemons}
                    loading={loading}
                    onViewPokemon={handleViewPokemon}
                    currentPage={currentPage}
                    totalPages={Math.min(calculatedTotalPages, totalPages)}
                    onPageChange={setCurrentPage}
                />

                {selectedPokemon && (
                    <PokemonModal
                        pokemon={selectedPokemon}
                        isOpen={isModalOpen}
                        isCreateMode={false}
                        onClose={handleCloseModal}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                        onOpenDetailPage={handleOpenDetailPage}
                    />
                )}
                
                {confirmDelete && (
                    <ConfirmModal
                        message="Вы уверены, что хотите удалить этого покемона?"
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                    />
                )}
            </div>
        </div>
    );
};

export default HomePage;
