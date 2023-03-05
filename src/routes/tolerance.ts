import { Router } from "express";
import { makeRequest } from "../utils/requestUtil";

import { scaleDownService, scaleUpService } from "../service/scalingService";

export const toleranceRouter = Router();

toleranceRouter.post("/", async (req, res) => {
    await makeRequest(res, async ({ core }, { getBlockNumber }) => {
        const jamBlockNumber = await getBlockNumber();
        const alchemyBlockNumber = await core.getBlockNumber();
        const condition =
            alchemyBlockNumber <= jamBlockNumber &&
            Math.abs(alchemyBlockNumber - jamBlockNumber) < 10;
        !condition ? await scaleDownService() : await scaleUpService();
        return {
            responseCode: 200,
            data: {
                jamBlockNumber,
                alchemyBlockNumber,
            },
        };
    });
});
