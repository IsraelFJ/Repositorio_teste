// src/components/IndexComponent.jsx
import React, { useState } from "react";

const IndexComponent = () => {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login:", login);
    console.log("Senha:", senha);
    // Aqui vai a lógica de autenticação (ex: chamada a API)
  };

  // Não há uma navbar superior, então a altura acima da imagem é 0.
  const headerHeight = '0px'; 

  // A largura da sua barra lateral (HeaderComponent) é 220px.
  const sidebarWidth = '220px'; 

  return (
    // Contêiner principal que ocupará a área da imagem de fundo e o formulário de login
    // Ele será posicionado ABSOLUTAMENTE para encaixar no espaço correto.
    <div
      style={{
        position: 'absolute', // Define a posição absoluta em relação ao seu pai (.App)
        top: headerHeight, // Começa no topo da viewport (0px)
        left: sidebarWidth, // Começa à direita da largura da sidebar (220px)
        width: `calc(100vw - ${sidebarWidth})`, // Ocupa a largura total da viewport menos a largura da sidebar
        height: `calc(100vh - ${headerHeight})`, // Ocupa a altura total da viewport menos a altura do header (100vh - 0px = 100vh)
        overflow: 'hidden', // Importante para evitar scroll extra no contêiner
        display: 'flex', // Para centralizar o conteúdo (formulário)
        alignItems: 'center', // Centraliza verticalmente o conteúdo (formulário)
        justifyContent: 'center', // Centraliza horizontalmente o conteúdo (formulário)
      }}
    >
      {/* Elemento para o background image - agora absoluto dentro deste contêiner */}
      <div
        style={{
          position: 'absolute', // Absoluto em relação ao seu pai (o div acima)
          top: 0,
          left: 0,
          width: '100%', // 100% da largura do contêiner pai
          height: '100%', // 100% da altura do contêiner pai
          backgroundImage: "url('/main-image.jpg')", // Caminho para sua imagem de fundo
          backgroundSize: "cover", // Garante que a imagem cubra toda a área
          backgroundPosition: "center", // Centraliza a imagem
          backgroundRepeat: "no-repeat", // Evita a repetição da imagem
          zIndex: -1, // Coloca a imagem atrás do conteúdo do formulário
        }}
      ></div>

      {/* Container do formulário de login - usando classes Bootstrap para responsividade */}
      <div 
        className="container"
        style={{
          position: 'relative', // Garante que o formulário fique acima da imagem de fundo
          zIndex: 1, // Garante que o formulário fique acima da imagem de fundo
          paddingTop: '1rem', 
          paddingBottom: '1rem', 
        }}
      >
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card p-4 shadow" style={{ backgroundColor: 'white' }}> {/* Adicionei background-color branco */}
              <h4 className="text-center mb-3">Login</h4>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="loginInput" className="form-label">Login:</label>
                  <input
                    type="text"
                    id="loginInput"
                    className="form-control"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="senhaInput" className="form-label">Senha:</label>
                  <input
                    type="password"
                    id="senhaInput"
                    className="form-control"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-primary">
                    Entrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexComponent;