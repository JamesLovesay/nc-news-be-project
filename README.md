NC-news-project

This is a link to the hosted version of this project - <https://nc-news-back-end-project.herokuapp.com/>

The project is an api with multiple endpoints that allow the user to interact with the information in the test and development databases, including GET, PATCH, POST and DELETE requests. A summary of the endpoints available can be obtained with a GET request to '/api' and a full summary of the endpoints can be found in the endpoints.json file. 

## Setup

1 - The project can be cloned using the following command:

`git clone https://github.com/JamesLovesay/NC-news-project.git`

2 - Dependencies can be installed using the command `npm install`. You will need to ensure that PostgreSQL is installed on your machine and that the server is started using the applicable command for your machine, depending on whether you are using a Mac, Windows or Linux machine. Please use the following link to access instructions on how to do this. https://tableplus.com/blog/2018/10/how-to-start-stop-restart-postgresql-server.html. 
    
The dependencies relied upon by this project are: 

- jest
- dotenv
- supertest
- express
- husky

3 - Seeding the local database is achieved with the following commands:

`npm run setup-dbs`
`npm run seed`

4 - Running the tests is achieved with the following command:

`npm run test`

We'll have two databases in this project. One for real looking *dev data* and another for simpler *test data*.

You will need to create two .env files in the root directory for your project: `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names). Double check that these .env files are .gitignored.

## Minimum system requirements

You will need as a minimum Node.js version 8.5.0 and Postgres version 8.7.3.