import express from 'express';

import UserModel from '../models/userModel';
import Module from '../models/modulesModel';

const router = express.Router();

// Post Method
router.post('/post', (req, res) => {
  res.send('Post API');
});

// Get all Method
router.get('/getAll', (req, res) => {
  res.send('Get All API');
});

// Get by ID Method
router.get('/getOne/:id', (req, res) => {
  res.send('Get by ID API');
});

// Update by ID Method
router.patch('/update/:id', (req, res) => {
  res.send('Update by ID API');
});

// Delete by ID Method
router.delete('/delete/:id', (req, res) => {
  res.send('Delete by ID API');
});

router.post('/add_user', async (request, response) => {
  const user = new UserModel(request.body);
  try {
    await user.save();
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.get('/users', async (request, response) => {
  const users = await UserModel.find({});
  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.get('/users', async (request, response) => {
  const users = await UserModel.find({});
  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.get('/modules', async (request, response) => {
  const users = await Module.find({});
  try {
    response.send(module);
  } catch (error) {
    response.status(500).send(error);
  }
});

export default router;
