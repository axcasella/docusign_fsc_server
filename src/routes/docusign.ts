import express from "express";
import {
  signAgreementCeremony,
  signFinalCertificateCeremony,
} from "../utils/docusign";

const router = express.Router();

// @route   GET api/docusign/final_certificate
// @desc    Get docusign embedded signing URL for the final certificate
// @access  Private
router.get("/final_certificate", signFinalCertificateCeremony);

// @route   GET api/docusign/agreement
// @desc    Get docusign embedded signing URL for the license agreement
// @access  Private
router.get("/agreement", signAgreementCeremony);

export default router;
