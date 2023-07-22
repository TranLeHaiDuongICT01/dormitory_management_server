const mongoose = require("mongoose");
const config = require("../configs/config");

class Database {
  constructor() {
    this.connect();
  }
  connect() {
    mongoose
      .connect(config.mongoose.url, {
        maxPoolSize: 50,
      })
      .then((_) => console.log("Connected Mongodb"))
      .catch((err) => console.log("Err connect"));
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
