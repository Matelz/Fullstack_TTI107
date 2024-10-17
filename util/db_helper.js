const mongoose = require("mongoose");

class DBHelper {
  async connect() {
    if (this.connection) {
      return this.connection;
    }

    try {
      this.connection = await (
        await mongoose.connect(`${process.env.MONGODB_URL}`)
      ).connection;
      console.log("Connected to MongoDB");

      return this.connection;
    } catch (error) {
      console.error("Error connecting to MongoDB", error);
      return null;
    }
  }

  async addFilme(titulo, sinopse) {
    const filme = new this.Filme({ hash, titulo, sinopse });
    await filme.save();
  }

  constructor() {
    this.connection = null;

    this.Filme = mongoose.model("Filme", {
      hash: String,
      titulo: String,
      sinopse: String,
    });
  }
}

module.exports = DBHelper;
