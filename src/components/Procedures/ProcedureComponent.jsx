import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createProcedure,
  getProcedureById,
  updateProcedure,
} from "../../services/ProcedureService";

const ProcedureComponent = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0); // pq eh um numero

  const { id } = useParams();

  const navigator = useNavigate();

  const [errors, setErrors] = useState({
    name: "",
    price: "",
  });

  useEffect(() => {
    if (id) {
      getProcedureById(id)
        .then((response) => {
          setName(response.data.name);
          setPrice(response.data.price);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [id]);

  function validateForm() {
    let valid = true;

    const errorsCopy = { ...errors };

    if (name.trim()) {
      errorsCopy.name = "";
    } else {
      errorsCopy.name = "Name is required";
      valid = false;
    }

    if (price && !isNaN(price) && price > 0) {
      errorsCopy.price = "";
    } else {
      errorsCopy.price = "Price is required and must be a positive number";
      valid = false;
    }

    setErrors(errorsCopy);

    console.log(errorsCopy);

    return valid;
  } //validateForm

  function saveOrUpdateProcedure(e) {
    e.preventDefault();
    if (validateForm()) {
      const procedure = { name, price };

      if (id) {
        updateProcedure(id, procedure)
          .then((response) => {
            //console.log(response.data);
            navigator("/procedures");
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        createProcedure(procedure)
          .then((response) => {
            console.log(response.data);
            navigator("/procedures");
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }

  function pageTitle() {
    if (id) {
      return <h2 className="text-center">Atualizar Ferramenta</h2>;
    } else {
      return <h2 className="text-center">Adicionar Ferramenta</h2>;
    }
  }

  return (
    <div className="container">
      <br /> <br />
      <div className="row">
        <div className="card col-md-10 offset-md-1 offset-md-1">
          {pageTitle()}
          <div className="card-body">
            <form>
              <div className="form-group mb-2">
                <label className="form-label">Ferramenta:</label>
                <input
                  type="text"
                  placeholder="ferramenta"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  //   className="form-control"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                ></input>
                {errors.name && (
                  <div className="invalid-feedback">{errors.name} </div>
                )}
              </div>
              <div className="form-group mb-2">
                <label className="form-label">Valor:</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  //className="form-control"
                  className={`form-control ${errors.price ? "is-invalid" : ""}`}
                ></input>
                {errors.price && (
                  <div className="invalid-feedback">{errors.price} </div>
                )}
              </div>

              <button
                className="btn btn-success"
                onClick={saveOrUpdateProcedure}
              >
                {" "}
                Salvar{" "}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcedureComponent;
