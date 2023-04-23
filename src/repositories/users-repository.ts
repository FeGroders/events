import User from "../models/user";
import database from "./database";

const usersRepository = {
  register: (user: User, callback: (id?: number) => void) => {
    const sql = "INSERT INTO users (name, email, password, salt, dateCreated) VALUES (?, ?, ?, ?, ?)";
    const params = [user.name, user.email, user.password, user.salt, user.dateCreated];
    database.run(sql, params, function (err) {
      if (err) {
        console.log(err.message);
        callback();
      } else {
        callback(this.lastID);
      }
    });
  },

  readUser: (email: string, callback: (user?: User) => void) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    database.get(sql, [email], (err, row) => {
      if (err) {
        console.log(err.message);
        callback();
      } else {
        callback(row);
      }
    });
  },

  readAll: (callback: (users: User[]) => void) => {
    const sql = "SELECT * FROM users";
    database.all(sql, [], (err, rows) => {
      if (err) {
        console.log(err.message);
        callback([]);
      } else {
        callback(rows);
      }
    });
  },

  getUserEmail: (id: number, callback: (email?: string) => void) => {
    const sql = "SELECT email FROM users WHERE id = ?";
    database.get(sql, [id], (err, row) => {
      if (err) {
        console.log(err.message);
        callback();
      } else {
        callback(row.email);
      }
    });
  }
};

export default usersRepository;
