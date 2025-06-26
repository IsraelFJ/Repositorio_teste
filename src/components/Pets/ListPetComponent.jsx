import React, { useEffect, useState } from "react";
import { deletePet, getAllPets } from "../../services/PetService";
import { useNavigate } from "react-router-dom";

const ListPetComponent = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true); // Novo estado para controlar o carregamento
  const [error, setError] = useState(null);     // Novo estado para controlar erros

  const navigator = useNavigate();

  useEffect(() => {
    console.log("Componente ListPetComponent montado!");
    listOfPets();
  }, []);

  function listOfPets() {
    setLoading(true); // Inicia o estado de carregamento
    setError(null);   // Limpa qualquer erro anterior
    console.log("Chamando getAllPets...");

    getAllPets()
      .then((response) => {
        console.log("Dados recebidos da API:", response.data);
        if (response.data && Array.isArray(response.data)) {
          setPets(response.data);
        } else {
          console.warn("Resposta da API não é um array ou está vazia:", response.data);
          setPets([]); // Garante que pets seja um array vazio se a resposta for inesperada
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar pets:", err);
        setError("Não foi possível carregar as ordens de serviço. Tente novamente mais tarde.");
        setPets([]); // Garante que pets seja um array vazio em caso de erro
      })
      .finally(() => {
        setLoading(false); // Finaliza o estado de carregamento
      });
  }

  function addNewPet() {
    navigator("/add-pet");
  }

  function updatePet(id) {
    navigator(`/edit-pet/${id}`);
  }

  function removePet(id) {
    // Confirmação antes de deletar
    if (!window.confirm("Tem certeza que deseja deletar esta ordem de serviço?")) {
      return;
    }

    deletePet(id)
      .then((response) => {
        console.log("Pet deletado com sucesso:", response.data);
        listOfPets(); // Recarrega a lista após a exclusão
      })
      .catch((error) => {
        console.error("Erro ao deletar pet:", error);
        alert("Erro ao deletar a ordem de serviço. Verifique o console para mais detalhes."); // Alerta em caso de erro na exclusão
      });
  }

  // Renderização condicional para carregamento, erro ou lista vazia
  if (loading) {
    return (
      <div className="container text-center mt-5">
        <h2>Carregando Ordens de Serviço...</h2>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
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
      <h2 className="text-center">Ordens de Serviço</h2>
      <button className="btn btn-success mb-3" onClick={addNewPet}>
        Adicionar Nova
      </button>

      {pets.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          Nenhuma ordem de serviço encontrada.
        </div>
      ) : (
        <table className="table table-striped table-hover"> {/* Adicionado table-hover para melhor UX */}
          <thead>
            <tr>
              <th>Ordem de Serviço</th>
              <th>Consultor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet) => (
              <tr key={pet._id}>
                <td>{pet.name}</td>
                <td>{pet.client ? pet.client.name : 'N/A'}</td> {/* Adicionado verificação para client */}
                <td>
                  <button
                    onClick={() => updatePet(pet._id)}
                    className="btn btn-info btn-sm" // btn-sm para botões menores
                  >
                    Atualizar
                  </button>
                  <button
                    onClick={() => removePet(pet._id)}
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

export default ListPetComponent;