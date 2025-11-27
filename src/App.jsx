import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PokemonProvider } from './context/PokemonContext';
import HomePage from './pages/HomePage';
import PokemonDetailPage from './pages/PokemonDetailPage';
import CreatePokemonPage from './pages/CreatePokemonPage';
import EditPokemonPage from './pages/EditPokemonPage';

function App() {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <PokemonProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
                    <Route path="/create" element={<CreatePokemonPage />} />
                    <Route path="/edit/:id" element={<EditPokemonPage />} />
                </Routes>
            </PokemonProvider>
        </BrowserRouter>
    );
}

export default App;
