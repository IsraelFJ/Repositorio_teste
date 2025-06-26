import React, { useEffect, useState } from "react";
import { getAllKits } from "../../services/KitsService"; // Certifique-se de que o caminho está correto

const KitsReport = () => {
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0); // Estado para o valor total

  useEffect(() => {
    console.log("KitsReport montado!");
    listOfKits();
  }, []);

  function listOfKits() {
    setLoading(true);
    setError(null);
    console.log("Chamando getAllKits para o relatório...");

    getAllKits()
      .then((response) => {
        console.log("Dados dos Kits para relatório recebidos:", response.data);
        if (response.data && Array.isArray(response.data)) {
          setKits(response.data);
          calculateTotalPrice(response.data); // Chama a função para calcular o total
        } else {
          console.warn("Resposta da API para KitsReport não é um array ou está vazia/inesperada:", response.data);
          setKits([]);
          setTotalPrice(0);
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar kits para relatório:", err);
        setError("Não foi possível carregar o relatório de kits. Verifique sua conexão ou tente novamente.");
        setTotalPrice(0);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const calculateTotalPrice = (kitsArray) => {
    const total = kitsArray.reduce((sum, kit) => {
      return sum + (typeof kit.price === 'number' ? kit.price : 0);
    }, 0);
    setTotalPrice(total);
    console.log("Valor Total das Ferramentas:", total.toFixed(2));
  };

  // Renderização condicional para feedback ao usuário
  if (loading) {
    return (
      <div className="container text-center mt-5">
        <h2>Carregando Relatório de Ferramentas do Kit...</h2>
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
        <button className="btn btn-primary mt-3" onClick={listOfKits}>Tentar Novamente</button>
      </div>
    );
  }

  return (
    <div className="container">
      <br />
      <h2 className="text-center">Relatório de Ferramentas Individuais</h2>

      {/* NOVO POSICIONAMENTO PARA O VALOR TOTAL */}
      {kits.length > 0 && ( // Só mostra o total se houver kits
        <div className="row justify-content-end mb-2"> {/* Usamos um row para flexibilidade */}
          <div className="col-auto"> {/* col-auto para que a coluna se ajuste ao conteúdo */}
            <h5 className="mb-0"> {/* mb-0 para remover margem inferior */}
              <strong>Total:</strong> R$ {totalPrice.toFixed(2)}
            </h5>
          </div>
        </div>
      )}
      {/* FIM DO NOVO POSICIONAMENTO */}

      {kits.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          Nenhum kit de ferramenta encontrado para o relatório.
        </div>
      ) : (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Nome</th>
              <th className="text-end">Valor (R$)</th> {/* Certifique-se de que esta coluna está alinhada à direita */}
            </tr>
          </thead>
          <tbody>
            {kits.map((kit) => (
              <tr key={kit._id}>
                <td>{kit.name}</td>
                <td className="text-end">R$ {kit.price?.toFixed(2) || '0.00'}</td> {/* Alinhe os valores dos itens à direita */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default KitsReport;