const protocolo = "http://";
const base = "localhost:3000";
const filmesEndpoint = "/filmes";

function displayAlert(alertType, message) {
  let alert = document.querySelector(".alert");
  alert.className = `alert alert-${alertType} show`;
  alert.classList.remove("d-none");
  alert.textContent = message;

  setTimeout(() => {
    alert.classList.remove("show");
    alert.classList.add("d-none");
  }, 5000);
}

function displayError(error) {
  displayAlert("danger", `Erro: ${error.message}`);
}

function displayFilmes(filmes) {
  let tabela = document.querySelector(".table");
  let tbody = tabela.querySelector("tbody");

  tbody.innerHTML = "";

  filmes.forEach((filme) => {
    let linha = tbody.insertRow();
    let titulo = linha.insertCell();
    let sinopse = linha.insertCell();

    titulo.textContent = filme.titulo;
    sinopse.textContent = filme.sinopse;
  });
}

async function cadastrarFilme() {
  let titulo = document.querySelector("#tituloInput").value;
  let sinopse = document.querySelector("#sinopseInput").value;

  try {
    const url = `${protocolo}${base}${filmesEndpoint}`;
    const filme = await axios
      .post(url, { titulo, sinopse })
      .catch((error) => {
        throw new Error(error.response.data.erro);
      })
      .then((res) => {
        return res.data;
      });

    displayAlert("success", "Filme cadastrado com sucesso!");
    displayFilmes(filme);
  } catch (error) {
    displayError(error);
  }
}

async function obterFilmes() {
  try {
    const url = `${protocolo}${base}${filmesEndpoint}`;
    const filmes = await axios
      .get(url)
      .catch((error) => {
        throw new Error(error.response.data.erro);
      })
      .then((res) => {
        return res.data;
      });

    displayFilmes(filmes);
  } catch (error) {
    displayError(error);
  }
}
