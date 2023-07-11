import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";

const DBSOURCE = "db.sqlite";

const SQL_USERS_CREATE = `
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name text, 
  email text, 
  password text,             
  salt text,    
  token text,
  dateLoggedIn DATE,
  dateCreated DATE
  )`;

const SQL_INSERT_USER = `
  INSERT INTO users(name, email, password, salt, dateCreated) VALUES (?, ?, ?, ?, ?)`;

const SQL_EVENTS_CREATE = `
	CREATE TABLE events (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		description TEXT,
		date TEXT,
		location TEXT
	)`;

const SQL_INSERT_EVENT = `
    INSERT INTO events(name, description, date, location) VALUES (?, ?, ?, ?)`;

const SQL_REGISTRATIONS_CREATE = `
  CREATE TABLE registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userID INTEGER,
    eventID INTEGER,
    presence INTEGER,

    FOREIGN KEY (userID) REFERENCES users (id),
    FOREIGN KEY (eventID) REFERENCES events (id)
  )`;

const SQL_INSERT_REGISTRATION = `
  INSERT INTO registrations(userID, eventID, presence) VALUES (?, ?, ?)`;

const SQL_CERTIFICATES_CREATE = `
  CREATE TABLE certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userID INTEGER,
    eventID INTEGER,
    md5 TEXT UNIQUE,

    FOREIGN KEY (userID) REFERENCES users (id),
    FOREIGN KEY (eventID) REFERENCES events (id)
  )`;

const SQL_INSERT_CERTIFICATE = `
  INSERT INTO certificates(userID, eventID, md5) VALUES (?, ?, ?)`;

const SQL_TESTE = `
  CREATE TABLE teste (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userID INTEGER,
    eventID INTEGER,
    md5 TEXT UNIQUE,
  )`;

const SQL_INSERT_TESTE = `
  INSERT INTO teste(userID, eventID, md5) VALUES (?, ?, ?)`;

const listExecSQL = [
  SQL_USERS_CREATE,
  SQL_EVENTS_CREATE,
  SQL_REGISTRATIONS_CREATE,
  SQL_CERTIFICATES_CREATE,
  SQL_INSERT_TESTE
];

function createDefaultData() {
  var salt = bcrypt.genSaltSync(10);
  database.run(SQL_INSERT_USER, ["teste", "teste@teste.com", bcrypt.hashSync("teste", salt), salt, Date()])
  console.log("Usuário de teste criado com sucesso.")

  database.run(SQL_INSERT_EVENT, ["Evento de teste", "Evento de teste", "2023-08-01", "Local de teste"])
  database.run(SQL_INSERT_EVENT, ["Evento de teste 2", "Evento de teste 2", "2023-08-01", "Local de teste 2"])
  database.run(SQL_INSERT_EVENT, ["Evento de teste 3", "Evento de teste 3", "2023-08-01", "Local de teste 3"])
  console.log("Evento de teste criado com sucesso.")

  database.run(SQL_INSERT_REGISTRATION, [1, 1, 0]);
  console.log("Inscrição de teste criada com sucesso.")

  database.run(SQL_INSERT_CERTIFICATE, [1, 1, require('crypto').createHash('md5').update("1-1").digest("hex")]);
  console.log("Certificado de teste criado com sucesso.")
}

const database = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("Base de dados conectada com sucesso.");

    for (let i = 0; i < listExecSQL.length; i++) {
      database.run(listExecSQL[i], (err) => {
        if (err) {
          // Possivelmente a tabela já foi criada

          if (i === listExecSQL.length - 1) {
            createDefaultData();  
          }
        } else {
          console.log("Tabela criada com sucesso.");

          console.log("teste", listExecSQL.length - 1)
          console.log("testei", i)

          if (i === listExecSQL.length - 1) {
            createDefaultData();  
          }
        }
      });
    }
  }
});

export default database;
