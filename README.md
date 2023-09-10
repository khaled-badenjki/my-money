# MyMoney Challenge

This is a challenge provided by [SadaPay](https://sadapay.pk/) during the hiring process for a senior software engineer position. You can read the requirements [Here](https://codu.ai/coding-problem/mymoney).


# Setup :rocket:
## 1. Using Docker :whale:

 Copy the `.env.example` file to `.env` file 
 
    cp .env.example .env

Then run docker compose with this command

    docker-compose up --build -d 
    
   Once the build is done, you can start interacting with the tool. To see a list of available commands, do this:
   

    docker-compose run app node index.js --help

And you are ready to go :rocket:
> when dealing with long commands like this, I like to create an alis to make my life easier. So i encourage you to create an alias called `mm` (for MyMoney):
> `alias mm='docker-compose run app node index.js'`
> Now you can interact with the tool like this
> `mm --help`
> 

   
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
   
   After that, you should be ready to go :rocket:

# Design 📐✏️


# Usage ⭐

# Testing 🧪


# Performance 📊


# Limitations 🏋🏽
1. Due to a limitation in sequelize-cli as per [this issue](https://github.com/sequelize/cli/issues/1368), only the first time you run `docker-compose up --build -d` will succeed immediately. If for any reason you need to re-build, you **NEED** to manually delete the old database `mymoney`