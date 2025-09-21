import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js";
import { credentialController } from "../controllers/credentialController.js";

const credentialRouter = express.Router();

credentialRouter.post("/create", authMiddleware, credentialController.createCredential)
credentialRouter.get("/getAll", authMiddleware, credentialController.getAllCredentials)
credentialRouter.get("/get/:id", authMiddleware, credentialController.getCredentialById)
credentialRouter.put("/update/:id", authMiddleware, credentialController.updateCredential)
credentialRouter.delete("/delete/:id", authMiddleware, credentialController.deleteCredential)

export default credentialRouter;
