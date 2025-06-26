import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ClientComponent from "./components/Clients/ClientComponent";
import ListClientComponent from "./components/Clients/ListClientComponent";
import HeaderComponent from "./components/HeaderComponent";
import IndexComponent from "./components/IndexComponent";
import ListPetComponent from "./components/Pets/ListPetComponent";
import PetComponent from "./components/Pets/PetComponent";
import ListVetComponent from "./components/Vets/ListVetComponent";
import VetComponent from "./components/Vets/VetComponent";
import ListProcedureComponent from "./components/Procedures/ListProcedureComponent";
import ProcedureComponent from "./components/Procedures/ProcedureComponent";
import ListConsultationComponent from "./components/Consultations/ListConsultationComponent";
import ConsultationComponent from "./components/Consultations/ConsultationComponent";
import ListReportComponent from "./components/Reports/ListReportComponent";
import ClientsReport from "./components/Reports/ClientsReport";
import VetsReport from "./components/Reports/VetsReport";
import PetsReport from "./components/Reports/PetsReport";
import ProceduresReport from "./components/Reports/ProceduresReport";
import ConsultationsReport from "./components/Reports/ConsultationsReport";

// --- NOVAS IMPORTAÇÕES (DESCOMENTADAS) ---
import KitComponent from "./components/Kits/KitComponent";
import ListKitComponent from "./components/Kits/ListKitComponent";
import KitsReport from "./components/Reports/KitsReport"; // Importa o relatório de Kits

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
        {/* Sidebar fixa */}
        <HeaderComponent />

        {/* Conteúdo com margem para não ser encoberto */}
        <div style={{ marginLeft: "220px", padding: "20px", width: "100%" }}>
          <Routes>
            <Route path="/" element={<IndexComponent />} />
            <Route path="/clients" element={<ListClientComponent />} />
            <Route path="/add-client" element={<ClientComponent />} />
            <Route path="/edit-client/:id" element={<ClientComponent />} />
            <Route path="/pets" element={<ListPetComponent />} />
            <Route path="/add-pet" element={<PetComponent />} />
            <Route path="/edit-pet/:id" element={<PetComponent />} />
            <Route path="/vets" element={<ListVetComponent />} />
            <Route path="/add-vet" element={<VetComponent />} />
            <Route path="/edit-vet/:id" element={<VetComponent />} />
            <Route path="/procedures" element={<ListProcedureComponent />} />
            <Route path="/add-procedure" element={<ProcedureComponent />} />
            <Route path="/edit-procedure/:id" element={<ProcedureComponent />} />
            <Route path="/consultations" element={<ListConsultationComponent />} />
            <Route path="/add-consultation" element={<ConsultationComponent />} />
            <Route path="/reports" element={<ListReportComponent />} />
            <Route path="/reports/clientsreport" element={<ClientsReport />} />
            <Route path="/reports/vetsreport" element={<VetsReport />} />
            <Route path="/reports/petsreport" element={<PetsReport />} />
            <Route path="/reports/proceduresreport" element={<ProceduresReport />} />
            <Route path="/reports/consultationsreport" element={<ConsultationsReport />} />

            {/* --- NOVAS ROTAS PARA KITS (INCLUÍDAS) --- */}
            <Route path="/kits" element={<ListKitComponent />} />
            <Route path="/add-kit" element={<KitComponent />} />
            <Route path="/edit-kit/:id" element={<KitComponent />} />
            <Route path="/reports/kitsreport" element={<KitsReport />} /> {/* Rota para o relatório de Kits */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;