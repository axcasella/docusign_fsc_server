"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config/config");
const utils_1 = require("../utils/utils");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
// @route   GET api/certificate
// @desc    Get a list of certificates from Dynamics
// @access  Public
router.get("/", async (_, res) => {
    try {
        const token = await utils_1.getDynamicsAccessToken();
        if (!token) {
            return res.status(400).json({
                errors: [{ msg: "Failed to get access token from MS Dynamics" }],
            });
        }
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const URL = config_1.dynamicsURL + "/fsc_fsccertificates";
        const response = await axios_1.default.get(URL, config);
        if (response.data.value) {
            return res.json(response.data.value);
        }
        return res.status(404).json({
            errors: [{ msg: "Failed to get certificates" }],
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error.");
    }
});
// @route   POST api/certificate
// @desc    Add a new certificates to Dynamics
// @access  Public
router.post("/", auth_1.default, async (req, res) => {
    try {
        if (req.user && req.user.role !== utils_1.Role.CB) {
            return res.status(401).json({
                errors: [{ msg: "Only CB auditors can add a new certificate" }],
            });
        }
        const token = await utils_1.getDynamicsAccessToken();
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
        const URL = config_1.dynamicsURL + "/fsc_fsccertificates";
        const response = await axios_1.default.post(URL, body, config);
        if (response.data.error) {
            return res.status(404).json({
                errors: [{ msg: response.data.error }],
            });
        }
        return res.status(200).json({ msg: "Add certification success" });
    }
    catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});
exports.default = router;
