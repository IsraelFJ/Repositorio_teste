import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createPet, getPetById, updatePet } from "../../services/PetService";
import { getAllClients } from "../../services/ClientService";

const PetComponent = () => {
  const [name, setName] = useState("");
  const [specie, setSpecie] = useState("");
  const [breed, setBreed] = useState("");
  const [color, setColor] = useState("");
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [gender, setGender] = useState("");
  // A variável 'birthDate' será usada para armazenar e enviar a DATA/HORA DE TÉRMINO DO SERVIÇO
  // Renomeie-a no seu modelo de backend se puder para algo como 'serviceCompletionDate'
  const [birthDate, setBirthDate] = useState(""); // Vai armazenar a string ISO da data/hora de término
  const [father, setFather] = useState("");
  const [mother, setMother] = useState("");
  const [observations, setObservations] = useState("");

  const [client, setClient] = useState("");
  const [clients, setClients] = useState([]);

  // Data e hora em que o serviço foi INICIADO (APENAS PARA CÁLCULO NO FRONTEND)
  const [serviceStartTimestamp, setServiceStartTimestamp] = useState(null); // Armazena timestamp em ms

  // Estados para o timer (APENAS PARA EXIBIÇÃO NO FRONTEND)
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const timerRef = useRef(null); // Para controlar o setInterval

  const { id } = useParams();
  const navigator = useNavigate();

  useEffect(() => {
    // Carrega clientes
    getAllClients()
      .then((response) => {
        setClients(response.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar clientes:", error);
      });

    // Lógica para NOVA Ordem de Serviço (quando !id)
    if (!id) {
      const now = new Date();
      setServiceStartTimestamp(now.getTime()); // Salva o timestamp de início
      setBirthDate(now.toISOString()); // Define a birthDate como a data atual inicialmente, será sobrescrita ao salvar

      // Inicia o timer
      timerRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 59) {
            setMinutes((prevMinutes) => {
              if (prevMinutes === 59) {
                setHours((prevHours) => prevHours + 1);
                return 0;
              }
              return prevMinutes + 1;
            });
            return 0;
          }
          return prevSeconds + 1;
        });
      }, 1000);
    } else {
      // Lógica para EDITAR Ordem de Serviço (quando id existe)
      getPetById(id)
        .then((response) => {
          setName(response.data.name);
          setGender(response.data.gender);
          setObservations(response.data.observations);
          setClient(response.data.client._id);

          // Carrega a data de término do serviço do backend na variável 'birthDate'
          if (response.data.birthDate) {
            const completionDate = new Date(response.data.birthDate);
            setBirthDate(completionDate.toISOString()); // Define a birthDate com a data de término carregada

            // Para calcular o tempo gasto anterior, precisamos de uma data de início.
            // A forma mais confiável é se o backend retornar uma `serviceStartDateTime` ou `createdAt` para a OS.
            // Se não tiver, o tempo gasto em edição será 0 ou não poderá ser calculado.
            // Para este exemplo, vamos assumir que o backend também tem 'serviceStartDateTime' ou 'createdAt'
            // que foi a data de quando a OS realmente começou ou foi criada.
            const serviceOriginalStartDate = response.data.serviceStartDateTime // Ou response.data.createdAt
                ? new Date(response.data.serviceStartDateTime)
                : completionDate; // Fallback: se não tiver inicio, assume que o fim é o inicio para nao bugar o calculo
            setServiceStartTimestamp(serviceOriginalStartDate.getTime());

            // Calcula o tempo gasto a partir das datas de início e término
            const diffSeconds = Math.floor((completionDate.getTime() - serviceOriginalStartDate.getTime()) / 1000);
            if (diffSeconds >= 0) { // Garante que não haja tempo negativo se datas estiverem trocadas
                setHours(Math.floor(diffSeconds / 3600));
                setMinutes(Math.floor((diffSeconds % 3600) / 60));
                setSeconds(diffSeconds % 60);
            }
          }
        })
        .catch((error) => {
          console.error("Erro ao carregar pet/OS:", error);
        });
    }

    // Função de limpeza: interrompe o timer ao desmontar o componente
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [id]);

  const [errors, setErrors] = useState({
    client: "",
    name: "",
    gender: "",
    birthDate: "", // Validação para a data de término
    observations: "",
  });

  function pageTitle() {
    if (id) {
      return <h2 className="text-center">Corrigir Ordem de Serviço</h2>;
    } else {
      return <h2 className="text-center">Adicionar Ordem de Serviço</h2>;
    }
  }

  function saveOrUpdatePet(e) {
    e.preventDefault();

    if (validateForm()) {
      // Para o timer antes de salvar
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Calcula a data e hora de término (que será salva em 'birthDate')
      const startDateTimeForCalculation = new Date(serviceStartTimestamp);
      const totalElapsedTimeMillis = (hours * 3600 + minutes * 60 + seconds) * 1000;
      const finalCompletionDate = new Date(startDateTimeForCalculation.getTime() + totalElapsedTimeMillis);

      // Atualiza o estado 'birthDate' com a data/hora de término calculada
      // Ela será enviada para o backend
      setBirthDate(finalCompletionDate.toISOString());

      // Objeto a ser enviado para o backend
      const pet = {
        client,
        name,
        gender,
        birthDate: finalCompletionDate.toISOString(), // A ÚNICA DATA/HORA enviada para o backend
        observations,
        // IMPORTANTE: Se o backend precisar da data de início para recalcular a duração,
        // e você não a está salvando como um campo separado, ela precisaria ser um
        // campo 'createdAt' ou similar gerenciado pelo backend na criação da OS.
        // Se precisar enviar a data de início também, adicione-a aqui:
        // serviceStartDateTime: new Date(serviceStartTimestamp).toISOString(),
      };

      if (id) {
        updatePet(id, pet)
          .then((response) => {
            console.log(response.data);
            navigator("/pets");
          })
          .catch((error) => {
            console.error("Erro ao atualizar pet/OS:", error);
          });
      } else {
        createPet(pet)
          .then((response) => {
            console.log(response.data);
            navigator("/pets");
          })
          .catch((error) => {
            console.error("Erro ao criar pet/OS:", error);
          });
      }
    }
  }

  function validateForm() {
    let valid = true;
    const errorsCopy = { ...errors };

    if (!client) {
      errorsCopy.client = "Selecione o Consultor";
      valid = false;
    } else {
      errorsCopy.client = "";
    }

    if (!name.trim()) {
      errorsCopy.name = "O campo Ordem de Serviço é obrigatório";
      valid = false;
    } else {
      errorsCopy.name = "";
    }

    if (!gender.trim()) {
      errorsCopy.gender = "A Prioridade é obrigatória";
      valid = false;
    } else {
      errorsCopy.gender = "";
    }

    // Validação da 'birthDate' (que agora é a data de término)
    if (!serviceStartTimestamp) { // Se não tiver um timestamp de início, a data de término não pode ser calculada
      errorsCopy.birthDate = "Não foi possível determinar a data de início do serviço.";
      valid = false;
    } else {
      errorsCopy.birthDate = "";
    }

    if (!observations.trim()) {
      errorsCopy.observations = "As Observações são obrigatórias";
      valid = false;
    } else {
      errorsCopy.observations = "";
    }

    setErrors(errorsCopy);
    return valid;
  }

  // Função auxiliar para formatar componentes de tempo (HH, MM, SS)
  const formatTimeComponent = (value) => String(value).padStart(2, "0");

  // Função para formatar um timestamp (ms) para exibição completa de data/hora
  const formatTimestampForDisplay = (timestamp) => {
    if (!timestamp) return "";
    const dateObj = new Date(timestamp);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="container">
      <br /> <br />
      <div className="row">
        <div className="card col-md-10 offset-md-1 offset-md-1">
          {pageTitle()}
          <div className="card-body">
            <form>
              <div className="form-group mb-2">
                <label className="form-label">Consultor:</label>
                <select
                  className={`form-control ${
                    errors.client ? "is-invalid" : ""
                  }`}
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                >
                  <option value="">Selecione o Consultor</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.name}
                    </option>
                  ))}
                </select>
                {errors.client && (
                  <div className="invalid-feedback">{errors.client}</div>
                )}
              </div>

              <div className="form-group mb-2">
                <label className="form-label">Ordem de Serviço:</label>
                <input
                  type="text"
                  placeholder="Ordem de Serviço"
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
                <label className="form-label">Prioridade:</label>
                <select
                  name="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={`form-control ${
                    errors.gender ? "is-invalid" : ""
                  }`}
                >
                  <option value="">Selecione a Prioridade</option>
                  <option value="Normal">Normal</option>
                  <option value="Urgente">Urgente</option>
                </select>
                {errors.gender && (
                  <div className="invalid-feedback">{errors.gender}</div>
                )}
              </div>

              {/* Início do Serviço (apenas para exibição, baseado no timestamp inicial) */}
              <div className="form-group mb-2">
                <label className="form-label">Início do Serviço:</label>
                <input
                  type="text"
                  name="serviceStartDisplay"
                  value={formatTimestampForDisplay(serviceStartTimestamp)}
                  readOnly
                  className="form-control"
                ></input>
              </div>

              {/* Exibição do Timer (Tempo Gasto) */}
              <div className="form-group mb-2">
                <label className="form-label">Tempo Gasto:</label>
                <input
                  type="text"
                  className="form-control"
                  value={`${formatTimeComponent(hours)}:${formatTimeComponent(
                    minutes
                  )}:${formatTimeComponent(seconds)}`}
                  readOnly
                />
              </div>

              {/* Data e Hora de Término do Serviço (o conteúdo da variável 'birthDate' que será enviada) */}
              {/* <div className="form-group mb-2">
                <label className="form-label">Término do Serviço:</label>
                <input
                  type="text"
                  name="birthDate" // Nome do campo original, mas agora é a data de término
                  value={formatTimestampForDisplay(birthDate ? new Date(birthDate).getTime() : null)}
                  readOnly
                  className={`form-control ${
                    errors.birthDate ? "is-invalid" : ""
                  }`}
                />
                {errors.birthDate && (
                  <div className="invalid-feedback">{errors.birthDate}</div>
                )}
              </div> */}

              <div className="form-group mb-2">
                <label className="form-label">Observações:</label>
                <textarea
                  placeholder="Observações"
                  name="observations"
                  rows="5"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className={`form-control ${
                    errors.observations ? "is-invalid" : ""
                  }`}
                ></textarea>
                {errors.observations && (
                  <div className="invalid-feedback">{errors.observations} </div>
                )}
              </div>

              <button className="btn btn-success" onClick={saveOrUpdatePet}>
                Salvar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetComponent;