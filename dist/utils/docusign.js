"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAgreementCeremony = exports.signFinalCertificateCeremony = void 0;
// @ts-ignore types declaration
const docusign_esign_1 = __importDefault(require("docusign-esign"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
const apiAccountID = "52c2365a-a084-4659-b804-f572d3182bce";
const fileName1 = "FSC_Certificate_Template_Hack.pdf";
const fileName2 = "FSC_TrademarlLicenseAgreement_Hackathon_20200.pdf";
const baseURL = "https://demo.docusign.net/restapi";
const BASE64_COMBINATION_OF_INTEGRATOR_AND_SECRET_KEYS = "M2E5MzgxMzMtZjc0OS00YzE3LThjYzktYzIyNjg2MTdiNjQ5OjRiYjQ4MmIxLWU1ZWMtNDlmZi05YzVjLWI3NmVlYjAyMWJkYg==";
const tokenURL = "https://account-d.docusign.com/oauth/token";
const clientUserId = "signer123";
const getAccessToken = async (code) => {
    return "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjY4MTg1ZmYxLTRlNTEtNGNlOS1hZjFjLTY4OTgxMjIwMzMxNyJ9.eyJUb2tlblR5cGUiOjUsIklzc3VlSW5zdGFudCI6MTU5NzQ0OTg2MywiZXhwIjoxNTk3NDc4NjYzLCJVc2VySWQiOiIwZjNhMjczOS1hZWRlLTQwZjItOGQ1Yy05NjVmZDZiNDY5MTEiLCJzaXRlaWQiOjEsInNjcCI6WyJzaWduYXR1cmUiLCJjbGljay5tYW5hZ2UiLCJvcmdhbml6YXRpb25fcmVhZCIsInJvb21fZm9ybXMiLCJncm91cF9yZWFkIiwicGVybWlzc2lvbl9yZWFkIiwidXNlcl9yZWFkIiwidXNlcl93cml0ZSIsImFjY291bnRfcmVhZCIsImRvbWFpbl9yZWFkIiwiaWRlbnRpdHlfcHJvdmlkZXJfcmVhZCIsImR0ci5yb29tcy5yZWFkIiwiZHRyLnJvb21zLndyaXRlIiwiZHRyLmRvY3VtZW50cy5yZWFkIiwiZHRyLmRvY3VtZW50cy53cml0ZSIsImR0ci5wcm9maWxlLnJlYWQiLCJkdHIucHJvZmlsZS53cml0ZSIsImR0ci5jb21wYW55LnJlYWQiLCJkdHIuY29tcGFueS53cml0ZSJdLCJhdWQiOiJmMGYyN2YwZS04NTdkLTRhNzEtYTRkYS0zMmNlY2FlM2E5NzgiLCJhenAiOiJmMGYyN2YwZS04NTdkLTRhNzEtYTRkYS0zMmNlY2FlM2E5NzgiLCJpc3MiOiJodHRwczovL2FjY291bnQtZC5kb2N1c2lnbi5jb20vIiwic3ViIjoiMGYzYTI3MzktYWVkZS00MGYyLThkNWMtOTY1ZmQ2YjQ2OTExIiwiYW1yIjpbImludGVyYWN0aXZlIl0sImF1dGhfdGltZSI6MTU5NzQ0OTg2MSwicHdpZCI6Ijc0ZGYwYjgyLWNhMWEtNDVhNi04YjlhLWI0MThhYzdhMWYxYSJ9.EHYomq02dJghx5HsoswrYKTy6S8OY2t_9HiGE1QL289y7aJWu_fGQN2Py6niy_dP8jl7MM0MxYVvxIUrfC6RjV77UG0_TI1XEJdMk4r_HEKfZOW8tE5W-wpkmUS6OOsRJDkXpJQ8pRRFpd30XWNVh_NwUoYYPUIyUl9-iq-4BIxw0GFFYGa400Suk3qNA0QXycBBvLDWH7HrbaHV26DpiUKPFP6Sn_n2eYL8l6Xj1trblOj10vsAACAG1oUzrWohyzGaS24vrv9RiG2vQqGh4Mw6eA0CiNeUSv9fc4CkSsUABB9Tu3A3q01y92phgvnSpvcaGSzOHnT25iXd6ChMKg";
    try {
        const body = {
            grant_type: "authorization_code",
            code: code,
        };
        const config = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " + BASE64_COMBINATION_OF_INTEGRATOR_AND_SECRET_KEYS,
            },
        };
        const response = (await axios_1.default.post(tokenURL, querystring_1.default.stringify(body), config));
        if (response.data.access_token) {
            return response.data.access_token;
        }
        return;
    }
    catch (err) {
        console.error(err.message);
        return err.message;
    }
};
exports.signFinalCertificateCeremony = async (req, res) => {
    const { code, signerEmail, signerName } = req.body;
    if (!code) {
        return res.status(404).json({
            errors: [{ msg: "Missing code" }],
        });
    }
    if (!signerEmail) {
        return res.status(404).json({
            errors: [{ msg: "Missing signer email" }],
        });
    }
    if (!signerName) {
        return res.status(404).json({
            errors: [{ msg: "Missing signer name" }],
        });
    }
    const accessToken = await getAccessToken(code);
    if (!accessToken) {
        return res.status(404).json({
            errors: [{ msg: "Failed to get access token" }],
        });
    }
    try {
        const url = await getEmbeddedCeremony(accessToken, signerEmail, signerName, fileName1);
        return res.json({ url: url });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Failed to get docusign embeded signing ceremony");
    }
};
exports.signAgreementCeremony = async (req, res) => {
    const { code, signerEmail, signerName } = req.body;
    if (!code) {
        return res.status(404).json({
            errors: [{ msg: "Missing code" }],
        });
    }
    if (!signerEmail) {
        return res.status(404).json({
            errors: [{ msg: "Missing signer email" }],
        });
    }
    if (!signerName) {
        return res.status(404).json({
            errors: [{ msg: "Missing signer name" }],
        });
    }
    const accessToken = await getAccessToken(code);
    if (!accessToken) {
        return res.status(404).json({
            errors: [{ msg: "Failed to get access token" }],
        });
    }
    try {
        const url = await getEmbeddedCeremony(accessToken, signerEmail, signerName, fileName2);
        return res.json({ url: url });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Failed to get docusign embeded signing ceremony");
    }
};
const getEmbeddedCeremony = async (accessToken, signerEmail, signerName, filename) => {
    const authenticationMethod = "None";
    const envDef = new docusign_esign_1.default.EnvelopeDefinition();
    envDef.emailSubject =
        "Please sign this document sent for the Docusign Hackathon.";
    envDef.emailBlurb =
        "Please sign this document sent for the Docusign Hackathon.";
    const filePath = path_1.default.resolve(__dirname, "../files/" + filename);
    const pdfBytes = fs_1.default.readFileSync(filePath);
    const pdfBase64 = pdfBytes.toString("base64");
    // Create the document request object
    const doc = docusign_esign_1.default.Document.constructFromObject({
        documentBase64: pdfBase64,
        fileExtension: "pdf",
        name: fileName1,
        documentId: "1",
    });
    // Create a documents object array for the envelope definition and add the doc object
    envDef.documents = [doc];
    // Create the signer object with the previously provided name / email address
    const signer = docusign_esign_1.default.Signer.constructFromObject({
        name: signerName,
        email: signerEmail,
        routingOrder: "1",
        recipientId: "1",
        clientUserId: clientUserId,
    });
    // Create the signHere tab to be placed on the envelope
    let signHere;
    if (filename === fileName1) {
        signHere = docusign_esign_1.default.SignHere.constructFromObject({
            documentId: "1",
            pageNumber: "1",
            recipientId: clientUserId,
            tabLabel: "SignHereTab",
            xPosition: "195",
            yPosition: "487",
        });
    }
    else {
        signHere = docusign_esign_1.default.SignHere.constructFromObject({
            documentId: "1",
            pageNumber: "4",
            recipientId: clientUserId,
            tabLabel: "SignHereTab",
            xPosition: "295",
            yPosition: "327",
        });
    }
    // Create the overall tabs object for the signer and add the signHere tabs array
    signer.tabs = docusign_esign_1.default.Tabs.constructFromObject({ signHereTabs: [signHere] });
    // Add the recipients object to the envelope definition.
    envDef.recipients = docusign_esign_1.default.Recipients.constructFromObject({
        signers: [signer],
    });
    // Set the Envelope status
    envDef.status = "sent";
    const apiClient = new docusign_esign_1.default.ApiClient();
    apiClient.setBasePath(baseURL);
    apiClient.addDefaultHeader("Authorization", "Bearer " + accessToken);
    // Set the DocuSign SDK components to use the apiClient object
    docusign_esign_1.default.Configuration.default.setDefaultApiClient(apiClient);
    let envelopesApi = new docusign_esign_1.default.EnvelopesApi();
    let results;
    try {
        results = await envelopesApi.createEnvelope(apiAccountID, {
            envelopeDefinition: envDef,
        });
        const envelopeId = results.envelopeId;
        let recipientViewRequest = docusign_esign_1.default.RecipientViewRequest.constructFromObject({
            authenticationMethod: authenticationMethod,
            clientUserId: clientUserId,
            recipientId: "1",
            returnUrl: baseURL + "/dsreturn",
            userName: signerName,
            email: signerEmail,
        });
        results = await envelopesApi.createRecipientView(apiAccountID, envelopeId, {
            recipientViewRequest: recipientViewRequest,
        });
        return results.url;
    }
    catch (err) {
        return err;
    }
};
