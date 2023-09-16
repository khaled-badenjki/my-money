# MyMoney Challenge
![mymoney workflow](https://github.com/khaled-badenjki/my-money-challenge/actions/workflows/github-actions.yml/badge.svg) ![test coverage](https://img.shields.io/badge/coverage-100-green)

This is a challenge provided by [SadaPay](https://sadapay.pk/) during the hiring process for a senior software engineer position. You can read the requirements [Here](https://codu.ai/coding-problem/mymoney).


# Setup :rocket:
## 1. Using Docker :whale:

 Copy the `.env.example` file to `.env` file 
 
    cp .env.example .env

Then run docker compose with this command

    docker-compose up --build -d 

    
   Once the build is done, you can start interacting with the tool. To see a list of available commands, do this:
   

    docker-compose run app node index.js --help



> when dealing with long commands like this, I like to create an alis to make my life easier. So i encourage you to create an alias called `mm` (for MyMoney):
> `alias mm='docker-compose run app node index.js'`
> Now you can interact with the tool like this
> `mm --help`
> 

If this is the **first time** to run the app, you will need to create the database and run migrations. Do the following:

    docker-compose run app npx sequelize-cli db:create
    docker-compose run app npx sequelize-cli db:migrate

And you are ready to go :rocket:
   
## 2. Without Docker :gear:
For the application, you will need `yarn` to be installed. Run this command to install dependencies

    yarn

Once finished, copy `.env.example` to `.env`

    cp .env.example .env
    
You will need to update the environment variable `POSTGRES_HOST` inside `.env` to be `localhost` instead of `db`

    # POSTGRES_HOST=db
    POSTGRES_HOST=localhost # new value

At this stage, the application is ready to use. However, you still need a `postgresql` instance.

If you don't want to install `postgresql` locally (which is a right decision), then you can use `Docker`  to handle the database while keeping the application without `Docker` (this is my preferable approach while developing)


It would look something like this:

    docker run --name postgresql -e POSTGRES_USER=user -e POSTGRES_PASSWORD=pass -p 5432:5432 -v /data:/var/lib/postgresql/data -d postgres
   
Once the app and database are up and running, you will need to create the database and run the migrations:

    npx sequelize-cli db:create
    npx sequelize-cli db:migrate

   After that, you should be ready to go :rocket:

# Design 📐✏️


# Usage ⭐
when passing a negative value (for example the `CHANGE` command), you need to pass double dash `--` to signify the end of options, so it would be like this

    node index.js CHANGE -- 10.00% 8.00% -5.00% JUNE
    

# Testing 🧪
To run the test suite, run this command:

    docker compose run app yarn coverage


MyMoney tool was built following **TDD** approach, while keeping an eye on 100% code coverage. I have used `mocha` for testing, `chai` for assertion, `sinon` for stubbing and `nyc` for code coverage.

Also, to implement e2e tests, I used `sqlite` to run tests quickly, in memory, without the need to setup a postgresql instance. `sequelize` ORM helped make the code working on both databases without the need for modification

The table below shows the result of running `yarn coverage`

File                                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------------------------------------|---------|----------|---------|---------|-------------------
All files                               |     100 |      100 |     100 |     100 |                   
 my-money-challenge                     |     100 |      100 |     100 |     100 |                   
  config.js                             |     100 |      100 |     100 |     100 |                   
 my-money-challenge/src/commands        |     100 |      100 |     100 |     100 |                   
  allocate.js                           |     100 |      100 |     100 |     100 |                   
  balance.js                            |     100 |      100 |     100 |     100 |                   
  change.js                             |     100 |      100 |     100 |     100 |                   
  index.js                              |     100 |      100 |     100 |     100 |                   
  rebalance.js                          |     100 |      100 |     100 |     100 |                   
  sip.js                                |     100 |      100 |     100 |     100 |                   
 my-money-challenge/src/dal             |     100 |      100 |     100 |     100 |                   
  config.js                             |     100 |      100 |     100 |     100 |                   
 my-money-challenge/src/dal/models      |     100 |      100 |     100 |     100 |                   
  account.js                            |     100 |      100 |     100 |     100 |                   
  operation.js                          |     100 |      100 |     100 |     100 |                   
 my-money-challenge/src/helpers         |     100 |      100 |     100 |     100 |                   
  calculator.js                         |     100 |      100 |     100 |     100 |                   
  serializer.js                         |     100 |      100 |     100 |     100 |                   
  validator.js                          |     100 |      100 |     100 |     100 |                   
 my-money-challenge/src/services        |     100 |      100 |     100 |     100 |                   
  allocate.js                           |     100 |      100 |     100 |     100 |                   
  balance.js                            |     100 |      100 |     100 |     100 |                   
  change.js                             |     100 |      100 |     100 |     100 |                   
  index.js                              |     100 |      100 |     100 |     100 |                   
  rebalance.js                          |     100 |      100 |     100 |     100 |                   
  sip.js                                |     100 |      100 |     100 |     100 |                   
 my-money-challenge/tests               |     100 |      100 |     100 |     100 |                   
  hello-world.test.js                   |     100 |      100 |     100 |     100 |                   
  setup-tests.js                        |     100 |      100 |     100 |     100 |                   
 my-money-challenge/tests/e2e           |     100 |      100 |     100 |     100 |                   
  allocate.test.js                      |     100 |      100 |     100 |     100 |                   
  change.test.js                        |     100 |      100 |     100 |     100 |                   
  rebalance.test.js                     |     100 |      100 |     100 |     100 |                   
  setup-e2e.js                          |     100 |      100 |     100 |     100 |                   
  sip.test.js                           |     100 |      100 |     100 |     100 |                   
 my-money-challenge/tests/unit/commands |     100 |      100 |     100 |     100 |                   
  allocate.test.js                      |     100 |      100 |     100 |     100 |                   
  balance.test.js                       |     100 |      100 |     100 |     100 |                   
  change.test.js                        |     100 |      100 |     100 |     100 |                   
  rebalance.test.js                     |     100 |      100 |     100 |     100 |                   
  sip.test.js                           |     100 |      100 |     100 |     100 |                   
 my-money-challenge/tests/unit/helpers  |     100 |      100 |     100 |     100 |                   
  calculator.test.js                    |     100 |      100 |     100 |     100 |                   
  validator.test.js                     |     100 |      100 |     100 |     100 |                   
 my-money-challenge/tests/unit/services |     100 |      100 |     100 |     100 |                   
  allocate.test.js                      |     100 |      100 |     100 |     100 |                   
  balance.test.js                       |     100 |      100 |     100 |     100 |                   
  change.test.js                        |     100 |      100 |     100 |     100 |                   
  rebalance.test.js                     |     100 |      100 |     100 |     100 |                   
  sip.test.js                           |     100 |      100 |     100 |     100 |                   


# Performance 📊


# Limitations 🏋🏽

 - This software deals with one year only (it's assumed to be `2023`, but this can be easily changed from `config.js` file). It should be relatively easy to extend it to handle multiple years.
