const { app } = require('./app');
require('dotenv').config();
const mongoose = require('mongoose');
const { logger } = require('./logger');

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info('Database is connected.'))
  .catch((error) => {
    logger.error(error);
    try {
      mongoose.connection.close();
    } catch (err) {
      logger.error(err);
    }
  });

app.listen(process.env.PORT, () => {
  logger.info(
    `The server is running at: https://localhost:${process.env.PORT}`
  );
});
