import React, { useState } from "react";
// Importar todos os componentes de relatório
import ClientsReport from "./ClientsReport"; // Ajuste o caminho se necessário
import PetsReport from "./PetsReport";   // Ajuste o caminho se necessário
import VetsReport from "./VetsReport";   // Ajuste o caminho se necessário
import ProceduresReport from "./ProceduresReport"; // Ajuste o caminho se necessário
import ConsultationsReport from "./ConsultationsReport"; // Ajuste o caminho se necessário
import KitsReport from "./KitsReport"; // <--- NOVO: Importe o KitsReport

const ListReportComponent = () => {
 const [selectedReportComponent, setSelectedReportComponent] = useState(null);

 // Mapeamento dos valores do select para os componentes
 const reportComponents = {
  "clients": <ClientsReport />,
  "pets": <PetsReport />,
  "vets": <VetsReport />,
  "procedures": <ProceduresReport />,
    // <--- NOVO: Adicione o KitsReport ao mapeamento ---
    "kits": <KitsReport />,
  "consultations": <ConsultationsReport />,
 };

 const handleSelectChange = (event) => {
  const value = event.target.value;
  // Define o componente correspondente no estado
  setSelectedReportComponent(reportComponents[value] || null);
 };

 return (
  <div className="container">
   <h2 className="text-center mt-4 mb-4">Relatórios do Sistema</h2>

   <div className="card col-md-8 offset-md-2 mb-4 p-4">
    <h4 className="text-primary mb-3">Relatórios:</h4>

    <div className="form-group">
     <label htmlFor="reportSelect" className="form-label visually-hidden">Relatório:</label>
     <select
      id="reportSelect"
      className="form-control"
      value={selectedReportComponent ? Object.keys(reportComponents).find(key => reportComponents[key].type === selectedReportComponent.type) : ""}
      onChange={handleSelectChange}
     >
      <option value="">Selecione um relatório</option>
      <option value="clients">Consultores</option>     
      <option value="vets">Assistentes de Controle</option>
       <option value="pets">Ordens de serviço</option>
      <option value="procedures">Ferramentas Compartilhadas</option>           
      <option value="kits">Ferramentas Individuais</option>
      <option value="consultations">Historico de Solicitções</option>
     </select>
    </div>
   </div>

   {/* Área onde o relatório selecionado será exibido */}
   <div className="report-display-area">
    {selectedReportComponent ? (
     selectedReportComponent
    ) : (
     <div className="alert alert-info text-center mt-5" role="alert">
      Selecione um relatório para visualizá-lo aqui.
     </div>
    )}
   </div>
  </div>
 );
};

export default ListReportComponent;