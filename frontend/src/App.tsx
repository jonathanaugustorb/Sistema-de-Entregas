import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { ToastProvider } from './components/ui/Toast';

// Clientes
import { ClientesPage } from './pages/cadastros/clientes/ClientesPage';
import { ClienteFormPage } from './pages/cadastros/clientes/ClienteFormPage';

// Localidades
import { LocalidadesPage } from './pages/cadastros/localidades/LocalidadesPage';
import { LocalidadeFormPage } from './pages/cadastros/localidades/LocalidadeFormPage';

// Motoristas
import { MotoristasPage } from './pages/cadastros/motoristas/MotoristasPage';
import { MotoristaFormPage } from './pages/cadastros/motoristas/MotoristaFormPage';

// Veículos
import { VeiculosPage } from './pages/cadastros/veiculos/VeiculosPage';
import { VeiculoFormPage } from './pages/cadastros/veiculos/VeiculoFormPage';

// Tipos de Material
import { TiposMateriaisPage } from './pages/cadastros/tipos-material/TiposMateriaisPage';
import { TipoMaterialFormPage } from './pages/cadastros/tipos-material/TipoMaterialFormPage';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/cadastros/clientes" replace />} />

            {/* Clientes */}
            <Route path="cadastros/clientes" element={<ClientesPage />} />
            <Route path="cadastros/clientes/novo" element={<ClienteFormPage />} />
            <Route path="cadastros/clientes/:id/editar" element={<ClienteFormPage />} />

            {/* Localidades */}
            <Route path="cadastros/localidades" element={<LocalidadesPage />} />
            <Route path="cadastros/localidades/novo" element={<LocalidadeFormPage />} />
            <Route path="cadastros/localidades/:id/editar" element={<LocalidadeFormPage />} />

            {/* Motoristas */}
            <Route path="cadastros/motoristas" element={<MotoristasPage />} />
            <Route path="cadastros/motoristas/novo" element={<MotoristaFormPage />} />
            <Route path="cadastros/motoristas/:id/editar" element={<MotoristaFormPage />} />

            {/* Veículos */}
            <Route path="cadastros/veiculos" element={<VeiculosPage />} />
            <Route path="cadastros/veiculos/novo" element={<VeiculoFormPage />} />
            <Route path="cadastros/veiculos/:id/editar" element={<VeiculoFormPage />} />

            {/* Tipos de Material */}
            <Route path="cadastros/tipos-material" element={<TiposMateriaisPage />} />
            <Route path="cadastros/tipos-material/novo" element={<TipoMaterialFormPage />} />
            <Route path="cadastros/tipos-material/:id/editar" element={<TipoMaterialFormPage />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
