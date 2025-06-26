import React, { useEffect, useState } from "react";
import { getAllPets } from "../../services/PetService"; // Certifique-se de que o caminho está correto

const PetsReport = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true); // Novo estado para controlar o carregamento
  const [error, setError] = useState(null);     // Novo estado para controlar erros

  useEffect(() => {
    console.log("Componente PetsReport montado!");
    listOfPets();
  }, []);

  function listOfPets() {
    setLoading(true); // Inicia o estado de carregamento
    setError(null);   // Limpa qualquer erro anterior
    console.log("Chamando getAllPets para o relatório...");

    getAllPets()
      .then((response) => {
        console.log("Dados recebidos da API para o relatório:", response.data);
        // Garante que response.data seja um array, mesmo que a API retorne null/undefined/outro
        if (response.data && Array.isArray(response.data)) {
          setPets(response.data);
        } else {
          console.warn("Resposta da API para o relatório não é um array ou está vazia/inesperada:", response.data);
          setPets([]); // Garante que pets seja um array vazio se a resposta for inesperada
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar ordens de serviço para o relatório:", err);
        setError("Não foi possível carregar o relatório. Verifique sua conexão ou tente novamente mais tarde.");
        setPets([]); // Garante que pets seja um array vazio em caso de erro
      })
      .finally(() => {
        setLoading(false); // Finaliza o estado de carregamento
      });
  }

  // --- Renderização Condicional ---
  if (loading) {
    return (
      <div className="container text-center mt-5">
        <h2>Carregando Relatório de Ordens de Serviço...</h2>
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
        <button className="btn btn-primary" onClick={listOfPets}>Tentar Novamente</button>
      </div>
    );
  }

  return (
    <div className="container">
      <br />
      <h2 className="text-center">Relatório de Ordens de Serviço</h2>

      {pets.length === 0 ? (
        <div className="alert alert-info text-center mt-3" role="alert">
          Nenhuma ordem de serviço encontrada para o relatório.
        </div>
      ) : (
        <table className="table table-striped table-hover"> {/* Adicionado classes do Bootstrap para estilo */}
          <thead>
            <tr>
              <th>Serviço</th>
              <th>Consultor</th>
              <th>Urgência</th> {/* Mantido 'Urgência' conforme seu código */}
            </tr>
          </thead>
          <tbody>
            {pets.map((pet) => (
              <tr key={pet._id}>
                <td>{pet.name}</td>
                {/* Acessa pet.client.name com segurança. Se pet.client for null/undefined, mostra 'N/A'. */}
                <td>{pet.client ? pet.client.name : 'N/A'}</td>
                {/* Acessa pet.gender com segurança. Se pet.gender for null/undefined, mostra 'N/A'. */}
                <td>{pet.gender ? pet.gender : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PetsReport;