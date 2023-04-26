import express from "express";
import User from "../models/user";
import usersRepository from "../repositories/users-repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import emailSender from "../email";
require("dotenv").config();

const usersRouter = express.Router();

/**
 * @swagger
 * /login:
 *      post:
 *          tags:
 *             - Users
 *          summary: Login to the server
 *          description: Login to the server
 *          requestBody:
 *             required: true
 *             content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    Email:
 *                      type: string
 *                    Password:
 *                      type: string
 *          responses:
 *            200:
 *                  description: Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  token:
 *                                      type: string
 *            400:
 *              description: Error
 * description: Internal Server Error
 */
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

/**
 * @swagger
 * /register:
 *      post:
 *          tags:
 *             - Users 
 *          summary: Register user
 *          description: Register user
 *          requestBody:
 *             required: true
 *             content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    Name:
 *                     type: string
 *                    Email:
 *                     type: string
 *                    Password:
 *                     type: string
 *          responses:
 *            201:
 *                  description: Success
 *            400:
 *              description: Error
 * description: Internal Server Error
 */
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
            emailSender.sendEmail(
              user.email,
              "Inscrição realizada com sucesso",
              "Sua inscrição foi realizada com sucesso"
            );
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
