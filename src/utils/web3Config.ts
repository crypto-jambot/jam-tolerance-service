import { Web3Utils, Eth } from "@crypto-jambot/web3-utils";
import { SecretUtil } from "@crypto-jambot/secret-manager-utils";

const secretUtils = new SecretUtil();
let web3Utils: Web3Utils;

export function getEthereum() {
    return new Promise<Eth>(async (resolve, reject) => {
        try {
            if (!web3Utils) {
                await initializeWeb3();
            }
            resolve(web3Utils.getEthereum());
        } catch (err) {
            reject(err);
        }
    });
}

export function getAccessToken() {
    return new Promise<string>(async (resolve, reject) => {
        try {
            if (!web3Utils) {
                await initializeWeb3();
            }
            resolve(web3Utils.getAccessToken());
        } catch (err) {
            reject(err);
        }
    });
}

function initializeWeb3() {
    return new Promise<void>(async (resolve, reject) => {
        try {
            web3Utils = new Web3Utils(
                await secretUtils.getSecretString(
                    process.env.API_SECRET_KEY as string
                )
            );
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}
