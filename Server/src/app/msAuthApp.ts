/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import session from 'express-session';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from '../routes/index';
import usersRouter from '../routes/users';
import authRouter from '../routes/auth';

dotenv.config();

// initialize express
const msAuthApp = express();

// view engine setup
msAuthApp.set('views', path.join(__dirname, 'views'));
msAuthApp.set('view engine', 'hbs');

msAuthApp.use(logger('dev'));
msAuthApp.use(express.json());
msAuthApp.use(cookieParser());
msAuthApp.use(express.urlencoded({ extended: false }));
msAuthApp.use(express.static(path.join(__dirname, 'public')));

/**
 * Using express-session middleware for persistent user session. Be sure to
 * familiarize yourself with available options. Visit: https://www.npmjs.com/package/express-session
 */
msAuthApp.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set this to true on production
  },
}));

msAuthApp.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

msAuthApp.use('/', indexRouter);
msAuthApp.use('/users', usersRouter);
msAuthApp.use('/auth', authRouter);

// catch 404 and forward to error handler
msAuthApp.use((_req, _res, next) => {
  next(createError(404));
});

// error handler
msAuthApp.use((err:any, req:any, res:any, _next: any) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default msAuthApp;
