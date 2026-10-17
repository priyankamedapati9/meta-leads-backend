# Meta Lead Ads Integration PoC

A proof of concept that receives Meta Lead Ads webhook notifications, retrieves lead details through the Meta Graph API, stores them in MongoDB, and sends lead updates to a React Native application in real time using Socket.IO.

## Features

- Meta webhook verification and lead event handling
- Retrieves lead details through the Meta Graph API
- Stores lead information in MongoDB
- Avoids duplicate records using the Meta lead ID
- Sends real-time updates to connected clients through Socket.IO
- Sends existing saved leads to clients when they connect

## Tech Stack

- Node.js
- Express.js
- MongoDB and Mongoose
- Meta Graph API
- Socket.IO
- Axios

## Architecture

1. Meta Lead Ads sends a webhook event to the Express backend.
2. The backend extracts the lead ID from the event.
3. The backend requests lead details from the Meta Graph API.
4. The lead details are stored in MongoDB.
5. Socket.IO broadcasts the new lead to connected React Native clients.
6. When a client connects, the backend sends previously saved leads.

## Prerequisites

- Node.js and npm
- MongoDB
- A Meta developer app with the required permissions
- A Facebook Page and an associated Instant Form
- A publicly accessible HTTPS webhook URL for Meta webhook delivery

## Setup

Clone the repository:

bash
git clone https://github.com/priyankamedapati9/meta-leads-backend.git
cd meta-leads-backend