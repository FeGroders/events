import express from "express";

const emailRouter = express.Router();

emailRouter.post("/sendEmail/:id", (req, res) => {
  const id: number = +req.params.id;
  // res.status(201).location(`/sendEmail/${id}`).send()

  // TODO: Send email
});

export default emailRouter;
