import express from "express";
import Registration from "../models/registration";
import registrationsRepository from "../repositories/registrations-repository";
import auth from "../middlewares/auth";

const registrationsRouter = express.Router();

registrationsRouter.post("/registrations", auth, (req, res) => {
  const registration: Registration = req.body;
  registrationsRepository.create(registration, (id) => {
    if (id) {
      res.status(201).location(`/registrations/${id}`).send();
    } else {
      res.status(400).send();
    }
  });
});

registrationsRouter.get("/registrations", auth, (req, res) => {
  registrationsRepository.readAll((registrations) => res.json(registrations));
});

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

registrationsRouter.put("/registrations/:id", auth, (req, res) => {
  const id: number = +req.params.id;
  registrationsRepository.update(id, req.body, (notFound) => {
    if (notFound) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  });
});

registrationsRouter.delete("/registrations/:id", auth, (req, res) => {
  const id: number = +req.params.id;
  registrationsRepository.delete(id, (notFound) => {
    if (notFound) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  });
});

registrationsRouter.post("/checkIn/:id", auth, (req, res) => {
  const id: number = +req.params.id;
  registrationsRepository.checkIn(id, (notFound) => {
    if (notFound) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  });
});

export default registrationsRouter;
