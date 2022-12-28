<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

# N-of-1 Companion - Backend

## Description

N-of-1 Companion is a web application designed to facilitate the conduct of N-of-1 therapeutic tests. It allows you to design and manage your tests, collect patient data, perform statistical analysis and many other features.

This tool is offered by the [Clinical Pharmacology Department of the University Hospital of Vaud (PCL - CHUV, Switzerland)](https://www.chuv.ch/fr/pcl/pcl-home/).
With the collaboration of the [School of Engineering and Management Vaud (HEIG-VD)](https://heig-vd.ch).

---

**This is the backend API of the _N-of-1 Companion_ web application.**

Build with:

- [NestJS](https://github.com/nestjs/nest)
- [Mongoose](https://mongoosejs.com/)
- [Passeport](https://www.passportjs.org/)
- [Nodemailer](https://nodemailer.com/about/)
- [TypeScript](https://www.typescriptlang.org/)

> The frontend part of the application can be found [here][nof1companion-frontend-repo].

## Prerequisites

Please ensure that the following items are installed on your operating system :

- [Node.js](https://nodejs.org/en/download/) (version >= 16.13.0)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

You must have a working [MongoDB](https://www.mongodb.com/) database. You can use either the [MongoDB Server Community Edition](https://www.mongodb.com/docs/manual/administration/install-community/), a cloud-based [MongoDB Atlas]() instance, or a [Docker container](https://hub.docker.com/_/mongo).

Create a `.env` file if not present and set the following environment variables :

```bash
# APP PORT
PORT=3001 # port number of your choice
# Frontend urls
FRONTEND_URL=https://your_frontend_application_url
FRONTEND_URL2=https://your_frontend_application_url2 # we used this for a specific need, but you can simply copy and paste the url above.
# mongodb uri connection string
MONGODB_URI=mongodb://user:password@host:27017/nof1Companion # your mongodb URI
# JWT
JWT_SECRET=YOUR_STRONG_JWT_SECRET
JWT_EXPIRATION_TIME=24h # JWT expiration time of your choice
# Configuration of the email account that will be used to send emails.
MAIL_HOST=smtp.office365.com # smtp server address. Here is an exemple with a Microsoft account.
MAIL_USER=your_address@domain.com # email address
MAIL_PASSWORD=YOUR_PASSWORD # email account password
# crypto secrets used to encrypt/decrypt identifying data
SECRET=32_BYTES_SECRET_STRING # 32 bytes
IV_SECRET=16_BYTES_SECRET_STRING # 16 bytes
SALT_SECRET=64_BYTES_SECRET_STRING # 64 bytes
# secret of the session cookie for the captcha challenge
SESSION_KEY=32_BYTES_SECRET_STRING # 32 bytes
```

## Installation

Install the Nest CLI globally using :

```bash
$ npm install -g @nestjs/cli
```

Clone the repository and install the project dependencies using the following command in the project root folder:

```bash
$ npm install
```

## Running the app

> Make sure MongoDB is up and running before launching the server.

Commands:

```bash
# development mode
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run build
$ npm run start:prod
```

> Default url : http://localhost:3000/ (or port :process.env.PORT)

Install the [frontend part][nof1companion-frontend-repo] of the application to interact with the server, or use a tool like postman.

## OpenAPI documentation

After launching the server, you can access the OpenAPI documentation (not complete, but providing an overview of routes) at http://localhost:PORT/api.

## Maintenance
There is no guarantee that the project will be further developed. But you are welcome to fork the project.

## Contributors

- [Daniel Sciarra](https://github.com/DS-Daniel/)

Initially developed as a Bachelor study project at the [HEIG-VD](https://heig-vd.ch), then taken over as a Junior Software Engineer.

## License

Distributed under the GNU AGPLv3 license. See LICENSE for more information.

<!-- MARKDOWN LINKS -->

[nof1companion-frontend-repo]: https://github.com/CHUV-PCL/Nof1Companion-frontend
