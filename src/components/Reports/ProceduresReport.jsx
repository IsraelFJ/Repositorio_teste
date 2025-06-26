import React, { useEffect, useState } from "react";
import { getAllProcedures } from "../../services/ProcedureService"; // Certifique-se de que o caminho está correto

const ProceduresReport = () => {
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true); // Adicionado: Estado de carregamento
  const [error, setError] = useState(null); // Adicionado: Estado de erro
  const [totalPrice, setTotalPrice] = useState(0); // Adicionado: Estado para o valor total

  useEffect(() => {
    console.log("ProceduresReport montado!");
    listOfProcedures();
  }, []);

  function listOfProcedures() {
    setLoading(true); // Inicia o estado de carregamento
    setError(null);   // Limpa qualquer erro anterior
    console.log("Chamando getAllProcedures para o relatório...");

    getAllProcedures()
      .then((response) => {
        console.log("Dados dos Procedimentos para relatório recebidos:", response.data);
        if (response.data && Array.isArray(response.data)) {
          setProcedures(response.data);
          calculateTotalPrice(response.data); // Calcula o total ao receber os dados
        } else {
          console.warn("Resposta da API para ProceduresReport não é um array ou está vazia/inesperada:", response.data);
          setProcedures([]); // Garante que procedures seja um array vazio
          setTotalPrice(0); // Zera o total
        }
      })
      .catch((err) => { // Alterado 'error' para 'err' para consistência
        console.error("Erro ao buscar procedimentos para relatório:", err);
        setError("Não foi possível carregar o relatório de procedimentos. Verifique sua conexão ou tente novamente.");
        setTotalPrice(0); // Zera o total em caso de erro
      })
      .finally(() => {
        setLoading(false); // Finaliza o estado de carregamento
      });
  }

  // Função para calcular o valor total dos procedimentos
  const calculateTotalPrice = (proceduresArray) => {
    const total = proceduresArray.reduce((sum, procedure) => {
      // Garante que o preço é um número antes de somar
      return sum + (typeof procedure.price === 'number' ? procedure.price : 0);
    }, 0);
    setTotalPrice(total);
    console.log("Valor Total dos Procedimentos:", total.toFixed(2));
  };

  // Renderização condicional para feedback ao usuário (loading e error)
  if (loading) {
    return (
      <div className="container text-center mt-5">
        <h2>Carregando Relatório de Procedimentos...</h2>
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
        <button className="btn btn-primary mt-3" onClick={listOfProcedures}>Tentar Novamente</button>
      </div>
    );
  }

  return (
    <div className="container">
      <br />
      <h2 className="text-center">Relatório de Ferramentas Compartilhadas</h2> {/* Título atualizado */}

      {/* Exibição do Valor Total (mesma lógica do KitsReport) */}
      {procedures.length > 0 && ( // Só mostra o total se houver procedimentos
        <div className="row justify-content-end mb-2">
          <div className="col-auto">
            <h5 className="mb-0">
              <strong>Total:</strong> R$ {totalPrice.toFixed(2)}
            </h5>
          </div>
        </div>
      )}

      {procedures.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          Nenhum procedimento encontrado para o relatório.
        </div>
      ) : (
        <table className="table table-striped table-hover"> {/* Adicionadas classes Bootstrap */}
          <thead>
            <tr>
              <th>Nome</th>
              <th className="text-end">Valor (R$)</th> {/* Alinhado à direita para números */}
            </tr>
          </thead>
          <tbody>
            {procedures.map((procedure) => (
              <tr key={procedure._id}>
                <td>{procedure.name}</td>
                <td className="text-end">R$ {procedure.price?.toFixed(2) || '0.00'}</td> {/* Formata preço e alinha */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProceduresReport;