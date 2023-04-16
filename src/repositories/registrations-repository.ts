import Registration from "../models/registration";
import database from "./database";

const registrationsRepository = {
  create: (registration: Registration, callback: (id?: number) => void) => {
    const sql =
      "INSERT INTO registrations (userID, eventID, presence) VALUES (?, ?)";
    const params = [
      registration.userID,
      registration.eventID,
      registration.presence,
    ];
    database.run(sql, params, function (_err) {
      callback(this?.lastID);
    });
  },

  readAll: (callback: (registrations: Registration[]) => void) => {
    const sql = "SELECT * FROM registrations";
    const params: any[] = [];
    database.all(sql, params, (_err, rows) => callback(rows));
  },

  read: (id: number, callback: (registration?: Registration) => void) => {
    const sql = "SELECT * FROM registrations WHERE id = ?";
    const params = [id];
    database.get(sql, params, (_err, row) => callback(row));
  },

  readUserRegistrations: (
    userID: string,
    callback: (registrations: Registration[]) => void
  ) => {
    const sql = "SELECT * FROM registrations WHERE userID = ?";
    const params = [userID];
    database.get(sql, params, (_err, row) => callback(row));
  },

  update: (
    id: number,
    registration: Registration,
    callback: (notFound: boolean) => void
  ) => {
    const sql =
      "UPDATE registrations SET userID = ?, eventID = ?, presence = ? WHERE id = ?";
    const params = [
      registration.userID,
      registration.eventID,
      registration.presence,
      id,
    ];
    database.run(sql, params, function (_err) {
      callback(this.changes === 0);
    });
  },

  delete: (id: number, callback: (notFound: boolean) => void) => {
    const sql = "DELETE FROM registrations WHERE id = ?";
    const params = [id];
    database.run(sql, params, function (_err) {
      callback(this.changes === 0);
    });
  },

  checkIn: (id: number, callback: (notFound: boolean) => void) => {
    const sql = "UPDATE registrations SET presence = 1 WHERE id = ?";
    const params = [id];
    database.run(sql, params, function (_err) {
      callback(this.changes === 0);
    });
  },
};

export default registrationsRepository;
