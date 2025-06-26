import React from "react";

const HeaderComponent = () => {
  const wilsonSonsBlue = "#336699";

  return (
    <div
      style={{
        height: "100vh",
        width: "220px",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: wilsonSonsBlue,
        color: "#fff",
        padding: "20px",
        overflowY: "auto",
        zIndex: 1000,
      }}
    >
      <a href="/" className="navbar-brand d-flex align-items-center mb-4 text-white text-decoration-none">
        <img
          src="/logo.png"
          alt="Logo Wilson Sons"
          style={{
            height: "40px",
            marginRight: "10px",
          }}
        />
        <span>Administração</span>
      </a>

      <ul className="nav flex-column">
        <li className="nav-item">
          <a className="nav-link text-white" href="/clients">
            Consultores
          </a>
        </li>        
        <li className="nav-item">
          <a className="nav-link text-white" href="/vets">
            Assistentes de Controle
          </a>
          <li className="nav-item">
          <a className="nav-link text-white" href="/pets">
            Ordem de Serviço
          </a>
        </li>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white" href="/procedures">
            Ferramentas Compartilhadas
          </a>
        </li>
         <li className="nav-item">
          <a className="nav-link text-white" href="/kits">
            Ferramentas Individuais
          </a>
        </li>
        
        <li className="nav-item">
          <a className="nav-link text-white" href="/consultations">
            Solicitar Ferramentas
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white" href="/reports">
            Relatórios
          </a>
        </li>
      </ul>
    </div>
  );
};

export default HeaderComponent;
