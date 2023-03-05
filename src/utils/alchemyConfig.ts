import { Network, Alchemy } from "alchemy-sdk";
import { SecretUtil } from "@crypto-jambot/secret-manager-utils";

let alchemy: Alchemy;
const secretUtil = new SecretUtil();

export function getClient() {
    return new Promise<Alchemy>(async (resolve, reject) => {
        try {
            if (!alchemy) {
                const settings = {
                    apiKey: await secretUtil.getSecretString(
                        process.env.ALCHEMY_SECRET_KEY as string
                    ),
                    network: Network.ETH_MAINNET,
                };
                alchemy = new Alchemy(settings);
            }
            resolve(alchemy);
        } catch (err) {
            reject(err);
        }
    });
}
