NC-news-project

This is a link to the hosted version of this project - <link>

The project is an api with multiple endpoints that allow the user to interact with the information in the test and development databases, including GET, PATCH, POST and DELETE requests. A summary of the endpoints available can be obtained with a GET request to '/api' and a full summary of the endpoints can be found in the endpoints.json file. 

Initial Setup

    1 - The project can be cloned using the following command:

    `git clone <https://github.com/JamesLovesay/NC-news-project.git>

    2 - Dependencies can be installed using the following commands: 

    `npm install jest -D` to install jest
    `npm install dotenv` to install dotenv
    `npm install supertest -D` to install supertest
    `npm install express` to install express
    `npm prepare` to install husky
    
    3 - Seeding the local database is achieved with the following commands:

    `npm run setup-dbs`
    `npm run seed`

    4 - Runing the tests is achieved with the following command:

    `npm run test`

We'll have two databases in this project. One for real looking *dev data* and another for simpler *test data*.

You will need to create two .env files in the root directory for your project: `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names). Double check that these .env files are .gitignored.

You will need as a minimum Node.js version 8.5.0 and Postgres version 8.7.3.