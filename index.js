const express = require("express");
const crypto = require("crypto");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let filmes = [
  {
    titulo: "Paris, Texas",
    sinopse:
      "Um homem mudo e desmemoriado é encontrado no deserto do Texas. Ele é levado para Los Angeles por seu irmão, onde tenta recuperar sua memória e seu passado.",
    hash: "751ea72c621353703a03c3d363fde99127eff53e",
  },
  {
    titulo: "Bastardos Inglórios",
    sinopse:
      "Durante a ocupação da França pela Alemanha nazista, um grupo de soldados judeus americanos conhecidos como Bastardos de Aldo Raine são selecionados para espalhar o medo entre os nazistas.",
    hash: "d4145f13a0c4c0f8ca26676a25a33a4cf48ee485",
  },
  {
    titulo: "Interestelar",
    sinopse:
      "Um grupo de exploradores faz uso de um buraco de minhoca recém-descoberto para superar as limitações de viagens espaciais humanas e conquistar as vastas distâncias envolvidas em uma viagem interestelar.",
    hash: "18c4e50d96e30a0b3ab7538196ebcfedb0a0c66c",
  },
];

// Cria uma hash para um filme
function criarHash(filme) {
  return crypto.createHash("sha1").update(JSON.stringify(filme)).digest("hex");
}

// Valida o filme checando sua existência e se os campos obrigatórios estão preenchidos
function validarFilme(filme) {
  if (
    filmes.find((f) => f.hash === criarHash(filme) || f.titulo === filme.titulo)
  ) {
    throw new Error("Esse filme já foi cadastrado");
  }

  if (!filme.titulo) {
    throw new Error("O campo 'titulo' é obrigatório");
  }

  if (!filme.sinopse) {
    throw new Error("O campo 'sinopse' é obrigatório");
  }

  return true;
}

app.get("/filmes", (req, res) => {
  res.send(filmes);
});

app.get("/filmes/:hash", (req, res) => {
  const filme = filmes.find((filme) => filme.hash === req.params.hash);

  if (!filme) {
    res.status(404).send({ erro: "Filme não encontrado" });
  } else {
    res.send(filme);
  }
});

app.post("/filmes", (req, res) => {
  try {
    const filme = req.body;
    validarFilme(filme);

    filmes.push({
      ...filme,
      hash: criarHash(filme),
    });

    res.status(201).json(filmes);
  } catch (error) {
    res.status(400).send({ erro: error.message });
  }
});

app.put("/filmes/:hash", (req, res) => {
  try {
    const filme = req.body;
    validarFilme(filme);

    const index = filmes.findIndex((f) => f.hash === req.params.hash);

    if (index === -1) {
      throw new Error("Filme não encontrado");
    }

    filmes[index] = {
      ...filme,
      hash: criarHash(filme),
    };

    res.status(200).json(filmes);
  } catch (error) {
    res.status(400).send({ erro: error.message });
  }
});

app.delete("/filmes/:hash", (req, res) => {
  const index = filmes.findIndex((filme) => filme.hash === req.params.hash);

  if (index === -1) {
    res.status(404).send({ erro: "Filme não encontrado" });
  } else {
    filmes.splice(index, 1);
    res.send(filmes);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

(module.exports = app), filmes;
