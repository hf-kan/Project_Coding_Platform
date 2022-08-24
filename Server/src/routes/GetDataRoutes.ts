import express from 'express';

import UserModel from '../models/userModel';
import ModuleModel from '../models/modulesModel';
import { connectDB, disconnectDB } from '../lib/dbConnect';

const router = express.Router();

router.get('/users', async (request, response) => {
  const users = await UserModel.find({});
  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.get('/user/:username', async (request, response) => {
  try {
    const db = connectDB();
    const users = await UserModel.findOne({ _username: request.params.username });
    disconnectDB(db);
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.get('/modules', async (request, response) => {
  const users = await ModuleModel.find({});
  try {
    response.send(module);
  } catch (error) {
    response.status(500).send(error);
  }
});

export default router;
