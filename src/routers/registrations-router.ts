import express from "express";
import registrationsRepository from "../repositories/registrations-repository";
import auth from "../middlewares/auth";
import emailSender from "../email";
import usersRepository from "../repositories/users-repository";

const registrationsRouter = express.Router();

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
                emailSender.sendEmail(email, 'Inscrição realizada com sucesso', 'Sua inscrição foi realizada com sucesso');
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

registrationsRouter.post("/checkIn", (req, res) => {
  const { userEmail, eventID } = req.body;
  registrationsRepository.checkIn(eventID, userEmail, (notFound) => {
    if (notFound) {
      res.status(404).send('{ "error": "Error" }');
    } else {
      emailSender.sendEmail(userEmail, 'Check-in realizado com sucesso', 'Seu check-in foi realizado com sucesso');
      res.status(201).send('{ "message": "Success" }');
    }
  });
});

export default registrationsRouter;
