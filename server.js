const dotenv = require('dotenv'); //should come before the app require

//will give us passage to the config.env file
dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//handling unhandle rejectinos --> subscribing to the event
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION 💣💣💣 --> SHUTTING DOWN APP...');

  //graceful shutdown
  server.close(() => {
    process.exit(1);
  });
});
