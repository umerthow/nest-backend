# Backend Nest (Sunbyte)

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v13.x-9cf)]()
[![Node](https://img.shields.io/badge/Node-v16.13.x-success)]()
[![npm version](https://badge.fury.io/js/npm.svg)](https://badge.fury.io/js/npm)
> A  Application, Build using [Nest JS](https://nestjs.com) and [Typescript](https://www.typescriptlang.org).

### Configuration

Environment Option :
> copy & paste file `.env.sample` into `.env` and adjust your configuration

### Running the Application

Listen Port `3000`

```bash
# development
$ npm run dev

# production
$ npm run build
$ npm run start
```

health check : `/sunbytes/v1/health`

### How To Running

> set up .env db

### Features

> POST `/sunbytes/user`

> sample payload
```
{
    "owner": 123,
    "name": "ArhUdiejdsQ",
    "company": "Sunbytes"
}
```

> response:
- 200 (OK)
```
{
    "owner": 231,
    "name": "heidrUQsjdA",
    "company": "tSuyebsn"
}
```

- 400 (Bad Request)

```
{
    "success": false,
    "status": 400,
    "message": "Bad Request",
    "apiVersion": "1.0.0",
    "apiVersionDate": "04/02/2022",
    "error": {
        "description": "Bad Request Exception",
        "type": "BadRequestException",
        "moreInfo": "-"
    }
}
```

### Swagger
> http://localhost:3000/api#/default/UserController_createUser