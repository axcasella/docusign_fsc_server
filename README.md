# Docusign FSC Hackathon Submission

## App 3

## Team members:

**Alex Casella**: Team captain, backend & blockchain developer

**Vidhu Bhatnagar**: Frontend developer

**Iriana Rodriguez**: Storyteller and researcher

## Overview

Forest products are all around us — from our pencils and papers, to our furniture and flooring, and much more. We want to help the Forest Stewardship Council (FSC) and Docusign work as hard for our forests, as the forests work for us.

Unfortunately, the Coronavirus has made it difficult for the FSC certification body (CB) to provide a chain of custody certification for companies in the forest industry supply chain. Specifically, it has become harder for FSC to conduct onsite audits of these companies, which is crucial in the pursuit of deciding what makes an ethical forest industry. To resolve this problem, we have built a web application that enables FSC auditors to virtually audit CoC applicants and issue these certifications. In addition, we have built a blockchain microservice to keep track of certifications with an immutable ledger. Let’s bring people who love forests together and help make today’s decisions work for tomorrow’s world.

From the forest to the end customer, our app can be used by all companies in its supply chain.

:evergreen_tree::evergreen_tree::evergreen_tree: :arrow_right: Harvesting :arrow_right: Manufacturer :arrow_right: Broker :arrow_right: Distributer :arrow_right: Printer :arrow_right: Wholesaler :arrow_right: Retailer :arrow_right: :family:

## Technical architecture

![Technical architecture diagram](src/files/TechnicalArchitecture.png)

## How we built it

### Frontend UI

The frontend UI is built with React, Redux, and Ant Design.

### Backend server

Our backend server is built with Node.js and Express. We have written our server side code in Typescript for the ability to do static type checking and less error prone code.

The server stores FSC data & schema, evaluations, and certificates to Microsoft Dynamics 365. Evaluations and certificates follow the required FSC schema. In addition, the server stores user info, roles, and audit comments to MongoDB Atlas.

The server exposes the following **15 REST APIs**, consumed by our UI. The decoupling of server and UI is beneficial because we can scale up the server without impacting the UI, and the UI can be swapped out as needed.

```
Register user
POST api/user/

Get all registered users
GET api/user/

Login and authenticate
POST api/auth/

Get logged in user
GET api/auth/

Get all organizations from MS Dynamics CRM
GET api/org/

Add a new certificate to MS Dynamics. When the blockchain microservice is enabled this will add a certificate to the ledger as well
POST api/certificate/

Update an existing certificate's status to "Issued" in MS Dynamics. When the blockchain microservice is enabled this will update the certificate in the ledger as well
POST api/evaluation/certificate/:certificateID

Get all certificates from MS Dynamics
GET api/certificate/

Add a new evaluation for a certificate to MS Dynamics. Evaluations are only visible to FSC, ASI, and CB
POST api/evaluation/

Get all evaluations for a certificate from MS Dynamics
GET api/evaluation/certificate/:certificateID

Add a feedback comment for a certificate, comment is visible to CoC applicant
POST api/certificate/:certificateID/add_comment

Get all feedback comments for a certificate
GET api/certificate/:certificateID/comments

Get Docusign access token with authorization code
GET api/docusign/token

Get embedded signing URL for FSC Trademark License Agreement
POST api/docusign/agreement

Get embedded signing URL for FSC Certificate Template
POST api/docusign/final_certificate
```

We have also added an authentication middleware for role based access control of our APIs. Roles can be "CB", "FSC", "ASI", or "Applicant". The following is achieved:

- Only CB auditor can add an evaluation comment. These evaluations are only visible to CB, FSC, and ASI.
- Only CB auditor can issue a certificate and update a certificate.
- Both CB auditor and CoC applicant can make comments back and forth on evidences. As shown in the chat box feature of our UI.

In addition, we have integrated with DocuSign's eSignature APIs. The CoC applicant is required to sign the FSC Trademark License Agreement and the CB auditor is required to sign the FSC Certificate using embedded signing ceremonies.

For our demo, the server is deployed to AWS.

### Blockchain microservice

Simply relying on an centralized database such as Microsoft Dynamics isn't enough. We have decided to take advantage of blockchain technology and add an immutable source of truth for each certificate issued by the FSC.

Our blockchain microservice is built on top of Hyperledger Fabric. Hyperledger Fabric is an open source private permissioned blockchain framework. The microservice's server is built with Node.js and Express. The server side code is written in Typescript. The server calls Hyperledger Fabric's Contract APIs to communicate with the blockchain network.

The smart contract chaincode is written in Typescript as well. The smart contract consists of 4 functions: **create certificate, read certificate, delete certificate, and update existing certificate's status to "Issued"**. The smart contract is ready to be hosted on AWS's Amazon Managed Blockchain service.

Certificate object in the blockchain ledger:

```
@Object()
export class Certificate {
  @Property()
  public certificateID: string;
  public type: string;
  public company: string;
  public issuer: string;
  public issuanceDate: string;
  public status: string;
}
```

The microservice exposes **3 REST APIs**, called by the backend server:

```
Add a certificate to the blockchain's world state DB
POST api/blockchain/certificates

Update a certificate's status to "Issued" in the world state DB
POST api/blockchain/certificates/:certificateID/issue

Get a certificate back
GET  api/blockchain/certificates/:certificateID
```

We have made it optional for the backend server to connect to the blockchain microservice. In the backend server, the config setting is the `enable_blockchain` field in `src/config/config.ts`. After the chaincode is deployed to AWS, this option can be turned on, and the microservice's server can be started. When this is enabled, the backend server will call the `POST api/blockchain/certificates` API when creating a certificate in Microsoft Dynamics CRM DB, which will create a record in the blockchain ledger. It will also call the `POST api/blockchain/certificates/:certificateID/issue` API when updating the certificate's status in Dynamics DB.

## What's next for this project

We are proud to have gotten this far in our spare time in 2 months. However, there are a few improvements to be made if the FSC would like to use it in production.

- Deploy smart contract chaincode to a managed service.
- Enhance authentication and restrict access to blockchain microservice APIs.
- Add additional features to the smart contract to allow more companies in the supply chain to participate.

Thank you Docusign and FSC for the opportunity to learn, give back, and compete in this hackathon.

:deciduous_tree::deciduous_tree::deciduous_tree::deciduous_tree::deciduous_tree:
