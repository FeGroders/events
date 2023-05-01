import { createHash } from "crypto";
import Certificate from "../models/certificate";
import database from "./database";
require("crypto");

const certificatesRepository = {
  create: (
    userID: string,
    eventID: number,
    callback: (id?: number) => void
  ) => {
    const sql =
      "INSERT INTO certificates (userID, eventID, md5) VALUES (?, ?, ?)";
    const params = [
      userID,
      eventID,
      createHash("md5")
        .update(userID + "-" + eventID)
        .digest("hex"),
    ];
    database.run(sql, params, function (_err) {
      callback(this?.lastID);
    });
  },

  readAll: (callback: (certificates: Certificate[]) => void) => {
    const sql = "SELECT * FROM certificates";
    const params: any[] = [];
    database.all(sql, params, (_err, rows) => callback(rows));
  },

  read: (id: number, callback: (certificate?: Certificate) => void) => {
    const sql = "SELECT * FROM certificates WHERE id = ?";
    const params = [id];
    database.get(sql, params, (_err, row) => callback(row));
  },

  readUserCertificates: (
    userID: string,
    callback: (certificates: Certificate[]) => void
  ) => {
    const sql =
      "SELECT * FROM certificates WHERE userID = ? ORDER BY eventID DESC";
    const params = [userID];
    database.all(sql, params, (_err, row) => callback(row));
  },

  readByMd5: (md5: string, callback: (certificate?: Certificate) => void) => {
    const sql = "SELECT * FROM certificates WHERE md5 = ?";
    const params = [md5];
    database.get(sql, params, (_err, row) => callback(row));
  },
  
  delete: (id: number, callback: (notFound: boolean) => void) => {
    const sql = "DELETE FROM certificates WHERE id = ?";
    const params = [id];
    database.run(sql, params, function (_err) {
      callback(this.changes === 0);
    });
  },
};

export default certificatesRepository;
