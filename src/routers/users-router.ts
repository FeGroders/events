import express from "express";
import User from "../models/user";
import usersRepository from "../repositories/users-repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
require("dotenv").config();

const usersRouter = express.Router();

usersRouter.post("/login", async (req, res) => {
  try {
    var TOKEN_KEY = process.env.TOKEN_KEY ? process.env.TOKEN_KEY : "";

    const { Email, Password } = req.body;
    if (!(Email && Password)) {
      res.status(400).send("All input is required");
    }

    usersRepository.readUser(Email, (user) => {
      if (!user) {
        return res.status(400).send("No Match");
      }

      var PHash = bcrypt.hashSync(Password, user.salt);

      if (PHash === user.password) {
        const token = jwt.sign(
          { user_id: user.id, name: user.name, Email },
          TOKEN_KEY,
          {
            expiresIn: "1h",
          }
        );

        user.token = token;
      } else {
        return res.status(400).send("No Match");
      }

      return res.status(200).send(user);
    });
  } catch (err) {
    console.log(err);
  }
});

usersRouter.post("/register", async (req, res) => {
  var errors = [];
  try {
    const { Name, Email, Password } = req.body;

    if (!Name) {
      errors.push("Username is missing");
    }
    if (!Email) {
      errors.push("Email is missing");
    }
    if (errors.length) {
      res.status(400).json({ error: errors.join(",") });
      return;
    }

    usersRepository.readUser(Email, (result) => {
      if (!result) {
        var salt = bcrypt.genSaltSync(10);

        var user: User = {
          name: Name,
          email: Email,
          password: bcrypt.hashSync(Password, salt),
          salt: salt,
          dateCreated: new Date(),
        };

        usersRepository.register(user, (id) => {
          if (id) {
            res.status(201).json("Success");
          } else {
            res.status(400).json({ error: "Error registering user" });
          }
        });
      } else {
        res.status(201).json("Record already exists. Please login");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

export default usersRouter;
