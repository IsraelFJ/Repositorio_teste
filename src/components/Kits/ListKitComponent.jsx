import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteKit,
  getAllKits,
} from "../../services/KitsService"; // Caminho e métodos corretos

const ListKitComponent = () => {
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigator = useNavigate();

  function listOfKits() {
    setLoading(true);
    setError(null);
    console.log("Chamando getAllKits...");

    getAllKits()
      .then((response) => {
        console.log("Dados dos Kits recebidos:", response.data);
        if (response.data && Array.isArray(response.data)) {
          setKits(response.data);
        } else {
          console.warn("Resposta da API para Kits não é um array ou está vazia/inesperada:", response.data);
          setKits([]);
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar kits:", err);
        setError("Não foi possível carregar a lista de kits. Verifique sua conexão ou tente novamente.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    console.log("ListKitComponent montado!");
    listOfKits();
  }, []);

  function addNewKit() {
    navigator("/add-kit");
  }

  function updateKit(id) {
    console.log("ListKitComponent: ID do Kit para atualização:", id); // <<<< ESTA LINHA É CRÍTICA
    navigator(`/edit-kit/${id}`);
}

  function removeKit(id) {
    if (window.confirm("Tem certeza que deseja deletar este kit?")) {
      console.log(`Deletando Kit com ID: ${id}`);
      setError(null);

      deleteKit(id)
        .then((response) => {
          console.log("Kit deletado com sucesso:", response.data);
          listOfKits();
        })
        .catch((err) => {
          console.error("Erro ao deletar kit:", err);
          setError("Erro ao deletar o kit. Tente novamente.");
          alert("Erro ao deletar o kit!");
        });
    }
  }

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <h2>Carregando Ferramentas do Kit...</h2>
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
      <h2 className="text-center">Lista de Ferramentas do Kit</h2>
      <button className="btn btn-success mb-3" onClick={addNewKit}>
        Adicionar Ferramenta para Kit
      </button>

      {kits.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          Nenhum kit de ferramenta encontrado. Adicione um novo!
        </div>
      ) : (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Ferramenta</th>
              <th>Valor (R$)</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {kits.map((kit) => (
              <tr key={kit._id}>
                <td>{kit.name}</td>
                <td>R$ {kit.price}</td>
                <td>
                  <button
                    onClick={() => updateKit(kit._id)}
                    className="btn btn-info btn-sm"
                  >
                    Atualizar
                  </button>
                  <button
                    onClick={() => removeKit(kit._id)}
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

export default ListKitComponent;