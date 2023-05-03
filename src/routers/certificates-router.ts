import express from "express";
import certificatesRepository from "../repositories/certificates-repository";
import auth from "../middlewares/auth";
import emailSender from "../email";
import usersRepository from "../repositories/users-repository";
import registrationsRepository from "../repositories/registrations-repository";

const certificatesRouter = express.Router();

/**
 * @swagger
 * /certificates:
 *      post:
 *          tags:
 *           - Certificates
 *          summary: Generate a certificate
 *          description: Generate a certificate
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
certificatesRouter.post("/certificates", auth, (req, res) => {
  const { userID, eventID } = req.body;

  function sendEmail(email: string, md5: string) {
    emailSender.sendEmail(
      email,
      "Certificado gerado com sucesso",
      "Seu certificado foi gerado com sucesso. Para validar seu certificado utilize o seguinte código: " +
        md5
    );
  }

  registrationsRepository.readUserRegistrations(userID, (registrations) => {
    if (registrations) {
      const registration = registrations.find(
        (registration) =>
          registration.eventID === eventID && registration.presence == true
      );
      if (registration) {
        certificatesRepository.readUserCertificates(userID, (certificates) => {
          if (certificates) {
            const certificate = certificates.find(
              (certificate) => certificate.eventID === eventID
            );
            if (certificate) {
              usersRepository.getUserEmail(userID, (email) => {
                if (email && certificate) {
                  sendEmail(email, certificate.md5);
                }
              });
              res.status(200).send(certificate);
              return;
            } else {
              certificatesRepository.create(userID, eventID, (id) => {
                if (id) {
                  const certificate = certificates.find(
                    (certificate) => certificate.id === id
                  );
                  usersRepository.getUserEmail(userID, (email) => {
                    if (email && certificate) {
                      sendEmail(email, certificate.md5);
                    }
                  });
                  res.status(201).send(certificate);
                } else {
                  res.status(400).send('{ "message": "Error" }');
                }
              });
            }
          }
        });
      } else {
        res.status(400).send('{ "message": "User was not present" }');
      }
    }
  });
});

/**
 * @swagger
 * /certificates/:id:
 *      get:
 *          tags:
 *           - Certificates
 *          summary: Get certificate by id
 *          description: Get certificate by id
 *          requestBody:
 *           required: true
 *           content:
 *             application/json:
 *                schema:
 *                 type: object
 *                 properties:
 *                    MD5:
 *                     type: number
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
 *            404:
 *              description: Error
 * description: Internal Server Error
 */
certificatesRouter.get("/certificates/:id", (req, res) => {
  const id: number = +req.params.id;
  certificatesRepository.read(id, (certificate) => {
    if (certificate) {
      res.json(certificate);
    } else {
      res.status(404).send();
    }
  });
});

/**
 * @swagger
 * /certificates/validate/:md5:
 *      post:
 *          tags:
 *           - Certificates
 *          summary: Validate certificate by MD5
 *          description: Validate certificate by MD5
 *          parameters:
 *           - in: path
 *             name: md5
 *             schema:
 *             type: integer
 *             required: true
 *             description: The certificate MD5
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
 *            404:
 *              description: Error
 * description: Internal Server Error
 */
certificatesRouter.post("/certificates/validate/", (req, res) => {
  const md5: string = req.body.md5;
  console.log(md5);
  certificatesRepository.readByMd5(md5, (certificate) => {
    if (certificate) {
      res.json(certificate);
    } else {
      res.status(404).send();
    }
  });
});

/**
 * @swagger
 * /certificates/user/:id:
 *      get:
 *          tags:
 *           - Certificates
 *          summary: Get certificates by user id
 *          description: Get certificates by user id
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
 *            404:
 *              description: Error
 * description: Internal Server Error
 */
certificatesRouter.get("/certificates/user/:userID", auth, (req, res) => {
  const userID: string = req.params.userID;
  certificatesRepository.readUserCertificates(userID, (certificates) => {
    if (certificates) {
      res.json(certificates);
    } else {
      res.status(404).send();
    }
  });
});

/**
 * @swagger
 * /certificates:
 *      delete:
 *          tags:
 *           - Certificates
 *          summary: Delete a certificate
 *          description: Delete a certificate
 *          parameters:
 *           - in: path
 *             name: id
 *             schema:
 *             type: integer
 *             required: true
 *             description: The certificate id
 *          responses:
 *            201:
 *              description: Success
 *            400:
 *              description: Error
 * description: Internal Server Error
 */
certificatesRouter.delete("/certificates/:id", auth, (req, res) => {
  const id: number = +req.params.id;
  certificatesRepository.delete(id, (notFound) => {
    if (notFound) {
      res.status(400).send();
    } else {
      res.status(201).send();
    }
  });
});

export default certificatesRouter;
