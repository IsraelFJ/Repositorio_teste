import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createKit,
  getKit, // Renomeado de getKitById para getKit
  updateKit,
} from "../../services/KitsService"; // Verifique o caminho correto!

const KitComponent = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);

  const { id } = useParams();
  const navigator = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [errors, setErrors] = useState({
    name: "",
    price: "",
  });

  const pageTitle = () => {
    if (id) {
      return <h2 className="text-center">Atualizar Kit de Ferramentas</h2>;
    } else {
      return <h2 className="text-center">Adicionar Kit de Ferramentas</h2>;
    }
  };

  useEffect(() => {
    console.log("KitComponent montado!");

    if (id) {
      console.log(`Carregando dados para edição do Kit com ID: ${id}`);
      setLoading(true);
      setError(null);

      // Usando getKit conforme renomeado no KitsService
      getKit(id) 
        .then((response) => {
          console.log("Dados do Kit recebidos:", response.data);
          if (response.data) {
            setName(response.data.name || "");
            setPrice(parseFloat(response.data.price) || 0);
          } else {
            setError("Nenhum dado encontrado para este Kit.");
            console.warn("Resposta vazia para o Kit ID:", id);
          }
        })
        .catch((err) => {
          console.error("Erro ao buscar Kit:", err);
          setError("Não foi possível carregar os dados do Kit. Verifique a conexão ou tente novamente.");
          if (err.response && err.response.status === 404) {
            navigator("/kits");
            alert("Kit não encontrado!");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      console.log("Iniciando formulário para um novo Kit.");
    }
  }, [id, navigator]);

  function validateForm() {
    let valid = true;
    const errorsCopy = { name: "", price: "" };

    if (!name.trim()) {
      errorsCopy.name = "O nome é obrigatório.";
      valid = false;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      errorsCopy.price = "O valor é obrigatório e deve ser um número positivo.";
      valid = false;
    }

    setErrors(errorsCopy);
    console.log("Erros de validação:", errorsCopy);
    return valid;
  }

  function saveOrUpdateKit(e) {
    e.preventDefault();

    if (validateForm()) {
      const kit = { name, price: parseFloat(price) };

      if (id) {
        console.log("Atualizando Kit:", kit);
        updateKit(id, kit)
          .then((response) => {
            console.log("Kit atualizado com sucesso:", response.data);
            navigator("/kits");
          })
          .catch((err) => {
            console.error("Erro ao atualizar Kit:", err);
            setError("Erro ao atualizar o Kit. Tente novamente.");
            alert("Erro ao atualizar o Kit!");
          });
      } else {
        console.log("Criando novo Kit:", kit);
        createKit(kit) // Usando createKit (com 'K' maiúsculo)
          .then((response) => {
            console.log("Kit criado com sucesso:", response.data);
            navigator("/kits");
          })
          .catch((err) => {
            console.error("Erro ao criar Kit:", err);
            setError("Erro ao criar o Kit. Tente novamente.");
            alert("Erro ao criar o Kit!");
          });
      }
    } else {
      console.log("Validação do formulário falhou.");
    }
  }

  if (loading && id) {
    return (
      <div className="container text-center mt-5">
        <h2>Carregando Kit...</h2>
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
        {!id && <button className="btn btn-primary" onClick={() => { /* Recarregar talvez? */ }}>Tentar Novamente</button>}
      </div>
    );
  }

  return (
    <div className="container">
      <br /> <br />
      <div className="row">
        <div className="card col-md-10 offset-md-1">
          {pageTitle()}
          <div className="card-body">
            <form onSubmit={saveOrUpdateKit}>
              <div className="form-group mb-2">
                <label className="form-label">Ferramenta do Kit:</label>
                <input
                  type="text"
                  placeholder="ferramenta do Kit"
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
                <label className="form-label">Valor (R$):</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={`form-control ${errors.price ? "is-invalid" : ""}`}
                ></input>
                {errors.price && (
                  <div className="invalid-feedback">{errors.price} </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-success"
              >
                Salvar
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => navigator("/kits")}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitComponent;