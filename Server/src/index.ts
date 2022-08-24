// https://dev.to/roycechua/setup-a-node-express-api-with-typescript-2021-11o1
import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import UserModel from './models/userModel';
import termModel from './models/termModel';
import ModuleModel from './models/modulesModel';
import AssignmentModel from './models/assignmentModel';
// import msAuthApp from './app/msAuthApp';

import { connectDB } from './lib/dbConnect';

dotenv.config();

const PORT = parseInt(process.env.SERVER_PORT as string, 10);
const app: Application = express();
const router = express.Router();
const getOption: any = { sanitizeFilter: true };

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization');
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
  await user.save().then(
    (savedDoc) => { response.status(200).send(savedDoc); },
  ).catch(
    (error) => { response.status(500).send(error); },
  );
});

app.get('/assignment/module/:moduleKey', async (request, response) => {
  try {
    AssignmentModel.find({ module: request.params.moduleKey }).exec().then((data) => {
      if (!data) {
        response.status(404).send({
          message: 'not found',
        });
      } else response.send(data);
    });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post('/modules/add', async (request, response) => {
  const { moduleId, name, term } = request.body[0];
  const newModule = new ModuleModel({
    moduleId,
    name,
    term,
  });
  await newModule.save().then(
    (savedDoc:any) => { response.status(200).send(savedDoc); },
  ).catch(
    (error:any) => { response.status(500).send(error); },
  );
});

app.get('/modules', async (request, response) => {
  try {
    UserModel.find().exec().then((data) => {
      if (!data) {
        response.status(404).send({
          message: 'not found',
        });
      } else response.send(data);
    });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get('/modules/query', async (request, response) => {
  try {
    ModuleModel.find(
      { _id: request.query.ObjectId },
    ).setOptions(
      getOption,
    ).exec().then((data) => {
      if (!data) {
        response.status(404).send({
          message: 'not found',
        });
      } else response.send(data);
    });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get('/users/:user', async (request, response) => {
  try {
    UserModel.find(
      { username: request.params.user },
    ).setOptions(
      getOption,
    ).exec().then((data) => {
      if (!data) {
        response.status(404).send({
          message: 'not found',
        });
      } else response.send(data);
    });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get('/terms', async (request, response) => {
  try {
    termModel.find({}).exec().then((data) => {
      if (!data) {
        response.status(404).send({
          message: 'not found',
        });
      } else response.send(data);
    });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get('/terms/query', async (request, response) => {
  try {
    termModel.find(
      { _id: request.query.ObjectId },
    ).setOptions(
      getOption,
    ).exec().then((data) => {
      if (!data) {
        response.status(404).send({
          message: 'not found',
        });
      } else response.send(data);
    });
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
