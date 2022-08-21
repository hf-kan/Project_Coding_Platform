/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import express from 'express';
import fetch from '../fetch';
import { GRAPH_ME_ENDPOINT } from '../lib/authConfig';

const router = express.Router();

// custom middleware to check auth state
router.get(
  '/id',
  (req:any, res:any, next) => {
    if (!req.session.isAuthenticated) {
      return res.redirect('/auth/signin'); // redirect to sign-in route
    }
    next();
    return null;
  }, // check if user is authenticated
  async (req:any, res:any, next) => {
    res.render('id', { idTokenClaims: req.session.account.idTokenClaims });
  },
);

router.get(
  '/profile',
  (req:any, res:any, next) => {
    if (!req.session.isAuthenticated) {
      return res.redirect('/auth/signin'); // redirect to sign-in route
    }
    next();
    return null;
  }, // check if user is authenticated
  async (req:any, res:any, next) => {
    try {
      const graphResponse = await fetch(GRAPH_ME_ENDPOINT, req.session.accessToken);
      res.render('profile', { profile: graphResponse });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
