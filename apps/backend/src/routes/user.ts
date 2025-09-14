import express from "express"

const userRouter = express.Router();

userRouter.post("/signIn", userController.signIn);
userRouter.post("/signUp", userController.signUp);
userRouter.post("/verify", userController.verify);


export default userRouter;