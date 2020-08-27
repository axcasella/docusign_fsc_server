import express, { Request, Response } from "express";
const router = express.Router();

import invoke from "../../chaincode_ops/invoke";
import query from "../../chaincode_ops/query";

// @route  POST api/blockchain/certificates/
// @desc   Add a new certificate to the Blockchain ledger, sets status to "Applicant"
// @access Private, only be done by FSC auditor
router.post("/", async (req: Request, res: Response) => {
  try {
    const { certificateID, type, company, issuer, issuanceDate } = req.body;
    const args = [certificateID, type, company, issuer, issuanceDate];

    const invokeResult = await invoke("createCertificate", args);
    const response = {
      invokeResult: invokeResult,
      certificateID: certificateID,
    };

    return res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// @route  GET api/blockchain/certificates/:certificateID
// @desc   Get a certificate from the Blockchain ledger
// @access Public
router.get("/:certificateID", async (req: Request, res: Response) => {
  try {
    const args = [req.params.certificateID];
    const queryResult = await query("readCertificate", args);

    return res.json(queryResult);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// @route  POST api/blockchain/certificates/:certificateID/issue
// @desc   Update an existing certificate's status to "issued" in the Blockchain ledger
// @access Private, only be done by FSC auditor
router.post("/:certificateID/issue", async (req: Request, res: Response) => {
  try {
    const certificateID = req.params.certificateID;
    const args = [certificateID];

    const invokeResult = await invoke("issueCertificate", args);
    const response = {
      invokeResult: invokeResult,
      certificateID: certificateID,
    };

    return res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

export default router;
