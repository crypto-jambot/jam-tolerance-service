import { makeAxiosRequest } from "../utils/requestUtil";
import { V1Deployment, V1DeploymentSpec } from "@kubernetes/client-node";
import { getAccessToken } from "../utils/web3Config";

const GETH_WS_LISTENER = "geth-ws-listener";

export function scaleDownService() {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const { replicas: wsListenerReplicas } = await getDeploymentSpec(
                GETH_WS_LISTENER
            );
            if (wsListenerReplicas === 0) {
                resolve();
                return;
            }
            await updateReplicas(wsListenerReplicas!, 0, GETH_WS_LISTENER);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

export function scaleUpService() {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const { replicas: currentReplicas, template: wsListenerTemplate } =
                await getDeploymentSpec(GETH_WS_LISTENER);
            const wsListenerReplicas = parseInt(
                wsListenerTemplate.metadata!.labels!.previousReplicas,
                undefined
            );
            if (currentReplicas! > 0) {
                resolve();
                return;
            }
            await updateReplicas(
                currentReplicas!,
                wsListenerReplicas,
                GETH_WS_LISTENER
            );
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

function getDeploymentSpec(serviceName: string) {
    return new Promise<V1DeploymentSpec>(async (resolve, reject) => {
        try {
            const { spec } = await makeAxiosRequest<V1Deployment>(
                `https://rabbit.dev/kube/deployment/${serviceName}/eth-listener`,
                "GET",
                { authorization: `Bearer ${await getAccessToken()}` }
            );
            if (!spec) {
                reject("Invlaid Spec");
                return;
            }
            resolve(spec);
        } catch (err) {
            reject(err);
        }
    });
}

function updateReplicas(
    previousReplicas: number,
    newReplicas: number,
    serviceName: string
) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const { spec } = await makeAxiosRequest<V1Deployment>(
                `https://rabbit.dev/kube/deployment/${serviceName}/eth-listener`,
                "PUT",
                { authorization: `Bearer ${await getAccessToken()}` },
                {
                    spec: {
                        template: {
                            metadata: {
                                labels: {
                                    previousReplicas:
                                        String(previousReplicas).toString(),
                                },
                            },
                        },
                        replicas: newReplicas,
                    },
                }
            );
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}
