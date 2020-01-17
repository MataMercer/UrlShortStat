import { Router } from "express";
import usersRoutes from "./users";
import urlsRoutes from "./urls";
const api = Router();

api.use("/user", usersRoutes);
api.use("/url", urlsRoutes);

export default api;