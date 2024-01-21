# Welcome to NC News!

## Summary
For this project, I built the backend service for a social media news service. Users can read articles, post comments and vote on articles. 
The backend was built using Node.js, Express.js, PostgresSQL and Test Driven Development with Jest and Supertest.

Hosted link: https://nc-news-l13l.onrender.com/api

## Instructions

1. Fork and clone the repo
``` git clone https://github.com/tams101/be-nc-news.git```

2. On your local repo, you will need to install the dependencies
listed in the package.json file using ```npm install```

3. Please create a .env.test and .env.development file in the root folder of your local repo.  
Into the .env.test file, add ```PGDATABASE=nc_news_test```  
Into the .env.development file, add ```PGDATABASE=nc_news```

Please ensure that both files are added to the .gitignore file.

4. Setup the databases using the command ```npm run setup-dbs``` and then run the test suite to ensure everything is working. 
When running the test suite, the database will be seeded with the test data. To seed the database with the development data you will need to run the command ```npm run seed```

Please note minimum version requirements:
 * Node.js: v20.8.0  
 * PostgreSQL: v14.9 