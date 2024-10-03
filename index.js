const express = require("express");
const crypto = require("crypto");

const app = express();

app.use(express.json());

let filmes = [
  {
    titulo: "Paris, Texas",
    sinopse:
      "Um homem mudo e desmemoriado é encontrado no deserto do Texas. Ele é levado para Los Angeles por seu irmão, onde tenta recuperar sua memória e seu passado.",
  },
  {
    titulo: "Bastardos Inglórios",
    sinopse:
      "Durante a ocupação da França pela Alemanha nazista, um grupo de soldados judeus americanos conhecidos como Bastardos de Aldo Raine são selecionados para espalhar o medo entre os nazistas.",
  },
  {
    titulo: "Interestelar",
    sinopse:
      "Um grupo de exploradores faz uso de um buraco de minhoca recém-descoberto para superar as limitações de viagens espaciais humanas e conquistar as vastas distâncias envolvidas em uma viagem interestelar.",
  },
];

// Cria uma hash para um filme
function criarHash(filme) {
  return crypto.createHash("sha1").update(JSON.stringify(filme)).digest("hex");
}

// Adiciona a hash a cada filme
filmes.forEach((filme) => {
  filme.hash = criarHash(filme);
});

// Valida o filme checando sua existência e se os campos obrigatórios estão preenchidos
function validarFilme(filme, filmes) {
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

app.post("/filmes", (req, res) => {
  try {
    const filme = req.body;
    validarFilme(filme, filmes);

    filmes.push({
      ...filme,
      hash: criarHash(filme),
    });

    res.json(filmes);
  } catch (error) {
    res.status(400).send({ erro: error.message });
  }
});

app.get("/filmes", (req, res) => {
  res.send(filmes);
});

app.get("/filmes/:hash", (req, res) => {
  const t1 = performance.now();
  const filme = filmes.find((filme) => filme.hash === req.params.hash);
  const t2 = performance.now();

  console.log(`Tempo de execução: ${t2 - t1}ms`);

  if (!filme) {
    res.status(404).send({ erro: "Filme não encontrado" });
  } else {
    res.send(filme);
  }
});

app.put("/filmes/:hash", (req, res) => {
  try {
    const filme = req.body;
    validarFilme(filme, filmes);

    const index = filmes.findIndex((f) => f.hash === req.params.hash);

    if (index === -1) {
      throw new Error("Filme não encontrado");
    }

    filmes[index] = {
      ...filme,
      hash: criarHash(filme),
    };

    res.json(filmes);
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
