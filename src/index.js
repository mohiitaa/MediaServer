const express = require('express');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const morganBody = require('morgan-body');
const FileStore = require('session-file-store')(session);

const config = require(__dirname + '/config');
const apiRouter = require(config.root + '/routes/api');
const contentRouter = require(config.root + '/routes/content');
const userSettings = require(config.root + '/user-settings');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
    session({
      secret: [config.sessionSecret],
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // milliseconds in 30 days
      },
      store: new FileStore(),
    }),
);

morganBody(app, {logAllReqHeader: false});

app.use('/api', apiRouter);
app.use('/', contentRouter);

const content = userSettings.location;
app.use('/public', express.static(content));

module.exports = app;
