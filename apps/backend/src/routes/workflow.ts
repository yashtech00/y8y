import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { workflowController } from "../controllers/workflowController.js";

const workflowRouter = express.Router();

workflowRouter.post("/create", authMiddleware, workflowController.createWorkflow)
workflowRouter.post("/manual/:id", authMiddleware, workflowController.runManualWorkflow)
workflowRouter.get("/getAll", authMiddleware, workflowController.getAllWorkflows)
workflowRouter.get("/get/:id", authMiddleware, workflowController.getWorkflowById)
workflowRouter.put("/update/:id", authMiddleware, workflowController.updateWorkflow)

export default workflowRouter;
