import { Router } from "express";
import { makeRequest } from "../utils/requestUtil";

import { scaleDownService, scaleUpService } from "../service/scalingService";

export const toleranceRouter = Router();

toleranceRouter.post("/", async (req, res) => {
    await makeRequest(res, async ({ core }, { getBlockNumber }) => {
        const jamBlockNumber = await getBlockNumber();
        const alchemyBlockNumber = await core.getBlockNumber();
        const negate = req.query.negate === "true" ?? false;
        const condition =
            alchemyBlockNumber <= jamBlockNumber &&
            Math.abs(alchemyBlockNumber - jamBlockNumber) < 10;
        (negate ? condition : !condition)
            ? await scaleDownService()
            : await scaleUpService();
        return {
            responseCode: 200,
            data: {
                jamBlockNumber,
                alchemyBlockNumber,
            },
        };
    });
});
