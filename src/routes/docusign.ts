import express from "express";
import {
  getAccessToken,
  signAgreementCeremony,
  signFinalCertificateCeremony,
} from "../utils/docusign";

const router = express.Router();

// @route   GET api/docusign/get_access_token
// @desc    Get access OAuth token used by other APIs
// @access  Private
router.get("/token", getAccessToken);

// @route   GET api/docusign/final_certificate
// @desc    Get docusign embedded signing URL for the final certificate
// @access  Private
router.get("/final_certificate", signFinalCertificateCeremony);

// @route   GET api/docusign/agreement
// @desc    Get docusign embedded signing URL for the license agreement
// @access  Private
router.get("/agreement", signAgreementCeremony);

export default router;
