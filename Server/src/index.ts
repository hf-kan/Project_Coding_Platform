// https://dev.to/roycechua/setup-a-node-express-api-with-typescript-2021-11o1
// JUnit Command Lines: https://junit.org/junit5/docs/5.0.0-M5/user-guide/#running-tests-console-launcher
import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { promisify } from 'util';
import { exec } from 'child_process';
import fs from 'fs';

import UserModel from './models/userModel';
import termModel from './models/termModel';
import ModuleModel from './models/modulesModel';
import AssignmentModel from './models/assignmentModel';
import SubmissionModel from './models/submissionModel';

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
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
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

app.get('/assignments/query', async (request, response) => {
  try {
    AssignmentModel.find(
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

app.get('/getModuleStudents', async (request, response) => {
  try {
    UserModel.find(
      { studentMod: request.query.studentMod },
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

app.get('/getAllModules', async (request, response) => {
  try {
    ModuleModel.find({}).exec().then((data) => {
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

app.get('/submissions/queryByUserAssignment', async (request, response) => {
  try {
    SubmissionModel.find(
      {
        username: request.query.username,
        assignmentId: request.query.assignmentId,
      },
    ).sort({ lastUpdateDtm: -1 }).setOptions(
      getOption,
    ).exec()
      .then((data) => {
        if (!data) {
          response.send([]);
        } else response.send(data);
      });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get('/submissions/queryByAssignment', async (request, response) => {
  try {
    SubmissionModel.find(
      {
        assignmentId: request.query.assignmentId,
      },
    ).sort({ lastUpdateDtm: -1 }).setOptions(
      getOption,
    ).exec()
      .then((data) => {
        if (!data) {
          response.send([]);
        } else response.send(data);
      });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get('/submissions/getById', async (request, response) => {
  try {
    SubmissionModel.find(
      {
        _id: request.query.submissionId,
      },
    ).setOptions(
      getOption,
    ).exec()
      .then((data) => {
        if (!data) {
          response.send([]);
        } else response.send(data);
      });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post('/submissions/add', async (request, response) => {
  const { assignmentId, username, programCode } = request.body[0];
  const newSubmission = new SubmissionModel({
    assignmentId,
    username,
    status: 'InProgress',
    score: 0,
    programCode,
    graderXML: {},
    graderReport: {},
    lastUpdateDtm: new Date(),
  });
  await newSubmission.save().then(
    (savedDoc:any) => { response.status(200).send(savedDoc); },
  ).catch(
    (error:any) => { response.status(500).send(error); },
  );
});

app.patch('/submissions/update', async (request, response) => {
  const {
    _id,
    assignmentId,
    username,
    status,
    score,
    programCode,
    graderXML,
    graderReport,
  } = request.body;
  const contentToBeUpdated: any = {
    assignmentId,
    username,
    status,
    score,
    programCode,
    graderXML,
    graderReport,
    lastUpdateDtm: new Date(),
  };
  await SubmissionModel.findByIdAndUpdate(_id, contentToBeUpdated).then(
    (savedDoc:any) => { response.status(200).send(savedDoc); },
  ).catch(
    (error:any) => { response.status(500).send(error); },
  );
});

app.post('/testRun', async (request, response) => {
  const {
    userId,
    assignment,
    submission,
    testCase,
  } = request.body;
  const { solution, methodName } = assignment;
  const { assignmentId, programCode } = submission;
  const userArgumentsArray = testCase.split(',');
  const userPath = `${process.env.TESTER_ASSIGNMENT_FOLDER}/${assignmentId}/${userId}`;
  let cmdArgs = `${methodName} `;
  userArgumentsArray.forEach((value:string) => {
    cmdArgs = `${cmdArgs} "${value}" `;
  });
  const cmd1ChangeDir = `cd ${process.env.TESTER_PATH}`;
  const cmd2CreateFolder = `mkdir -p ${userPath}`;
  const cmd3CopyTestCoreJava = `\\cp ${process.env.LIBRARY_PATH}/${process.env.TESTER_CORE_FILE}.java ${userPath}`;
  const cmd6CompileSolution = `javac ${process.env.SOLUTION_CLASS}.java`;
  const cmd7CompileSubmission = `javac ${process.env.SUBMISSION_CLASS}.java`;
  const cmd8CompileCore = `javac ${process.env.TESTER_CORE_FILE}.java`;
  const cmd9RunTest = `java ${process.env.TESTER_CORE_FILE} ${cmdArgs}`;
  const execPromise = promisify(exec);
  try {
    // create folder and copy tester core java to user folder. Unique folder per assignment per user
    const { stderr: abnormalError } = await execPromise(`${cmd1ChangeDir}&&${cmd2CreateFolder}&&${cmd3CopyTestCoreJava}`);
    if (abnormalError.length === 0) {
      fs.writeFileSync(`${process.env.TESTER_PATH}/${userPath}/${process.env.SUBMISSION_CLASS}.java`, programCode);
      fs.writeFileSync(`${process.env.TESTER_PATH}/${userPath}/${process.env.SOLUTION_CLASS}.java`, solution);
    } else {
      response.send({ abnormalError });
    }
    // compile and run
    const { stdout, stderr } = await execPromise(`
      ${cmd1ChangeDir}/${userPath}&&
      ${cmd6CompileSolution}&&
      ${cmd7CompileSubmission}&&
      ${cmd8CompileCore}&&
      ${cmd9RunTest}`);
    response.send({ stdout, stderr });
  } catch (error) {
    response.send(error);
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
