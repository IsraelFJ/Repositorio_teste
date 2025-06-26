import React, { useEffect, useState } from "react";
import { getAllConsultations } from "../../services/ConsultationService";

const ConsultationsReport = () => {
  const [consultations, setConsultations] = useState([]);
  const [allConsultations, setAllConsultations] = useState([]); // Armazena todas as consultas
  const [searchTerm, setSearchTerm] = useState('');           // Estado para a pesquisa por texto
  const [startDate, setStartDate] = useState('');             // Novo estado para a data de início da pesquisa
  const [endDate, setEndDate] = useState('');                 // Novo estado para a data de fim da pesquisa
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Componente ConsultationsReport montado!");
    listOfConsultations();
  }, []);

  function listOfConsultations() {
    setLoading(true);
    setError(null);
    console.log("Chamando getAllConsultations para o relatório...");

    getAllConsultations()
      .then((response) => {
        console.log("Dados recebidos da API para o relatório:", response.data);
        if (response.data && Array.isArray(response.data)) {
          // Ordena os dados por data (mais recente primeiro)
          const sortedData = response.data.sort((a, b) => {
            const dateA = new Date(a.theDate);
            const dateB = new Date(b.theDate);
            return dateB.getTime() - dateA.getTime();
          });

          setAllConsultations(sortedData);
          setConsultations(sortedData); // Inicializa a lista exibida
        } else {
          console.warn("Resposta da API para o relatório não é um array ou está vazia/inesperada:", response.data);
          setAllConsultations([]);
          setConsultations([]);
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar consultas para o relatório:", err);
        setError("Não foi possível carregar o relatório de consultas. Verifique sua conexão ou tente novamente mais tarde.");
        setAllConsultations([]);
        setConsultations([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // Função centralizada para aplicar todos os filtros (texto e data)
  const applyFilters = (currentSearchTerm, currentStartDate, currentEndDate) => {
    let filteredData = [...allConsultations]; // Começa com a lista completa e ordenada

    // 1. Filtrar por termo de pesquisa (texto)
    if (currentSearchTerm) {
      const lowerCaseSearchTerm = currentSearchTerm.toLowerCase();
      filteredData = filteredData.filter(consultation =>
        consultation.vet?.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        consultation.pet?.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        consultation.procedures?.some(procedure =>
          procedure.name.toLowerCase().includes(lowerCaseSearchTerm)
        )
      );
    }

    // 2. Filtrar por data
    if (currentStartDate || currentEndDate) {
      filteredData = filteredData.filter(consultation => {
        const consultationDate = new Date(consultation.theDate); // Data da consulta

        // Ajusta as datas de início e fim para a meia-noite do dia (fuso horário local para comparação)
        let filterStart = currentStartDate ? new Date(currentStartDate) : null;
        if (filterStart) filterStart.setHours(0, 0, 0, 0); // Início do dia

        let filterEnd = currentEndDate ? new Date(currentEndDate) : null;
        if (filterEnd) filterEnd.setHours(23, 59, 59, 999); // Fim do dia

        const matchesStartDate = filterStart ? consultationDate >= filterStart : true;
        const matchesEndDate = filterEnd ? consultationDate <= filterEnd : true;

        return matchesStartDate && matchesEndDate;
      });
    }
    setConsultations(filteredData);
  };

  // Handlers para os inputs de pesquisa
  const handleSearchTermChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    applyFilters(value, startDate, endDate); // Aplica os filtros ao mudar o termo
  };

  const handleStartDateChange = (event) => {
    const value = event.target.value;
    setStartDate(value);
    applyFilters(searchTerm, value, endDate); // Aplica os filtros ao mudar a data de início
  };

  const handleEndDateChange = (event) => {
    const value = event.target.value;
    setEndDate(value);
    applyFilters(searchTerm, startDate, value); // Aplica os filtros ao mudar a data de fim
  };

  // Função para formatar a data/hora para o padrão brasileiro com horário de Brasília
  const formatDateTimeForDisplay = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
      const dateObj = new Date(dateTimeString);
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "America/Sao_Paulo",
      };
      return dateObj.toLocaleString("pt-BR", options);
    } catch (e) {
      console.error("Erro ao formatar data e hora:", e, dateTimeString);
      return dateTimeString;
    }
  };

  // --- Renderização Condicional ---
  if (loading) {
    return (
      <div className="container text-center mt-5">
        <h2>Carregando Relatório de Consultas...</h2>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-primary" onClick={listOfConsultations}>Tentar Novamente</button>
      </div>
    );
  }

  return (
    <div className="container">
      <br />
      <h2 className="text-center">Relatório de Consultas</h2>

      {/* Seção de Pesquisa */}
      <div className="row mb-3 align-items-end">
        {/* Pesquisa por Texto */}
        <div className="col-md-6 mb-3 mb-md-0">
          <label htmlFor="searchTermInput" className="form-label">Pesquisar por texto:</label>
          <input
            type="text"
            id="searchTermInput"
            className="form-control"
            placeholder="Supervisor, Ordem de Serviço ou Ferramenta..."
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
        </div>

        {/* Pesquisa por Data (De) */}
        <div className="col-md-3 mb-3 mb-md-0">
          <label htmlFor="startDateInput" className="form-label">Data de Início:</label>
          <input
            type="date"
            id="startDateInput"
            className="form-control"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </div>

        {/* Pesquisa por Data (Até) */}
        <div className="col-md-3">
          <label htmlFor="endDateInput" className="form-label">Data de Fim:</label>
          <input
            type="date"
            id="endDateInput"
            className="form-control"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>
      </div>

      {consultations.length === 0 && searchTerm === '' && startDate === '' && endDate === '' ? (
        <div className="alert alert-info text-center mt-3" role="alert">
          Nenhuma consulta encontrada.
        </div>
      ) : consultations.length === 0 && (searchTerm !== '' || startDate !== '' || endDate !== '') ? (
        <div className="alert alert-warning text-center mt-3" role="alert">
          Nenhum resultado encontrado para os filtros aplicados.
        </div>
      ) : (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Data e Hora</th>
              <th>Supervisor</th>
              <th>Ordem de Serviço</th>
              <th>Ferramentas</th>
              <th>Valor Total</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map((consultation) => (
              <tr key={consultation._id}>
                <td>{formatDateTimeForDisplay(consultation.theDate)}</td>
                <td>{consultation.vet?.name || 'N/A'}</td>
                <td>{consultation.pet?.name || 'N/A'}</td>
                <td>
                  {consultation.procedures && consultation.procedures.length > 0 ? (
                    consultation.procedures.map((procedure) => (
                      <div key={procedure._id}>
                        {procedure.name} - R$ {procedure.price?.toFixed(2) || '0.00'}
                      </div>
                    ))
                  ) : (
                    <div>Nenhum procedimento</div>
                  )}
                </td>
                <td>R$ {consultation.totalCost?.toFixed(2) || '0.00'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ConsultationsReport;