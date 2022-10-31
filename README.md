# bonku
To run this app locally, do the following:

Create a `.env` file with the following contents:
```
mongoDB=mongodb://mongo:27017/bonku  
NODE_ENV=development
```

Run `npm install`

Build the Docker image running `docker-compose build`

Run the app in Docker by running `docker-compose up` (this may take 20ish seconds the first time)
The app will not be accessible until you see the message `APPLICATION RUNNING` 

Then, navigate to http://localhost:8000/

To stop the app, run `Control+C` on a Mac.

To stop app using Docker run:
`docker-compose down`

You may view Docker images by running the below command:
`docker images`
