/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';

// Создаём контекст
const PokemonContext = createContext();
export const usePokemon = () => {
    const context = useContext(PokemonContext);
    if (!context) {
        throw new Error('usePokemon должен использоваться внутри PokemonProvider');
    }
    return context;
};

// Провайдер контекста
export const PokemonProvider = ({ children }) => {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);

    const ITEMS_PER_PAGE = 20;
    const TOTAL_ITEMS = 100;

    // загрузка данных с API
    const fetchEntities = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_ITEMS}&offset=0`
            );
            const data = await response.json();

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

            setPokemons(detailedPokemons);
            setLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки покемонов:', error);
            setLoading(false);
        }
    };

    const getById = (id) => {
        return pokemons.find(pokemon => pokemon.id === parseInt(id));
    };

    const addEntity = (newPokemon) => {
        const pokemon = {
            id: Math.max(...pokemons.map(p => p.id), 0) + 1,
            name: newPokemon.name.toLowerCase(),
            height: parseInt(newPokemon.height) || 0,
            weight: parseInt(newPokemon.weight) || 0,
            sprites: {
                front_default: newPokemon.image || 'https://via.placeholder.com/150'
            },
            types: Array.isArray(newPokemon.types) 
                ? newPokemon.types.map(type => ({
                    type: { name: type }
                }))
                : [],
            stats: [
                { stat: { name: 'hp' }, base_stat: parseInt(newPokemon.hp) || 0 },
                { stat: { name: 'attack' }, base_stat: parseInt(newPokemon.attack) || 0 },
                { stat: { name: 'defense' }, base_stat: parseInt(newPokemon.defense) || 0 },
            ],
            uniqueKey: `${Date.now()}-${Math.random()}`
        };

        setPokemons(prevPokemons => {
            const newList = [pokemon, ...prevPokemons];
            return newList;
        });
        return pokemon;
    };

    const updateEntity = (updatedPokemon) => {
        setPokemons(prevPokemons =>
            prevPokemons.map(pokemon =>
                pokemon.id === updatedPokemon.id
                    ? {
                        ...pokemon,
                        name: updatedPokemon.name.toLowerCase(),
                        height: parseInt(updatedPokemon.height) || 0,
                        weight: parseInt(updatedPokemon.weight) || 0,
                        sprites: {
                            ...pokemon.sprites,
                            front_default: updatedPokemon.image || pokemon.sprites.front_default
                        },
                        types: updatedPokemon.types.map(type => ({
                            type: { name: type }
                        })),
                        stats: [
                            { stat: { name: 'hp' }, base_stat: parseInt(updatedPokemon.hp) || 0 },
                            { stat: { name: 'attack' }, base_stat: parseInt(updatedPokemon.attack) || 0 },
                            { stat: { name: 'defense' }, base_stat: parseInt(updatedPokemon.defense) || 0 },
                        ],
                    }
                    : pokemon
            )
        );
    };

    const deleteEntity = (id) => {
        setPokemons(prevPokemons => prevPokemons.filter(pokemon => pokemon.id !== parseInt(id)));
    };

    useEffect(() => {
        const loadPokemons = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_ITEMS}&offset=0`
                );
                const data = await response.json();

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

                setPokemons(detailedPokemons);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка загрузки покемонов:', error);
                setLoading(false);
            }
        };

        loadPokemons();
    }, []);

    const value = {
        pokemons,
        loading,
        fetchEntities,
        getById,
        addEntity,
        updateEntity,
        deleteEntity,
        ITEMS_PER_PAGE
    };

    return (
        <PokemonContext.Provider value={value}>
            {children}
        </PokemonContext.Provider>
    );
};
