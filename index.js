require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
const DBHelper = require("./util/db_helper");

const app = express();

app.use(cors());
app.use(express.json());

const db = new DBHelper();
db.connect();

// Cria uma hash para um filme
function criarHash(filme) {
  return crypto.createHash("sha1").update(JSON.stringify(filme)).digest("hex");
}

// Valida o filme checando sua existência e se os campos obrigatórios estão preenchidos
async function validarFilme(filme) {
  if (
    await db.Filme.findOne({
      titulo: filme.titulo,
      sinopse: filme.sinopse,
    })
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

app.get("/filmes", async (req, res) => {
  let filmes = await db.Filme.find();

  res.send(filmes);
});

app.get("/filmes/:hash", async (req, res) => {
  const filme = await db.Filme.findOne({ hash: req.params.hash });

  if (!filme) {
    res.status(404).send({ erro: "Filme não encontrado" });
  } else {
    res.send(filme);
  }
});

app.post("/filmes", async (req, res) => {
  try {
    const filme = req.body;
    await validarFilme(filme);

    var newFilme = new db.Filme({
      hash: criarHash(filme),
      titulo: filme.titulo,
      sinopse: filme.sinopse,
    });

    await newFilme.save();

    var filmes = await db.Filme.find();
    console.log(filmes);

    res.status(201).json(filmes);
  } catch (error) {
    res.status(400).send({ erro: error.message });
  }
});

app.put("/filmes/:hash", async (req, res) => {
  try {
    const filme = req.body;
    await validarFilme(filme);

    if (await db.Filme.findOne({ hash: req.params.hash })) {
      await db.Filme.updateOne(
        { hash: req.params.hash },
        {
          hash: criarHash(filme),
          titulo: filme.titulo,
          sinopse: filme.sinopse,
        }
      );
    } else {
      res.status(404).send({ erro: "Filme não encontrado" });
    }

    var filmes = await db.Filme.find();

    res.status(200).json(filmes);
  } catch (error) {
    res.status(400).send({ erro: error.message });
  }
});

app.delete("/filmes/:hash", async (req, res) => {
  var filme = await db.Filme.findOne({
    hash: req.params.hash,
  });

  if (!filme) {
    res.status(404).send({ erro: "Filme não encontrado" });
  } else {
    await filme.deleteOne();
    var filmes = await db.Filme.find();
    res.send(filmes);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

module.exports = app;
