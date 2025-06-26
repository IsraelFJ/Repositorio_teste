import React, { useEffect, useState, useRef } from "react";
import { getAllPets } from "../../services/PetService";
import { getAllVets } from "../../services/VetService";
import { createConsultation } from "../../services/ConsultationService";
import { getAllProcedures } from "../../services/ProcedureService";
import { useNavigate, useParams } from "react-router-dom";

const ConsultationComponent = () => {
  const [totalCost, setTotalCost] = useState(0);

  // 'theDate' vai armazenar a data e hora de INÍCIO da consulta como uma string ISO 8601 (UTC)
  const [theDate, setTheDate] = useState("");

  // NOVO: Uma variável de estado para armazenar o objeto Date de Brasília, para exibir e calcular o timer.
  const [brasiliaDateTime, setBrasiliaDateTime] = useState(null);

  // Estados para o timer (apenas para exibição)
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const timerIntervalRef = useRef(null);

  // Vet and pet
  const [vet, setVet] = useState("");
  const [vets, setVets] = useState([]);
  const [pet, setPet] = useState("");
  const [pets, setPets] = useState([]);

  // Procedures / Tools
  const [allProcedures, setAllProcedures] = useState([]); // Nova: Todas as ferramentas carregadas da API
  const [filteredProcedures, setFilteredProcedures] = useState([]); // Nova: Ferramentas filtradas pela pesquisa
  const [toolSearchTerm, setToolSearchTerm] = useState(''); // Novo: Termo de pesquisa para ferramentas
  const [selectedProcedures, setSelectedProcedures] = useState([]); // Ferramentas selecionadas para a consulta

  const navigator = useNavigate();
  const { id } = useParams();

  const [errors, setErrors] = useState({
    vet: "",
    pet: "",
    theDate: "",
    procedures: "",
  });

  // Função auxiliar para formatar componentes de tempo (HH, MM, SS)
  const formatTimeComponent = (value) => String(value).padStart(2, "0");

  // Função para formatar um objeto Date para exibição em DD/MM/YYYY HH:MM:SS (Horário de Brasília)
  const formatDateTimeForDisplay = (dateObj) => {
    if (!dateObj) return "";
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'America/Sao_Paulo'
    };
    return dateObj.toLocaleString('pt-BR', options);
  };

  function validateForm() {
    let valid = true;
    const errorsCopy = { ...errors };

    if (vet) {
      errorsCopy.vet = "";
    } else {
      errorsCopy.vet = "Selecione um Supervisor";
      valid = false;
    }

    if (pet) {
      errorsCopy.pet = "";
    } else {
      errorsCopy.pet = "Selecione uma Ordem de Serviço";
      valid = false;
    }

    if (!theDate.trim()) {
      errorsCopy.theDate = "Data e hora da solicitação são obrigatórios";
      valid = false;
    } else {
      errorsCopy.theDate = "";
    }

    if (selectedProcedures.length > 0) {
      errorsCopy.procedures = "";
    } else {
      errorsCopy.procedures = "Pelo menos uma ferramenta deve ser selecionada";
      valid = false;
    }

    setErrors(errorsCopy);
    console.log(errorsCopy);
    return valid;
  }

  useEffect(() => {
    getAllPets()
      .then((response) => {
        setPets(response.data);
      })
      .catch((error) => console.error("Erro ao buscar O.S.:", error));

    getAllVets()
      .then((response) => {
        setVets(response.data);
      })
      .catch((error) => console.error("Erro ao buscar Supervisores:", error));

    getAllProcedures()
      .then((response) => {
        setAllProcedures(response.data); // Guarda TODAS as ferramentas
        setFilteredProcedures(response.data); // Inicializa a lista filtrada com todas elas
      })
      .catch((error) => console.error("Erro ao buscar ferramentas:", error));

    if (!id) {
      const now = new Date();
      setBrasiliaDateTime(now);
      setTheDate(now.toISOString());

      timerIntervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 59) {
            setMinutes((prevMinutes) => {
              if (prevMinutes === 59) {
                setHours((prevHours) => prevHours + 1);
                return 0;
              }
              return prevMinutes + 1;
            });
            return 0;
          }
          return prevSeconds + 1;
        });
      }, 1000);
    } else {
      // Lógica para carregar consulta existente (mantida para referência, mas não implementada neste snippet)
      // Se você for implementar o edit, precisará carregar a consulta aqui e preencher os campos.
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [id]);

  // Nova função para lidar com a pesquisa de ferramentas
  const handleToolSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setToolSearchTerm(term);

    // Filtra 'allProcedures' com base no termo de pesquisa
    const filtered = allProcedures.filter(proc =>
      proc.name.toLowerCase().includes(term)
    );
    setFilteredProcedures(filtered);
  };

  // Alterada: Agora recebe o objeto procedure direto do clique na lista
  function addProcedure(procedureToAdd) {
    if (procedureToAdd && !selectedProcedures.some(p => p._id === procedureToAdd._id)) {
      const updatedProcedures = [...selectedProcedures, procedureToAdd];
      setSelectedProcedures(updatedProcedures);
      updateTotalCost(updatedProcedures);
    }
    // Opcional: Limpar o termo de pesquisa ou o selectedProcedure (se ainda usar um select)
    // setSelectedProcedure(""); 
    setToolSearchTerm(""); // Limpa o campo de pesquisa após adicionar
    setFilteredProcedures(allProcedures); // Reseta a lista de ferramentas disponíveis
  }

  function removeProcedure(procedureId) {
    const updatedProcedures = selectedProcedures.filter(
      (procedure) => procedure._id !== procedureId
    );
    setSelectedProcedures(updatedProcedures);
    updateTotalCost(updatedProcedures);
  }

  function updateTotalCost(proceduresList) {
    let cost = proceduresList.reduce(
      (total, procedure) => total + procedure.price,
      0
    );
    setTotalCost(cost);
  }

  function saveConsultation(e) {
    e.preventDefault();
    if (validateForm()) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }

      const consultation = {
        theDate,
        totalCost,
        vet,
        pet,
        procedures: selectedProcedures.map((procedure) => procedure._id),
      };

      createConsultation(consultation)
        .then((response) => {
          console.log(response.data);
          navigator("/consultations");
        })
        .catch((error) => {
          console.error("Error creating consultation:", error);
          alert("Erro ao salvar a solicitação. Verifique os dados e tente novamente.");
        });
    }
  }

  return (
    <div className="container">
      <br />
      <div className="row">
        <div className="card col-md-10 offset-md-1">
          <h2 className="text-center">Solicitar Ferramentas</h2>
          <div className="card-body">
            <form>
              <div className="row">
                <div className="col-md-6">
                  {/* Data e Hora da Consulta (Início) - Apenas para leitura */}
                  <div className="form-group mb-2">
                    <label className="form-label">Data e Hora:</label>
                    <input
                      type="text"
                      name="theDate"
                      value={formatDateTimeForDisplay(brasiliaDateTime)}
                      readOnly
                      className={`form-control ${
                        errors.theDate ? "is-invalid" : ""
                      }`}
                    />
                    {errors.theDate && (
                      <div className="invalid-feedback">{errors.theDate}</div>
                    )}
                  </div>

                  {/* Timer de Tempo Gasto - Apenas para leitura */}
                  <div className="form-group mb-2">
                    <label className="form-label">Tempo de Serviço:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={`${formatTimeComponent(hours)}:${formatTimeComponent(
                        minutes
                      )}:${formatTimeComponent(seconds)}`}
                      readOnly
                    />
                  </div>

                  <div className="form-group mb-2">
                    <label className="form-label">Selecionar Supervisor:</label>
                    <select
                      className={`form-control ${
                        errors.vet ? "is-invalid" : ""
                      }`}
                      value={vet}
                      onChange={(e) => setVet(e.target.value)}
                    >
                      <option value="">selecionar Supervisor</option>
                      {vets.map((vetOption) => ( // Renomeado para vetOption para evitar conflito
                        <option key={vetOption._id} value={vetOption._id}>
                          {vetOption.name}
                        </option>
                      ))}
                    </select>
                    {errors.vet && (
                      <div className="invalid-feedback">{errors.vet}</div>
                    )}
                  </div>

                  <div className="form-group mb-2">
                    <label className="form-label">Selecionar O.S:</label>
                    <select
                      className={`form-control ${
                        errors.pet ? "is-invalid" : ""
                      }`}
                      value={pet}
                      onChange={(e) => setPet(e.target.value)}
                    >
                      <option value="">Ordem de serviço</option>
                      {pets.map((petOption) => ( // Renomeado para petOption
                        <option key={petOption._id} value={petOption._id}>
                          {petOption.name}
                        </option>
                      ))}
                    </select>
                    {errors.pet && (
                      <div className="invalid-feedback">{errors.pet}</div>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  {/* Pesquisa de Ferramentas */}
                  <div className="form-group mb-2">
                    <label className="form-label">Pesquisar e Adicionar Ferramenta:</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Pesquisar ferramenta..."
                      value={toolSearchTerm}
                      onChange={handleToolSearchChange}
                    />
                    {errors.procedures && (
                      <div className="invalid-feedback d-block"> {/* d-block para sempre exibir */}
                        {errors.procedures}
                      </div>
                    )}
                  </div>

                  {/* Lista de Ferramentas Disponíveis (filtradas) */}
                  <div className="form-group mb-2">
                    <div className="card" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      <ul className="list-group list-group-flush">
                        {filteredProcedures.length > 0 ? (
                          filteredProcedures.map((procedure) => (
                            <li
                              key={procedure._id}
                              className="list-group-item list-group-item-action"
                              onClick={() => addProcedure(procedure)} // Clicar para adicionar
                              style={{ cursor: 'pointer' }}
                            >
                              {procedure.name} - R$ {procedure.price?.toFixed(2) || '0.00'}
                            </li>
                          ))
                        ) : (
                          <li className="list-group-item text-muted">Nenhuma ferramenta encontrada.</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Ferramentas Selecionadas */}
                  <div className="form-group mb-2">
                    <h5>Ferramentas Selecionadas:</h5>
                    <ul className="list-group">
                      {selectedProcedures.length > 0 ? (
                        selectedProcedures.map((procedure) => (
                          <li
                            key={procedure._id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            {procedure.name} - R$ {procedure.price?.toFixed(2) || '0.00'}
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => removeProcedure(procedure._id)}
                            >
                              Remover
                            </button>
                          </li>
                        ))
                      ) : (
                        <li className="list-group-item text-muted">Nenhuma ferramenta selecionada.</li>
                      )}
                    </ul>
                  </div>

                  {/* Custo Total */}
                  <div className="form-group mb-2">
                    <label className="form-label">Custo Total:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={`R$ ${totalCost.toFixed(2)}`}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <br />

              <div className="form-group mb-2 d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-success"
                  onClick={saveConsultation}
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationComponent;