# Stateless Web Api service

---
This project implements web api services designed to provide CRUD methods to work with users model. 
It designed as stateless web api, with stateful db service, and cluster api.

## Features

---
- CRUD operations over 'users' model.
- Validation of 'user' UUID.
- Stateless cluster application.
- Load balancer utilizing Round-Robin algorithm
- Easy to implement api controller

## Requirments

---
Node.js v22.14.0 or higher

## Installation
1. Clone this repository
2. Run `npm install` from local project directory to install dependencies.

## Usage

---
Start service with following commands:
- `npm run start:dev` to run development mode
- `npm run start:prod` to build & run production mode
- `npm run start:dev:multi` to run development & cluster mode with multiple workers
- `npm run start:prod:multi` to run production & cluster mode with multiple workers

## Licensing

---
This project is available under the MIT License.