import React, { useEffect, useState } from "react";
import { deleteClient, getAllClients } from "../../services/ClientService";
import { useNavigate } from "react-router-dom";

const ListClientComponent = () => {
  const [clients, setClients] = useState([]);

  const navigator = useNavigate();

  useEffect(() => {
    listOfClients();
  }, []);

  function listOfClients() {
    getAllClients()
      .then((response) => {
        // console.log(response.data);
        setClients(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function addNewClient() {
    navigator("/add-client");
  }

  function updateClient(id) {
    navigator(`/edit-client/${id}`);
  }

  function removeClient(id) {
    deleteClient(id)
      .then((response) => {
        console.log(response.data);
        listOfClients();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className="container">
      <br />
      <h2 className="text-center"> Lista de Consultores</h2>
      <button className="btn btn-success" onClick={addNewClient}>
        Adicionar Consultor
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
          {clients.map((client) => (
            <tr key={client._id}>             
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.cellPhone}</td>
              <td>{client.address}</td>
              <td>{client.state}</td>
              <td>
                <button
                  onClick={() => updateClient(client._id)}
                  className="btn btn-info"
                >
                  Auditar/Editar
                </button>
                <button
                  onClick={() => removeClient(client._id)}
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

export default ListClientComponent;
