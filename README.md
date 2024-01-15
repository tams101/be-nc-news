# Northcoders News API

To connect to the two databases please create a .env.test and .env.development file in your local repo.
Into each file, add PGDATABASE=, with the correct database name for each environment. The database names can be viewed in /db/setup.sql.
Please ensure that both files are are .gitignored and that you have installed dotenv so that the connection file has access to this so that all environment variables are set using these files. (npm install dotenv)