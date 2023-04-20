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

const SQL_REGISTRATIONS_CREATE = `
  CREATE TABLE registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    event_id INTEGER,
    presence INTEGER,

    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (event_id) REFERENCES events (id)
  )`;

const listExecSQL = [
  SQL_USERS_CREATE,
  SQL_EVENTS_CREATE,
  SQL_REGISTRATIONS_CREATE,
];

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
        } else {
          console.log("Tabela criada com sucesso.");

          if (i === 0) {
            var salt = bcrypt.genSaltSync(10);
            database.run(SQL_INSERT_USER, ["teste", "teste@teste.com", bcrypt.hashSync("teste", salt), salt, Date()])
          }
        }
      });
    }
  }
});

export default database;
