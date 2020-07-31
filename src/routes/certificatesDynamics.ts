import express, { Response } from "express";
import axios from "axios";
import { dynamicsURL } from "../config/config";
import { CustomRequest } from "../types/interface";
import { getDynamicsAccessToken, Role } from "../utils/utils";
import auth from "../middleware/auth";

const router = express.Router();

// @route   GET api/certificate
// @desc    Get a list of certificates from Dynamics
// @access  Public
router.get("/", async (_, res: Response) => {
  try {
    const token = await getDynamicsAccessToken();
    if (!token) {
      return res.status(400).json({
        errors: [{ msg: "Failed to get access token from MS Dynamics" }],
      });
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const URL = dynamicsURL + "/fsc_fsccertificates";
    const response = await axios.get(URL, config);

    if (response.data.value) {
      return res.json(response.data.value);
    }

    return res.status(404).json({
      errors: [{ msg: "Failed to get certificates" }],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error.");
  }
});

// @route   POST api/certificate
// @desc    Add a new certificates to Dynamics
// @access  Public
router.post("/", auth, async (req: CustomRequest, res: Response) => {
  try {
    if (req.user && req.user.role !== Role.CB) {
      return res.status(401).json({
        errors: [{ msg: "Only CB auditors can add a new certificate" }],
      });
    }

    const token = await getDynamicsAccessToken();
    if (!token) {
      return res.status(400).json({
        errors: [{ msg: "Failed to get access token from MS Dynamics" }],
      });
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const body = {
      fsc_cwsourcecountries: "30,83",
      fsc_numberofsitesgroupmembers: req.body.number_of_group_members,
      fsc_certificatetype: 2,
      "fsc_CHOrganization@odata.bind": `/accounts(${req.body.ch_account_id})`,
      fsc_certificatenumber: req.body.cert_number,
      "fsc_CBOrganizationId@odata.bind": `/accounts(${req.body.cb_account_id})`,
      fsc_name: req.body.cert_name,
      fsc_controlledwoodcode: "W123",
    };

    const URL = dynamicsURL + "/fsc_fsccertificates";
    const response = await axios.post(URL, body, config);

    if (response.data.error) {
      return res.status(404).json({
        errors: [{ msg: "Failed to get certificates" }],
      });
    }

    return res.status(200).json({ msg: "Add certification success" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error.");
  }
});

export default router;
