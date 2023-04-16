import express from "express";
import Event from "../models/event";
import eventsRepository from "../repositories/events-repository";

const eventsRouter = express.Router();

eventsRouter.post("/events", (req, res) => {
  const event: Event = req.body;
  eventsRepository.create(event, (id) => {
    if (id) {
      res.status(201).location(`/events/${id}`).send();
    } else {
      res.status(400).send();
    }
  });
});

eventsRouter.get("/events", (req, res) => {
  eventsRepository.readAll((events) => res.json(events));
});

eventsRouter.get("/events/:id", (req, res) => {
  const id: number = +req.params.id;
  eventsRepository.read(id, (event) => {
    if (event) {
      res.json(event);
    } else {
      res.status(404).send();
    }
  });
});

eventsRouter.put("/events/:id", (req, res) => {
  const id: number = +req.params.id;
  eventsRepository.update(id, req.body, (notFound) => {
    if (notFound) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  });
});

eventsRouter.delete("/events/:id", (req, res) => {
  const id: number = +req.params.id;
  eventsRepository.delete(id, (notFound) => {
    if (notFound) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  });
});

// TODO: get available events

export default eventsRouter;
