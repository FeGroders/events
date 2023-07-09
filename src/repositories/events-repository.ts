import Event from "../models/event";
import database from "./database";

const eventsRepository = {
  create: (event: Event, callback: (id?: number) => void) => {
    const sql = "INSERT INTO events (name, description) VALUES (?, ?)";
    const params = [event.name, event.description];
    database.run(sql, params, function (_err) {
      callback(this?.lastID);
    });
  },

  readAll: (callback: (events: Event[]) => void) => {
    const sql = "SELECT * FROM events";
    const params: any[] = [];
    database.all(sql, params, (_err, rows: Event[]) => callback(rows));
  },

  read: (id: number, callback: (event?: Event) => void) => {
    const sql = "SELECT * FROM events WHERE id = ?";
    const params = [id];
    database.get(sql, params, (_err, row: Event) => callback(row));
  },

  update: (id: number, event: Event, callback: (notFound: boolean) => void) => {
    const sql =
      "UPDATE events SET name = ?, description = ?, date = ?, location = ? WHERE id = ?";
    const params = [
      event.name,
      event.description,
      event.date,
      event.location,
      id,
    ];
    database.run(sql, params, function (_err) {
      callback(this.changes === 0);
    });
  },

  delete: (id: number, callback: (notFound: boolean) => void) => {
    const sql = "DELETE FROM events WHERE id = ?";
    const params = [id];
    database.run(sql, params, function (_err) {
      callback(this.changes === 0);
    });
  },
};

export default eventsRepository;
