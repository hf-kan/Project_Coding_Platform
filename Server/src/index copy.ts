// https://dev.to/roycechua/setup-a-node-express-api-with-typescript-2021-11o1
import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import UserModel from './models/UserModel';
// import msAuthApp from './app/msAuthApp';

import { connectDB } from './lib/dbConnect';

dotenv.config();

const PORT = parseInt(process.env.SERVER_PORT as string, 10);
const app: Application = express();
const router = express.Router();

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

app.get(
  '/',
  async (req: Request, res: Response) => {
    // msAuthApp(req, res);
    res.status(200).send(JSON.stringify('success'));
  },
);

app.post(
  '/login',
  async (req: Request, res: Response) => {
    const { user, password } = req.body;
    const response = `User: ${user} Password: ${password}`;
    res.status(200).send(JSON.stringify(response));
  },
);

app.post('/add_user', async (request, response) => {
  const user = new UserModel(request.body);
  try {
    await user.save();
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get('/users', async (request, response) => {
  const users = await UserModel.find({});
  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

try {
  app.listen(PORT, (): void => {
    console.log(`Connected successfully on port ${PORT}`);
    connectDB();
  });
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}
