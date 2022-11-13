# smart-home-api

# introduction

This document explain how to use smart-home-api.
"smart-home-api" provides you how to manage "your home","you" and "your great devices"

# Quick Start

Copy this project to your local environment

`git clone https://github.com/supunlakmal/thismypc.git`

Then, create tables with using following command

`npm run migrate && npm run seed`

Finally, run this api !!!

`npm run start`

IF you want to test

`npm run test`

# Folder Structure

```
.
├── README.md
├── db
│   ├── data        # All data for setup
│   ├── migrations  # Table creation
│   └── seeds       # Files for first data insert
├── knexfile.js
├── package-lock.json
├── package.json
├── src             # All Api
└── test
```

# Built With

- [Node JS](https://nodejs.org/en/)
- [Postgresql](https://www.postgresql.org/)
- [Express JS](https://expressjs.com/)
