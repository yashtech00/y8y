import express from "express"
import { verify } from "jsonwebtoken";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { credentialController } from "../controllers/credentialController.js";

const credentialRouter = express.Router();

credentialRouter.post("/create", authMiddleware, credentialController.createCredential)
credentialController.get("/getAll", authMiddleware, credentialController.getAllCredentials)
credentialController.get("/get/:id", authMiddleware, credentialController.getCredentialById)
credentialController.put("/update/:id", authMiddleware, credentialController.updateCredential)
credentialController.delete("/delete/:id", authMiddleware, credentialController.deleteCredential)

export default credentialRouter;
