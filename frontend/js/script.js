const protocolo = "http://";
const base = "localhost:3000";
const filmesEndpoint = "/filmes";

function displayError(error) {
  document.querySelector(
    "#content"
  ).innerHTML = `<p class="text-center">⛔ Ops, ocorreu um erro:<br/><strong>${error.message}</strong></p>`;
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
  } catch (error) {
    displayError(error);
  }
}
