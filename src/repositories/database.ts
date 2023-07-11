import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";
const DBSOURCE = "db.sqlite";

const SQL_VERSION_CREATE = `
CREATE TABLE version (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  version INTEGER
);

INSERT INTO version(version) VALUES (1);`;

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
  );`;

const SQL_INSERT_USER = `
  INSERT INTO users(name, email, password, salt, dateCreated) VALUES (?, ?, ?, ?, ?)`;

const SQL_EVENTS_CREATE = `
	CREATE TABLE events (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		description TEXT,
		date TEXT,
		location TEXT
	);`;

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

const SQL_INSERT_VERSION = `
  INSERT INTO version(version) VALUES (?)`;

const SQL_UPDATE_VERSION = `
  UPDATE version SET version = ?`;

  const listExecSQL = [
    SQL_VERSION_CREATE,
    SQL_USERS_CREATE,
    SQL_EVENTS_CREATE,
    SQL_REGISTRATIONS_CREATE,
    SQL_CERTIFICATES_CREATE,
  ];
  
const version1 = {
  version: 1,
  execSQL: []
};

const version2 = {
  version: 2,
  execSQL: [
    `INSERT INTO version(version) VALUES (2)`,
    `INSERT INTO events(name, description, date, location) VALUES ("Evento de teste", "Evento de teste", "2023-08-01", "Local de teste")`,
  ],
};

const version3 = {
  version: 3,
  execSQL: [
    "CREATE TABLE tipo_x (id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT)",
    `INSERT INTO events(name, description, date, location) VALUES ("Evento de teste222", "Evento de teste2222", "2023-08-01", "Local de teste")`,
  ],
};

const VERSION = 2;
const listVersions = [version1, version2, version3];

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

          if (i === listExecSQL.length - 1) {
            var salt = bcrypt.genSaltSync(10);

            database.run(SQL_INSERT_USER, ["teste", "teste@teste.com", bcrypt.hashSync("teste", salt), salt, Date()])
            console.log("Usuário de teste criado com sucesso.")
          
            database.run(SQL_INSERT_EVENT, ["Evento de teste 2", "Evento de teste 2", "2023-08-01", "Local de teste 2"])
            database.run(SQL_INSERT_EVENT, ["Evento de teste 3", "Evento de teste 3", "2023-08-01", "Local de teste 3"])
            console.log("Evento de teste criado com sucesso.")

            database.run(SQL_INSERT_REGISTRATION, [1, 1, 0]);
            console.log("Inscrição de teste criada com sucesso.")

            database.run(SQL_INSERT_CERTIFICATE, [1, 1, require('crypto').createHash('md5').update("1-1").digest("hex")]);
            console.log("Certificado de teste criado com sucesso.")
          }
        }
      });
    }

    var dbVersion = 0;
    database.get("SELECT version FROM version", (err, row: any) => {
      if (err) {
        console.log("Versão da base de dados não encontrada.");
      } else {
        if (row != undefined) {
          dbVersion = row.version;
        } else {
          database.run(SQL_INSERT_VERSION, [1]);
        }

        // CREATE TABLES
        if (dbVersion < VERSION) {
          listVersions.forEach((version) => {
            if (version.version > dbVersion && version.version <= VERSION) {
              version.execSQL.forEach((sql) => {
                database.run(sql);
              });
            }
          })

          // UPDATE VERSION
          database.run(SQL_UPDATE_VERSION, [VERSION]);
          console.log("Versão da base de dados atualizada com sucesso. Versão atual: " + VERSION);
        }
      }
    });    
  }
});

export default database;
