import Registration from "../models/registration";
import database from "./database";

const registrationsRepository = {
  create: (userID: string, eventID: number, callback: (id?: number) => void) => {
    const sql =
      "INSERT INTO registrations (userID, eventID, presence) VALUES (?, ?, ?)";
    const params = [
      userID,
      eventID,
      0,
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
    const sql = "SELECT * FROM registrations, events WHERE userID = ? AND events.id = registrations.eventID";
    const params = [userID];
    database.all(sql, params, (_err, row) => callback(row));
  },

  readUserRegistrationEmail: (
    userEmail: string,
    callback: (registration?: Registration[]) => void
  ) => {
    const sql = "SELECT * FROM registrations, events, users WHERE users.email = ? AND users.id = registrations.userID AND events.id = registrations.eventID";
    const params = [userEmail];
    database.all(sql, params, (_err, row) => callback(row));
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

  checkIn: (eventID : number, userEmail : string, callback: (notFound: boolean) => void) => {
    const sql = "UPDATE registrations SET presence = 1 WHERE eventID = ? AND userID = (SELECT id FROM users WHERE email = ?)";
    const params = [eventID, userEmail];
    database.run(sql, params, function (_err) {
      callback(this.changes === 0);
    }
  )},
};

export default registrationsRepository;
