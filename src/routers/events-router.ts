import express from "express";
import Event from "../models/event";
import eventsRepository from "../repositories/events-repository";

const eventsRouter = express.Router();

/**
 * @swagger
 * /events:
 *      post:
 *          tags:
 *           - Events
 *          summary: Create event
 *          description: Create event
 *          requestBody:
 *           required: true
 *           content:
 *             application/json:
 *                schema:
 *                 type: object
 *                 properties:
 *                    name:
 *                      type: string
 *                    description:
 *                      type: string
 *                    date:
 *                      type: string
 *                    location:
 *                      type: string
 *          responses:
 *            201:
 *              description: Success
 *            400:
 *              description: Error
 * description: Internal Server Error
 */
eventsRouter.post("/events", (req, res) => {
  const event: Event = req.body;
  eventsRepository.create(event, (id) => {
    if (id) {
      res.status(201).send();
    } else {
      res.status(400).send();
    }
  });
});

/**
 * @swagger
 * /events:
 *      get:
 *          tags:
 *           - Events
 *          summary: Get all events
 *          description: Get all events
 *          responses:
 *            201:
 *                  description: Success
 *                  content:
 *                     application/json:
 *                        schema:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                              type: integer
 *                             name:
 *                              type: string
 *                             description:
 *                              type: string
 *                             date:
 *                              type: string
 *                             location:
 *                              type: string
 *            400:
 *              description: Error
 * description: Internal Server Error
 */
eventsRouter.get("/events", (req, res) => {
  eventsRepository.readAll((events) => res.json(events));
});

/**
 * @swagger
 * /events/:id:
 *      get:
 *          tags:
 *           - Events
 *          summary: Get event by id
 *          description: Get event by id
 *          parameters:
 *           - in: path
 *             name: id
 *             schema:
 *             type: integer
 *             required: true
 *             description: Numeric ID of the event to get
 *          responses:
 *            201:
 *                  description: Success
 *                  content:
 *                     application/json:
 *                        schema:
 *                           type: object
 *                           properties:
 *                             id:
 *                              type: integer
 *                             name:
 *                              type: string
 *                             description:
 *                              type: string
 *                             date:
 *                              type: string
 *                             location:
 *                              type: string
 *            400:
 *              description: Error
 * description: Internal Server Error
 */
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

/**
 * @swagger
 * /events/:id:
 *      put:
 *          tags:
 *           - Events
 *          summary: Update event
 *          description: Update event
 *          parameters:
 *           - in: path
 *             name: id
 *             schema:
 *             type: integer
 *             required: true
 *             description: Numeric ID of the event to update
 *          requestBody:
 *           required: true
 *           content:
 *             application/json:
 *                schema:
 *                 type: object
 *                 properties:
 *                    name:
 *                      type: string
 *                    description:
 *                      type: string
 *                    date:
 *                      type: string
 *                    location:
 *                      type: string
 *          responses:
 *            201:
 *              description: Success
 *            400:
 *              description: Error
 * description: Internal Server Error
 */
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

/**
 * @swagger
 * /events/:id:
 *      delete:
 *          tags:
 *           - Events
 *          summary: Delete event
 *          description: Delete event
 *          parameters:
 *           - in: path
 *             name: id
 *             schema:
 *             type: integer
 *             required: true
 *             description: Numeric ID of the event to delete
 *          responses:
 *            201:
 *                  description: Success
 *            400:
 *              description: Error
 * description: Internal Server Error
 */
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

export default eventsRouter;
