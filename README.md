# Docusign FSC Hackathon Submission

## Team members:

Alex Casella: Team captain, backend & blockchain developer

Vidhu Bhatnagar: Frontend developer

Iriana Rodriguez: Story-teller and coordinator

### Overview

We are passionate about giving back to our planet and contributing to the wellness of our forests. Unfortunately Covid-19 has made it difficult for the Forest Stewardship Council (FSC) Certification Body (CB) to conduct onsite audits for companies in the forest industry supply chain. On the other hand, these companies also have a much harder time with obtaining a Chain of Custody Certification (CoC) from the FSC. To resolve this problem, we have built a web application that enables FSC auditors to virtually audit CoC applicants and issue certifications. In addition, we have built a blockchain microservice to keep track of certificates with its immutable ledger. From the forest to the end customer, our app can be used by all companies in its supply chain.

:evergreen_tree::evergreen_tree::evergreen_tree: :arrow_right: Harvesting :arrow_right: Manufacturer :arrow_right: Broker :arrow_right: Distributer :arrow_right: Printer :arrow_right: Wholesaler :arrow_right: Retailer :arrow_right: :family:

### Technical architecture

...

### How we built it

#### Frontend UI

#### Backend server

Our backend server is built with Node.js and Express. We have written our server side code in Typescript for the ability to do static type checking, leading to less error prone code.

The server exposes the following REST APIs, consumed by our UI. The decoupling of server and UI is beneficial because we can scale up the server without impacting the UI, and the UI can be swapped out as needed.

```
Get all organizations from MS Dynamics CRM
GET api/org/

Get logged in user
GET api/auth/

```

We have also added authentication at the server level and do role based access control. On the server side, we have added an authentication middleware to our REST APIs. As a result, the following is achieved:

- Only CB auditor can add an evaluation comment. These are only visible to CB, FSC, and ASI.
- Only CB auditor can issue a certificate and update a certificate.
- Both CB auditor and CoC applicant can make comments back and forth on evidences. This is seen in the chat box feature in the UI.

In addition, we have integrated with DocuSign's eSignature APIs. The CoC applicant is required to sign the FSC Trademark License Agreement and the CB auditor is required to sign the FSC Certificate using embedded signing ceremonies.

#### Blockchain microservice

Our blockchain microservice is built on top of Hyperledger Fabric v1.4. Hyperledger Fabric is an open source private permissioned blockchain framework. It provides an immutable source of truth for each certificate issued by the FSC.

The microservice is built with Node.js and Express. The server side code is written in Typescript. The server calls Hyperledger Fabric's Contract APIs to communicate with the blockchain network.

The smart contract chaincode is written in Typescript as well. The smart contract consists of 4 functions: create certificate, read certificate, delete certificate, and update existing certificate's status to "Issued". The smart contract is ready to be hosted on IBM's Blockchain Platform service or AWS's Amazon Managed Blockchain service.

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

The microservice exposes 3 REST APIs, called by the backend server:

```
POST api/blockchain/certificates
POST api/blockchain/certificates/:certificateID/issue
GET  api/blockchain/certificates/:certificateID
```

We have made it optional for the backend server to connect to the blockchain microservice. In the backend server, the config setting is the `enable_blockchain` field in `src/config/config.ts`. After the chaincode is deployed to IBM or AWS, this option can be turned on, and the microservice's server can be started. When this is enabled, the backend server will call the `POST api/blockchain/certificates` API when creating a certificate in Microsoft Dynamics CRM DB, which will create a record in the blockchain ledger. It will also call the `POST api/blockchain/certificates/:certificateID/issue` API when updating the certificate's status in Dynamics DB.

### What's next for this project

We are proud to have finished all these components in 2 months. However, there are a few improvements to be made if the FSC would like to use it in production.

Improvements:

-
-
-

Thank you Docusign and FSC for the opportunity to learn, give back, and compete in this hackathon.

:rocket::rocket::rocket::rocket::rocket:
