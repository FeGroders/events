import express from "express";
import registrationsRepository from "../repositories/registrations-repository";
import auth from "../middlewares/auth";
import emailSender from "../email";
import usersRepository from "../repositories/users-repository";

const registrationsRouter = express.Router();

/**
 * @swagger
 * /registrations:
 *      post:
 *          tags:
 *           - Registrations
 *          summary: Make a registration
 *          description: Make a registration
 *          requestBody:
 *           required: true
 *           content:
 *             application/json:
 *                schema:
 *                 type: object
 *                 properties:
 *                    userID:
 *                     type: number
 *                    eventID:
 *                     type: number
 *          responses:
 *            201:
 *              description: Success
 *            400:
 *              description: Error
 * description: Internal Server Error
 */
registrationsRouter.post("/registrations", auth, (req, res) => {
  const { userID, eventID } = req.body;

  registrationsRepository.readUserRegistrations(userID, (registrations) => {
    if (registrations) {
      const registration = registrations.find(
        (registration) => registration.eventID === eventID
      );
      if (registration) {
        res.status(400).send('{ "message": "User already registered" }');
        return;
      } else {
        registrationsRepository.create(userID, eventID, (id) => {
          if (id) {
            usersRepository.getUserEmail(userID, (email) => {
              if (email) {
                emailSender.sendEmail(
                  email,
                  "Inscrição realizada com sucesso",
                  "Sua inscrição foi realizada com sucesso"
                );
              }
            });
            res.status(201).send('{ "message": "Success" }');
          } else {
            res.status(400).send('{ "message": "Error" }');
          }
        });
      }
    }
  });
});

/**
 * @swagger
 * /registrations:
 *      get:
 *          tags:
 *           - Registrations
 *          summary: Get all registrations
 *          description: Get all registrations
 *          responses:
 *            201:
 *              description: Success
 *              content:
 *                application/json:
 *                 schema:
 *                  type: array
 *                  items:
 *                   type: object
 *                   properties:
 *                    id:
 *                      type: number
 *                    userID:
 *                      type: number
 *                    eventID:
 *                      type: number
 *            400:
 *              description: Error
 * description: Internal Server Error
 */
registrationsRouter.get("/registrations", auth, (req, res) => {
  registrationsRepository.readAll((registrations) => res.json(registrations));
});

/**
 * @swagger
 * /registrations/:id:
 *      get:
 *          tags:
 *           - Registrations
 *          summary: Get registration by id
 *          description: Get registration by id 
 *          parameters:
 *           - in: path
 *             name: id
 *             schema:
 *             type: integer
 *             required: true
 *             description: The registration id
 *          responses:
 *            201:
 *              description: Success
 *              content:
 *                application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                    id:
 *                      type: number
 *                    userID:
 *                      type: number
 *                    eventID:
 *                      type: number
 *            400:
 *              description: Error
 * description: Internal Server Error
 */
registrationsRouter.get("/registrations/:id", (req, res) => {
  const id: number = +req.params.id;
  registrationsRepository.read(id, (registration) => {
    if (registration) {
      res.json(registration);
    } else {
      res.status(404).send();
    }
  });
});

/**
 * @swagger
 * /registrations/user/:id:
 *      get:
 *          tags:
 *           - Registrations
 *          summary: Get registrations by user id
 *          description: Get registrations by user id
 *          parameters:
 *           - in: path
 *             name: userID
 *             schema:
 *             type: integer
 *             required: true
 *             description: The user id
 *          responses:
 *            201:
 *              description: Success
 *              content:
 *               application/json:
 *                 schema:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: number
 *                      userID:
 *                        type: number
 *                      eventID:
 *                        type: number
 *            400:
 *              description: Error
 * description: Internal Server Error
 */
registrationsRouter.get("/registrations/user/:userID", auth, (req, res) => {
  const userID: string = req.params.userID;
  registrationsRepository.readUserRegistrations(userID, (registrations) => {
    if (registrations) {
      res.json(registrations);
    } else {
      res.status(404).send();
    }
  });
});

/**
 * @swagger
 * /registrations:
 *      put:
 *          tags:
 *           - Registrations
 *          summary: Update a registration
 *          description: Update a registration
 *          parameters:
 *           - in: path
 *             name: id
 *             schema:
 *             type: integer
 *             required: true
 *             description: The registration id
 *          requestBody:
 *           required: true
 *           content:
 *             application/json:
 *                schema:
 *                 type: object
 *                 properties:
 *                    userID:
 *                     type: number
 *                    eventID:
 *                     type: number
 *          responses:
 *            201:
 *              description: Success
 *            400:
 *              description: Error
 * description: Internal Server Error
 */
registrationsRouter.put("/registrations/:id", auth, (req, res) => {
  const id: number = +req.params.id;
  registrationsRepository.update(id, req.body, (notFound) => {
    if (notFound) {
      res.status(400).send();
    } else {
      res.status(201).send();
    }
  });
});

/**
 * @swagger
 * /registrations:
 *      delete:
 *          tags:
 *           - Registrations
 *          summary: Delete a registration 
 *          description: Delete a registration
 *          parameters:
 *           - in: path
 *             name: id
 *             schema:
 *             type: integer
 *             required: true
 *             description: The registration id
 *          responses:
 *            201:
 *              description: Success
 *            400:
 *              description: Error
 * description: Internal Server Error
 */
registrationsRouter.delete("/registrations/:id", auth, (req, res) => {
  const id: number = +req.params.id;
  registrationsRepository.delete(id, (notFound) => {
    if (notFound) {
      res.status(400).send();
    } else {
      res.status(201).send();
    }
  });
});

/**
 * @swagger
 * /checkIn:
 *      post:
 *          tags:
 *           - Registrations
 *          summary: Check-in a user
 *          description: Check-in a user
 *          requestBody:
 *           required: true
 *           content:
 *             application/json:
 *                schema:
 *                 type: object
 *                 properties:
 *                    userEmail:
 *                      type: string
 *                    eventID:
 *                      type: number
 *          responses:
 *            201:
 *              description: Success
 *            400:
 *              description: Error
 * description: Internal Server Error
 */
registrationsRouter.post("/checkIn", (req, res) => {
  const { userEmail, eventID } = req.body;
  registrationsRepository.checkIn(eventID, userEmail, (notFound) => {
    if (notFound) {
      res.status(400).send('{ "error": "Error" }');
    } else {
      emailSender.sendEmail(
        userEmail,
        "Check-in realizado com sucesso",
        "Seu check-in foi realizado com sucesso"
      );
      res.status(201).send('{ "message": "Success" }');
    }
  });
});

export default registrationsRouter;
