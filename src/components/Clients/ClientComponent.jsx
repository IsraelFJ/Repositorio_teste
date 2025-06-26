import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createClient,
  getClientById,
  updateClient,
} from "../../services/ClientService";
// IMPORTANTE: Agora importando do KitsService
import { getAllKits } from "../../services/KitsService"; // Certifique-se de que este caminho está correto

const ClientComponent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // Matrícula
  const [cellPhone, setCellPhone] = useState("");
  const [address, setAddress] = useState(""); // Unidade
  const [state, setState] = useState("");

  // ESTADOS PARA KITS (ferramentas) - agora chamando de "kits" diretamente
  const [allKits, setAllKits] = useState([]); // Todas as "ferramentas" carregadas do backend
  const [filteredKits, setFilteredKits] = useState([]); // "Ferramentas" filtradas pela pesquisa
  const [kitSearchTerm, setKitSearchTerm] = useState(''); // Termo de pesquisa para "ferramentas"
  const [selectedKits, setSelectedKits] = useState([]); // "Ferramentas" selecionadas para o consultor
  const [totalKitCost, setTotalKitCost] = useState(0); // Custo total das "ferramentas" selecionadas

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    cellPhone: "",
    address: "",
    state: "",
    kits: "", // Novo erro para validação de "kits"
  });

  const { id } = useParams();
  const navigator = useNavigate();

  // Função para calcular o título da página
  function pageTitle() {
    if (id) {
      return <h2 className="text-center">Atualizar Dados do Consultor</h2>;
    } else {
      return <h2 className="text-center">Adicionar Consultores</h2>;
    }
  }

  // Efeito para carregar dados do cliente (para edição) e todos os kits
  useEffect(() => {
    // Carregar todos os kits disponíveis
    getAllKits()
      .then((response) => {
        setAllKits(response.data);
        setFilteredKits(response.data); // Inicializa a lista filtrada com todos os kits
      })
      .catch((error) => console.error("Erro ao buscar kits:", error));

    // Se houver um ID, significa que estamos editando um cliente existente
    if (id) {
      getClientById(id)
        .then((response) => {
          setName(response.data.name);
          setEmail(response.data.email);
          setCellPhone(response.data.cellPhone);
          setAddress(response.data.address);
          setState(response.data.state);
          // NOVO: Carregar kits já associados ao cliente
          if (response.data.kits) {
            setSelectedKits(response.data.kits);
            updateTotalKitCost(response.data.kits); // Recalcula o custo total
          }
          // NOVO: Carregar o custo total já salvo (se o backend retornar)
          setTotalKitCost(response.data.totalKitCost || 0);
        })
        .catch((error) => {
          console.error(error);
          alert("Erro ao carregar dados do consultor. Verifique o ID e tente novamente.");
        });
    }
  }, [id]); // id como dependência para recarregar quando o ID muda

  // Função para lidar com a pesquisa de kits
  const handleKitSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setKitSearchTerm(term);

    const filtered = allKits.filter(kit =>
      kit.name.toLowerCase().includes(term)
    );
    setFilteredKits(filtered);
  };

  // Função para adicionar um kit à lista de selecionados
  function addKit(kitToAdd) {
    // Verifica se o kit já está na lista para evitar duplicatas
    if (kitToAdd && !selectedKits.some(k => k._id === kitToAdd._id)) {
      const updatedKits = [...selectedKits, kitToAdd];
      setSelectedKits(updatedKits);
      updateTotalKitCost(updatedKits); // Atualiza o custo total
    }
    setKitSearchTerm(""); // Limpa o campo de pesquisa após adicionar
    setFilteredKits(allKits); // Reseta a lista de kits disponíveis
  }

  // Função para remover um kit da lista de selecionados
  function removeKit(kitId) {
    const updatedKits = selectedKits.filter(
      (kit) => kit._id !== kitId
    );
    setSelectedKits(updatedKits);
    updateTotalKitCost(updatedKits); // Atualiza o custo total
  }

  // Função para recalcular o custo total dos kits selecionados
  function updateTotalKitCost(kitsList) {
    let cost = kitsList.reduce(
      (total, kit) => total + (kit.price || 0), // Use (kit.price || 0) para evitar NaN se price for undefined
      0
    );
    setTotalKitCost(cost);
  }

  // Função para salvar ou atualizar o cliente/consultor
  function saveorUpdateClient(e) {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    if (validateForm()) {
      // Mapeia selectedKits para enviar apenas os _ids para o backend
      const client = {
        name,
        email,
        cellPhone,
        address,
        state,
        kits: selectedKits.map((kit) => kit._id), // Enviando IDs dos kits
        totalKitCost: totalKitCost, // Enviando o custo total dos kits
      };

      if (id) {
        // Lógica para atualizar cliente existente
        updateClient(id, client)
          .then((response) => {
            console.log("Consultor atualizado:", response.data);
            navigator("/clients"); // Redireciona para a lista de clientes
          })
          .catch((error) => {
            console.error("Erro ao atualizar consultor:", error);
            if (error.response && error.response.status === 409) {
                setErrors(prevErrors => ({ ...prevErrors, email: error.response.data.message }));
            } else {
                alert("Erro ao atualizar consultor. Verifique os dados e tente novamente.");
            }
          });
      } else {
        // Lógica para criar novo cliente
        createClient(client)
          .then((response) => {
            console.log("Consultor criado:", response.data);
            navigator("/clients"); // Redireciona para a lista de clientes
          })
          .catch((error) => {
            console.error("Erro ao criar consultor:", error);
            if (error.response && error.response.status === 409) {
                setErrors(prevErrors => ({ ...prevErrors, email: error.response.data.message }));
            } else {
                alert("Erro ao criar consultor. Verifique os dados e tente novamente.");
            }
          });
      }
    }
  }

  // Função de validação de formulário
  function validateForm() {
    let valid = true;
    const errorsCopy = { ...errors };

    // Validações existentes
    if (name.trim()) { errorsCopy.name = ""; } else { errorsCopy.name = "Nome é obrigatório"; valid = false; }
    if (email.trim()) { errorsCopy.email = ""; } else { errorsCopy.email = "Matrícula é obrigatória"; valid = false; }
    if (cellPhone.trim()) { errorsCopy.cellPhone = ""; } else { errorsCopy.cellPhone = "Telefone é obrigatório"; valid = false; }
    if (address.trim()) { errorsCopy.address = ""; } else { errorsCopy.address = "Unidade é obrigatória"; valid = false; }
    if (state.trim()) { errorsCopy.state = ""; } else { errorsCopy.state = "Estado é obrigatório"; valid = false; }

    // VALIDAÇÃO: Kits
    // Se você *não* quiser que seja obrigatório ter kits, remova este if/else
    if (selectedKits.length > 0) {
      errorsCopy.kits = "";
    } else {
      errorsCopy.kits = "Pelo menos uma ferramenta/kit deve ser selecionado";
      valid = false;
    }

    setErrors(errorsCopy);
    return valid;
  }

  return (
    <div className="container">
      <br /> <br />
      <div className="row">
        <div className="card col-md-10 offset-md-1 offset-md-1">
          {pageTitle()}
          <div className="card-body">
            <form>
              <div className="row"> {/* Use row para dividir em duas colunas */}
                <div className="col-md-6">
                  {/* Campos de Dados do Consultor */}
                  <div className="form-group mb-2">
                    <label className="form-label">Nome:</label>
                    <input
                      type="text"
                      placeholder="nome"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    ></input>
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name} </div>
                    )}
                  </div>
                  <div className="form-group mb-2">
                    <label className="form-label">Matricula:</label>
                    <input
                      type="text"
                      placeholder="matricula"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    ></input>
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email} </div>
                    )}
                  </div>

                  <div className="form-group mb-2">
                    <label className="form-label">Telefone:</label>
                    <input
                      type="text"
                      placeholder="telefone"
                      name="cellPhone"
                      value={cellPhone}
                      onChange={(e) => setCellPhone(e.target.value)}
                      className={`form-control ${
                        errors.cellPhone ? "is-invalid" : ""
                      }`}
                    ></input>
                    {errors.cellPhone && (
                      <div className="invalid-feedback">{errors.cellPhone} </div>
                    )}
                  </div>

                  <div className="form-group mb-2">
                    <label className="form-label">Unidade:</label>
                    <select
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`form-control ${errors.address ? "is-invalid" : ""}`}
                    >
                      <option value="">Selecione a unidade</option>
                      <option value="Tecon Rio Grande">Tecon Salvador BA</option>
                      <option value="Tecon Salvador">Tecon Rio Grande RS</option>
                      <option value="Centro Logístico">Centro Logístico Santo André SP</option>
                      <option value="Logística Internacional — Allink">Logística Internacional — Allink</option>
                      <option value="Towage ">Towage — Rebocadores</option>
                      <option value="Shipping Agency — Agências Marítimas">Shipping Agency — Agências Marítimas</option>
                      <option value="Estaleiro SP">Estaleiro — Guarujá SP</option>
                      <option value="Base de apoio offshore (1)">Base de apoio offshore RJ(1)</option>
                      <option value="Base de apoio offshore (2)">Base de apoio offshore RJ(2)</option>
                      <option value="Embarcações de apoio offshore">Embarcações de apoio offshore</option>
                    </select>
                    {errors.address && (
                      <div className="invalid-feedback">{errors.address}</div>
                    )}
                  </div>
                  <div className="form-group mb-2">
                    {/* States of Brazil */}
                    <label className="form-label">Estado:</label>
                    <select
                      value={state || ""}
                      onChange={(e) => setState(e.target.value)}
                      className={`form-control ${errors.state ? "is-invalid" : ""}`}
                    >
                      <option value="">Selecione o estado</option>
                      <option value="AC">AC</option>
                      <option value="AL">AL</option>
                      <option value="AP">AP</option>
                      <option value="AM">AM</option>
                      <option value="BA">BA</option>
                      <option value="CE">CE</option>
                      <option value="DF">DF</option>
                      <option value="ES">ES</option>
                      <option value="GO">GO</option>
                      <option value="MA">MA</option>
                      <option value="MT">MT</option>
                      <option value="MS">MS</option>
                      <option value="MG">MG</option>
                      <option value="PA">PA</option>
                      <option value="PB">PB</option>
                      <option value="PR">PR</option>
                      <option value="PE">PE</option>
                      <option value="PI">PI</option>
                      <option value="RJ">RJ</option>
                      <option value="RN">RN</option>
                      <option value="RS">RS</option>
                      <option value="RO">RO</option>
                      <option value="RR">RR</option>
                      <option value="SC">SC</option>
                      <option value="SP">SP</option>
                      <option value="SE">SE</option>
                      <option value="TO">TO</option>
                    </select>
                    {errors.state && (
                      <div className="invalid-feedback">{errors.state} </div>
                    )}
                  </div>
                </div>

                {/* Coluna para Seleção de Ferramentas/Kits */}
                <div className="col-md-6">
                  {/* Pesquisa de Ferramentas */}
                  <div className="form-group mb-2">
                    <label className="form-label">Pesquisar e Adicionar Ferramenta para Kits:</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Pesquisar ferramenta/kit..."
                      value={kitSearchTerm}
                      onChange={handleKitSearchChange}
                    />
                    {errors.kits && (
                      <div className="invalid-feedback d-block">
                        {errors.kits}
                      </div>
                    )}
                  </div>

                  {/* Lista de Ferramentas/Kits Disponíveis (filtradas) */}
                  <div className="form-group mb-2">
                    <div className="card" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      <ul className="list-group list-group-flush">
                        {filteredKits.length > 0 ? (
                          filteredKits.map((kit) => (
                            <li
                              key={kit._id}
                              className="list-group-item list-group-item-action"
                              onClick={() => addKit(kit)} // Clicar para adicionar
                              style={{ cursor: 'pointer' }}
                            >
                              {kit.name} - R$ {kit.price?.toFixed(2) || '0.00'}
                            </li>
                          ))
                        ) : (
                          <li className="list-group-item text-muted">Nenhuma ferramenta/kit encontrada.</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Ferramentas/Kits Selecionados */}
                  <div className="form-group mb-2">
                    <h5>Ferramentas/Kits Selecionados:</h5>
                    <ul className="list-group">
                      {selectedKits.length > 0 ? (
                        selectedKits.map((kit) => (
                          <li
                            key={kit._id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            {kit.name} - R$ {kit.price?.toFixed(2) || '0.00'}
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => removeKit(kit._id)}
                            >
                              Remover
                            </button>
                          </li>
                        ))
                      ) : (
                        <li className="list-group-item text-muted">Nenhuma ferramenta/kit selecionada.</li>
                      )}
                    </ul>
                  </div>

                  {/* Custo Total das Ferramentas/Kits */}
                  <div className="form-group mb-2">
                    <label className="form-label">Custo Total das Ferramentas/Kits:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={`R$ ${totalKitCost.toFixed(2)}`}
                      readOnly
                    />
                  </div>
                </div>
              </div> {/* Fim da row das duas colunas */}
              <br />

              <div className="form-group mb-2 d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-success"
                  onClick={saveorUpdateClient}
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

export default ClientComponent;