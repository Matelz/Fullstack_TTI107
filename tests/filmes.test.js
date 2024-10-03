const request = require("supertest");
const app = require("../index");

const filmes = [
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

const mockFilme = {
  titulo: "Matrix",
  sinopse:
    "Um jovem programador é atormentado por estranhos pesadelos nos quais sempre está conectado por cabos a um imenso sistema de computadores do futuro. Ele é conduzido ao encontro dos misteriosos Morpheus e Trinity, que o levam a conhecer a verdadeira natureza da realidade.",
};

describe("GET /filmes", () => {
  it("Deve retornar a lista de filmes", async () => {
    return request(app)
      .get("/filmes")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(filmes);
      });
  });
});

describe("GET /filmes/:hash", () => {
  it("Deve retornar um filme específico", async () => {
    return request(app)
      .get("/filmes/751ea72c621353703a03c3d363fde99127eff53e")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(filmes[0]);
      });
  });

  it("Deve retornar um erro 404 se o filme não existir", async () => {
    return request(app).get("/filmes/naoexiste").expect(404);
  });
});

describe("POST /filmes", () => {
  it("Deve adicionar um novo filme", async () => {
    return request(app)
      .post("/filmes")
      .send(mockFilme)
      .expect(201)
      .then((response) => {
        expect(response.body).toContainEqual({
          ...mockFilme,
          hash: expect.any(String),
        });
      });
  });

  it("Deve retornar um erro 400 se o filme já existir", async () => {
    return request(app)
      .post("/filmes")
      .send(filmes[0])
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ erro: "Esse filme já foi cadastrado" });
      });
  });

  it("Deve retornar um erro 400 se o título não for informado", async () => {
    return request(app)
      .post("/filmes")
      .send({ sinopse: "Sinopse" })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({
          erro: "O campo 'titulo' é obrigatório",
        });
      });
  });

  it("Deve retornar um erro 400 se a sinopse não for informada", async () => {
    return request(app)
      .post("/filmes")
      .send({ titulo: "Título" })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({
          erro: "O campo 'sinopse' é obrigatório",
        });
      });
  });
});

describe("PUT /filmes/:hash", () => {
  it("Deve atualizar um filme", async () => {
    return request(app)
      .put("/filmes/18c4e50d96e30a0b3ab7538196ebcfedb0a0c66c")
      .send({
        titulo: "Shrek",
        sinopse:
          "Um ogro tem sua vida invadida por personagens de contos de fadas que acabam com a tranquilidade de seu lar. Ele faz um acordo pra resgatar uma princesa.",
      })
      .expect(200);
  });

  it("Deve retornar um erro 400 se o filme não existir", async () => {
    return request(app).put("/filmes/naoexiste").send(mockFilme).expect(400);
  });

  it("Deve retornar um erro 400 se o filme já existir", async () => {
    return request(app)
      .put("/filmes/751ea72c621353703a03c3d363fde99127eff53e")
      .send(filmes[1])
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ erro: "Esse filme já foi cadastrado" });
      });
  });

  it("Deve retornar um erro 400 se o título não for informado", async () => {
    return request(app)
      .put("/filmes/751ea72c621353703a03c3d363fde99127eff53e")
      .send({ sinopse: "Sinopse" })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({
          erro: "O campo 'titulo' é obrigatório",
        });
      });
  });

  it("Deve retornar um erro 400 se a sinopse não for informada", async () => {
    return request(app)
      .put("/filmes/751ea72c621353703a03c3d363fde99127eff53e")
      .send({ titulo: "Título" })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({
          erro: "O campo 'sinopse' é obrigatório",
        });
      });
  });
});

describe("DELETE /filmes/:hash", () => {
  it("Deve remover um filme", async () => {
    return request(app)
      .delete("/filmes/751ea72c621353703a03c3d363fde99127eff53e")
      .expect(200)
      .then((response) => {
        expect(response.body).not.toContainEqual(filmes[0]);
      });
  });

  it("Deve retornar um erro 404 se o filme não existir", async () => {
    return request(app).delete("/filmes/naoexiste").expect(404);
  });
});
