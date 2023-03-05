import { Response } from "express";
import { Alchemy } from "alchemy-sdk";
import { getClient } from "./alchemyConfig";
import { Eth } from "@crypto-jambot/web3-utils";
import { getEthereum } from "./web3Config";
import axios, { AxiosRequestConfig, Method } from "axios";
import { IncomingHttpHeaders } from "http";

type RequestResponse = {
    responseCode: number;
    data: any;
};
export async function makeRequest(
    res: Response,
    callback: (alchemy: Alchemy, eth: Eth) => Promise<RequestResponse>
) {
    try {
        const { responseCode, data } = await callback(
            await getClient(),
            await getEthereum()
        );
        res.status(responseCode).json({ message: data });
    } catch (err: any) {
        const { name, message } = err;
        res.status(400).json({ errorType: name, message });
    }
}

export function makeAxiosRequest<T>(
    url: string,
    method: Method | string,
    headers?: IncomingHttpHeaders,
    body?: any
): Promise<T> {
    const defaultHeaders = {
        "Content-Type": "application/json",
    };
    const config: AxiosRequestConfig = {
        url,
        method,
        headers: { ...defaultHeaders, ...headers },
        data: JSON.stringify(body),
    };
    return new Promise<T>(async (resolve, reject) => {
        try {
            const { data } = await axios.request<T>(config);
            resolve(data);
        } catch (err: any) {
            const { data } = err.response;
            reject({
                message: data ?? err,
                statusCode: data.code || 400,
            });
        }
    });
}
