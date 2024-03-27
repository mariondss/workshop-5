import bodyParser from "body-parser";
import express from "express";
import { BASE_NODE_PORT } from "../config";
import { Value , NodeState } from "../types";
import axios from 'axios';
import * as console from "console";
import {delay} from "../utils";

export async function node(
  nodeId: number, // the ID of the node
  N: number, // total number of nodes in the network
  F: number, // number of faulty nodes in the network
  initialValue: Value = 0, // initial value of the node
  isFaulty: boolean, // true if the node is faulty, false otherwise
  nodesAreReady: () => boolean, // used to know if all nodes are ready to receive requests
  setNodeIsReady: (index: number) => void // this should be called when the node is started and ready to receive requests
) {
  const node = express();
  node.use(express.json());
  node.use(bodyParser.json());



  // TODO implement this
  // this route allows retrieving the current status of the node
  // node.get("/status", (req, res) => {});
  node.get("/status", (req, res) => {
    if (isFaulty) {
      res.status(500).send("faulty");
    } else {
      res.status(200).send("live");
    }
  });

  // TODO implement this
  // this route allows the node to receive messages from other nodes
  // node.post("/message", (req, res) => {});
  let nodeState = {
    killed: false,
    x: null as number | null, // Déclarer le type comme number | null
    decided: null as boolean | null, // Vous pouvez également le faire pour les autres propriétés
    k: null as number | null
  };

  let messagesR = new Map();
  let messagesP = new Map();

  // TODO implement this
  // this route is used to start the consensus algorithm
  // node.get("/start", async (req, res) => {});
  node.get("/start", async (req, res) => {

    while (!nodesAreReady()) {
      await delay(5);
    }
  });

  // TODO implement this
  // this route is used to stop the consensus algorithm
  // node.get("/stop", async (req, res) => {});
  node.get("/stop", (req, res) => {
    nodeState.killed = true;
    res.status(200).send("killed");
  });

  // TODO implement this
  // get the current state of a node
  // node.get("/getState", (req, res) => {});
  node.get("/getState", (req, res) => {
    res.status(200).send({ x: nodeState.x, k: nodeState.k, killed: nodeState.killed, decided: nodeState.decided });
  });

  // start the server
  const server = node.listen(BASE_NODE_PORT + nodeId, async () => {
    console.log(
      `Node ${nodeId} is listening on port ${BASE_NODE_PORT + nodeId}`
    );
    setNodeIsReady(nodeId);
  });

  return server;
}
