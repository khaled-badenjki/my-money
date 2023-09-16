# MyMoney Challenge
![example workflow](https://github.com/github/docs/actions/workflows/github-actions.yml/badge.svg)

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


# Performance 📊


# Limitations 🏋🏽

 - This software deals with one year only (it's assumed to be `2023`, but this can be easily changed from `config.js` file). It should be relatively easy to extend it to handle multiple years.
