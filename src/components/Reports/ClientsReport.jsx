import React, { useEffect, useState } from "react";
import { getAllClients } from "../../services/ClientService";

const ClientsReport = () => {
  const [clients, setClients] = useState([]);

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

  return (
    <div className="container">
      <br />
      <h2 className="text-center">Relatorio de Consultores</h2>
      <br />
      <table className="table ">
        <thead>
          <tr>           
            <th>Nome</th>
            <th>Matricula</th>
            <th>Telefone</th>
            <th>Unidade</th>
            <th>Estado</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientsReport;
