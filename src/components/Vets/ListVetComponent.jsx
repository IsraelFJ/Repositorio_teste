import React, { useEffect, useState } from "react";
import { deleteVet, getAllVets } from "../../services/VetService";
import { useNavigate } from "react-router-dom";

const ListVetComponent = () => {
  const [vets, setVets] = useState([]);

  const navigator = useNavigate();

  useEffect(() => {
    listOfVets();
  }, []);

  function listOfVets() {
    getAllVets()
      .then((response) => {
        // console.log(response.data);
        setVets(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function addNewVet() {
    navigator("/add-vet");
  }

  function updateVet(id) {
    navigator(`/edit-vet/${id}`);
  }

  function removeVet(id) {
    deleteVet(id)
      .then((response) => {
        console.log(response.data);
        listOfVets();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className="container">
      <br />
      <h2 className="text-center">Lista de Assistentes de Controle</h2>
      <button className="btn btn-success" onClick={addNewVet}>
        Adicionar Novo Assistente
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nome</th>           
            <th>Matricula</th>
            <th>Telefone</th>
            <th>Unidade</th>
            <th>Estado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {vets.map((vet) => (
            <tr key={vet._id}>             
              <td>{vet.name}</td>
              <td>{vet.email}</td>
              <td>{vet.cellPhone}</td>
              <td>{vet.address}</td>
              <td>{vet.state}</td>
              <td>
                <button
                  onClick={() => updateVet(vet._id)}
                  className="btn btn-info"
                >
                  Atualizar
                </button>
                <button
                  onClick={() => removeVet(vet._id)}
                  className="btn btn-danger"
                  style={{ marginLeft: "10px" }}
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListVetComponent;
