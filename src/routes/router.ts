import { Router } from "express";
import { toleranceRouter } from "./tolerance";

export const router = Router();

router.use("/tolerance", toleranceRouter);
