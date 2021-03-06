
const express = require('express');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');

const passport = require('./strategies/user.strategy');

// Route includes
const adminRouter = require('./routes/admin.router');
const requestRouter = require('./routes/request.router');
const roomRouter = require('./routes/room.router');
const cleanerRouter = require('./routes/cleaner.router');
const availabilityRouter = require('./routes/availability.router');
const cleaningTypeRouter = require('./routes/cleaningType.router');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/admin', adminRouter);
app.use('/api/request', requestRouter);
app.use('/api/room', roomRouter);
app.use('/api/cleaner', cleanerRouter);
app.use('/api/availability', availabilityRouter);
app.use('/api/cleaningtype', cleaningTypeRouter);

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
