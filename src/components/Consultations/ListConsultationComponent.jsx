import React, { useEffect, useState } from "react";
import {
  deleteConsultation,
  getAllConsultations,
} from "../../services/ConsultationService"; // Certifique-se de que o caminho está correto
import { useNavigate } from "react-router-dom";

const ListConsultationComponent = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true); // Controla o estado de carregamento
  const [error, setError] = useState(null);     // Armazena mensagens de erro

  const navigator = useNavigate();

  useEffect(() => {
    console.log("Componente ListConsultationComponent montado!");
    listOfConsultations(); // Corrigido o nome da função aqui para consistência
  }, []);

  function listOfConsultations() { // Corrigido o nome da função aqui para consistência
    setLoading(true); // Inicia o carregamento
    setError(null);   // Limpa erros anteriores
    console.log("Chamando getAllConsultations...");

    getAllConsultations()
      .then((response) => {
        console.log("Dados recebidos da API:", response.data);
        // Garante que response.data seja um array, mesmo que a API retorne null/undefined/outro
        if (response.data && Array.isArray(response.data)) {
          setConsultations(response.data);
        } else {
          console.warn("Resposta da API não é um array ou está vazia/inesperada:", response.data);
          setConsultations([]); // Garante que consultations seja um array vazio se a resposta for inesperada
        }
      })
      .catch((err) => { // Use 'err' ou 'error' consistentemente
        console.error("Erro ao buscar histórico de manutenção:", err);
        setError("Não foi possível carregar o histórico. Verifique sua conexão ou tente novamente mais tarde.");
        setConsultations([]); // Garante que consultations seja um array vazio em caso de erro
      })
      .finally(() => {
        setLoading(false); // Finaliza o carregamento, independentemente do sucesso/erro
      });
  }

  function addNewConsultation() {
    navigator("/add-consultation");
  }

  function removeConsultation(id) {
    // Adiciona uma confirmação antes de deletar
    if (!window.confirm("Tem certeza que deseja deletar este item do histórico?")) {
      return; // Aborta se o usuário cancelar
    }

    deleteConsultation(id)
      .then((response) => {
        console.log("Item deletado com sucesso:", response.data);
        listOfConsultations(); // Recarrega a lista para mostrar as mudanças
      })
      .catch((err) => {
        console.error("Erro ao deletar item:", err);
        // Exibe um alerta simples ao usuário em caso de falha na exclusão
        alert("Erro ao deletar o item. Verifique o console para mais detalhes.");
      });
  }

  // Brazilian date format (dd/mm/yyyy)
  function formatDate(dateString) { // Renomeado para dateString para clareza
    if (!dateString) return 'N/A'; // Lida com datas vazias ou nulas
    try {
      const options = { day: "2-digit", month: "2-digit", year: "numeric" };
      return new Date(dateString).toLocaleDateString("pt-BR", options);
    } catch (e) {
      console.error("Erro ao formatar data:", e, dateString);
      return dateString; // Retorna a string original se houver erro na formatação
    }
  }

  // --- Renderização Condicional ---
  if (loading) {
    return (
      <div className="container text-center mt-5">
        <h2>Carregando Histórico de Manutenção...</h2>
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
      <h2 className="text-center">Histórico de Manutenção</h2>
      <button className="btn btn-success mb-3" onClick={addNewConsultation}>
        Solicitar Ferramentas
      </button>
      
      {consultations.length === 0 ? (
        <div className="alert alert-info text-center mt-3" role="alert">
          Nenhum histórico de manutenção encontrado.
        </div>
      ) : (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Data</th>
              <th>Ordem de Serviço</th>
              <th>Ferramentas</th>
              <th>Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map((consultation) => (
              <tr key={consultation._id}>
                <td>{formatDate(consultation.theDate)}</td> {/* Usando a função de formatação */}
                {/* Usando Optional Chaining para acessar 'name' de 'pet' com segurança */}
                <td>{consultation.pet?.name || 'N/A'}</td> 
                <td>
                  {/* Verifica se 'procedures' existe e é um array antes de mapear */}
                  {consultation.procedures && consultation.procedures.length > 0 ? (
                    consultation.procedures.map((procedure) => (
                      <div key={procedure._id}>
                        {procedure.name} - $ {procedure.price}
                      </div>
                    ))
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>$ {consultation.totalCost?.toFixed(2) || '0.00'}</td> {/* Formata para 2 casas decimais e lida com valor nulo */}
                <td>
                  <button
                    onClick={() => removeConsultation(consultation._id)}
                    className="btn btn-danger btn-sm"
                    style={{ marginLeft: "10px" }}
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListConsultationComponent;