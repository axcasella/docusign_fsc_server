import { FileSystemWallet, Gateway } from "fabric-network";

import getLogger from "./utils/logger";
const logger = getLogger("enrollAdmin");

import {
  getAdminID,
  getWalletPath,
  getDiscovery,
  getConnectionProfile,
  getChannelName,
  getChaincodeName,
} from "./utils/bc_connection_profile_helper";

const query = async (functionName: string, args: string[]) => {
  let gateway = new Gateway();
  try {
    const wallet = new FileSystemWallet(getWalletPath());

    const connectionOptions = {
      identity: getAdminID(),
      wallet,
      discovery: getDiscovery(),
    };

    await gateway.connect(getConnectionProfile(), connectionOptions);

    const channel = getChannelName();
    const network = await gateway.getNetwork(channel);

    const chaincodeID = getChaincodeName();
    const contract = network.getContract(chaincodeID);

    const queryResponse = await contract.evaluateTransaction(
      functionName,
      ...args
    );

    const result =
      queryResponse && queryResponse.length
        ? JSON.parse(queryResponse.toString())
        : {};

    return result;
  } catch (error) {
    logger.error(`query.js() : Error processing transaction. ${error}`);
    throw error;
  } finally {
    gateway.disconnect();
  }
};

export default query;
