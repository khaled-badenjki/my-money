# MyMoney Challenge

This is a challenge provided by [SadaPay](https://sadapay.pk/) during the hiring process for a senior software engineer position. You can read the requirements [Here](https://codu.ai/coding-problem/mymoney).


# Setup
## 1. Using Docker

 Copy the `.env.example` file to `.env` file 
 
    cp .env.example .env

Then run docker compose with this command

    docker-compose up --build -d 
    
   Once the build is done, you can start interacting with the tool. To see a list of available commands, do this:
   

    docker run my-money-challenge-app:latest index.js --help
   
## 2. Without Docker
For the application, you will need `yarn` to be installed. Run this command to install dependencies

    yarn

Once finished, copy `.env.example` to `.env`

    cp .env.example .env
    
At this stage, the application is ready to use. However, you still need a `postgresql` instance.

If you don't want to install `postgresql` locally (which is a right decision), then you can use `Docker`  to handle the database while keeping the application without `Docker` (this is my preferable approach while developing)


It would look something like this:

    docker run --name postgresql -e POSTGRES_USER=user -e POSTGRES_PASSWORD=pass -p 5432:5432 -v /data:/var/lib/postgresql/data -d postgres

# Design

# Usage

# Performance

# Limitations