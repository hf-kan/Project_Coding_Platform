// https://dev.to/roycechua/setup-a-node-express-api-with-typescript-2021-11o1
// JUnit Command Lines: https://junit.org/junit5/docs/5.0.0-M5/user-guide/#running-tests-console-launcher
import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { promisify } from 'util';
import { exec } from 'child_process';
import fs from 'fs';
import xml2js from 'xml2js';

import UserModel from './models/userModel';
import TermModel from './models/termModel';
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
    res.status(200).send(JSON.stringify('Express Router active'));
  },
);

app.post('/users/add', async (request, response) => {
  const {
    username,
    userId,
    name,
    role,
    lecturerMod,
    studentMod,
  } = request.body[0];
  const newUser = new UserModel({
    username,
    userId,
    name,
    role,
    lecturerMod,
    studentMod,
  });
  await newUser.save().then(
    (savedDoc:any) => { response.status(200).send(savedDoc); },
  ).catch(
    (error:any) => { response.status(500).send(error); },
  );
});

app.get('/assignment/module/:moduleKey', async (request, response) => {
  try {
    AssignmentModel.find({ module: request.params.moduleKey })
      .select('title module start end')
      .exec().then((data) => {
        if (!data) {
          response.status(200).send([]);
        } else response.status(200).send(data);
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
        response.status(200).send([]);
      } else response.status(200).send(data);
    });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get('/getAssignmentsBasic/query', async (request, response) => {
  try {
    AssignmentModel.find(
      { _id: request.query.ObjectId },
    ).select('title module descr start end skeletonCode').setOptions(
      getOption,
    ).exec()
      .then((data) => {
        if (!data) {
          response.status(200).send([]);
        } else response.status(200).send(data);
      });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get('/getAssignmentsStartEnd/query', async (request, response) => {
  try {
    AssignmentModel.find(
      { _id: request.query.ObjectId },
    ).select('module start end').setOptions(
      getOption,
    ).exec()
      .then((data) => {
        if (!data) {
          response.status(200).send([]);
        } else response.status(200).send(data);
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

app.post('/assignments/add', async (request, response) => {
  const {
    title,
    module,
    descr,
    start,
    end,
    solution,
    testCase,
    methodName,
    skeletonCode,
  } = request.body[0];
  const newAssignment = new AssignmentModel({
    title,
    module,
    descr,
    start,
    end,
    solution,
    testCase,
    methodName,
    skeletonCode,
  });
  await newAssignment.save().then(
    (savedDoc:any) => { response.status(200).send(savedDoc); },
  ).catch(
    (error:any) => { response.status(500).send(error); },
  );
});

app.get('/modules', async (request, response) => {
  try {
    UserModel.find().exec().then((data) => {
      if (!data) {
        response.status(404).send([]);
      } else response.status(200).send(data);
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
        response.status(200).send([]);
      } else response.status(200).send(data);
    });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get('/users/:id', async (request, response) => {
  try {
    UserModel.find(
      { _id: request.params.id },
    ).setOptions(
      getOption,
    ).exec().then((data) => {
      if (!data) {
        response.status(200).send([]);
      } else response.status(200).send(data);
    });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get('/getUsersFromName/:username', async (request, response) => {
  try {
    UserModel.find(
      { username: request.params.username },
    ).setOptions(
      getOption,
    ).exec().then((data) => {
      if (!data) {
        response.status(200).send([]);
      } else response.status(200).send(data);
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
        response.status(200).send([]);
      } else response.status(200).send(data);
    });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get('/terms', async (request, response) => {
  try {
    TermModel.find({}).sort({ year: -1 }).exec().then((data) => {
      if (!data) {
        response.status(200).send([]);
      } else response.status(200).send(data);
    });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post('/terms/add', async (request, response) => {
  const {
    year,
    term,
    startdate,
    enddate,
  } = request.body[0];
  const newTerm = new TermModel({
    year,
    term,
    startdate,
    enddate,
  });
  await newTerm.save().then(
    (savedDoc:any) => { response.status(200).send(savedDoc); },
  ).catch(
    (error:any) => { response.status(500).send(error); },
  );
});

app.get('/getAllModules', async (request, response) => {
  try {
    ModuleModel.find({}).sort({ moduleId: 1 }).setOptions(
      getOption,
    ).exec()
      .then((data) => {
        if (!data) {
          response.status(200).send([]);
        } else response.status(200).send(data);
      });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get('/terms/query', async (request, response) => {
  try {
    TermModel.find(
      { _id: request.query.ObjectId },
    ).setOptions(
      getOption,
    ).exec().then((data) => {
      if (!data) {
        response.status(200).send([]);
      } else response.status(200).send(data);
    });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get('/submissions/queryByUserAssignment', async (request, response) => {
  try {
    SubmissionModel.find(
      {
        userKey: request.query.userKey,
        assignmentId: request.query.assignmentId,
      },
    ).sort({ lastUpdateDtm: -1 }).setOptions(
      getOption,
    ).exec()
      .then((data) => {
        if (!data) {
          response.status(200).send([]);
        } else response.status(200).send(data);
      });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get('/submissions/queryByUser', async (request, response) => {
  try {
    SubmissionModel.find(
      {
        userKey: request.query.userKey,
      },
    ).setOptions(
      getOption,
    ).exec()
      .then((data) => {
        if (!data) {
          response.status(200).send([]);
        } else response.status(200).send(data);
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
          response.status(200).send([]);
        } else response.status(200).send(data);
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
        } else response.status(200).send(data);
      });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post('/submissions/add', async (request, response) => {
  const { assignmentId, userKey, programCode } = request.body[0];
  const newSubmission = new SubmissionModel({
    assignmentId,
    userKey,
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
    userKey,
    status,
    score,
    programCode,
    graderXML,
    graderReport,
    compileError,
  } = request.body;
  const contentToBeUpdated: any = {
    assignmentId,
    userKey,
    status,
    score,
    programCode,
    graderXML,
    graderReport,
    compileError,
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
    submission,
    testCase,
  } = request.body;
  const { userKey, assignmentId, programCode } = submission;
  // Assignment given from front-end does not capture solution and method name
  // thus get the full version of assignment document first
  AssignmentModel.find(
    { _id: assignmentId },
  ).setOptions(
    getOption,
  ).exec()
    .then(async (data) => {
      const { solution, methodName } = data[0];
      const userArgumentsArray = testCase.split(',');
      const userPath = `${process.env.TESTER_ASSIGNMENT_FOLDER}/${assignmentId}/${userKey}`;
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
        // create folder and copy core java to user folder. Unique folder per assignment per user
        const { stderr: abnormalError } = await execPromise(`${cmd1ChangeDir}&&${cmd2CreateFolder}&&${cmd3CopyTestCoreJava}`);
        if (abnormalError.length === 0) {
          fs.writeFileSync(`${process.env.TESTER_PATH}/${userPath}/${process.env.SUBMISSION_CLASS}.java`, programCode);
          fs.writeFileSync(`${process.env.TESTER_PATH}/${userPath}/${process.env.SOLUTION_CLASS}.java`, solution);
        } else {
          response.status(500).send({ abnormalError });
        }
        // compile and run
        const { stdout, stderr } = await execPromise(`
          ${cmd1ChangeDir}/${userPath}&&
          ${cmd6CompileSolution}&&
          ${cmd7CompileSubmission}&&
          ${cmd8CompileCore}&&
          ${cmd9RunTest}`);
        response.status(200).send({ stdout, stderr });
      } catch (error:any) {
        const { stdout, stderr } = error;
        response.status(200).send({ stdout, stderr });
      }
    });
});

app.post('/runAutoMarker', async (request, response) => {
  const { submission } = request.body;
  const { _id } = submission;
  // get submission document first
  SubmissionModel.find(
    { _id },
  ).setOptions(
    getOption,
  ).exec()
    .then(async (submissionData) => {
      const {
        assignmentId,
        userKey,
        programCode,
      } = submissionData[0];
      AssignmentModel.find(
        { _id: assignmentId },
      ).setOptions(
        getOption,
      ).exec()
        .then(async (assignmentData) => {
          const { solution, testCase } = assignmentData[0];
          const userPath = `${process.env.AUTOMARKER_ASSIGNMENT_FOLDER}/${assignmentId}/${userKey}`;
          const output = `${userPath}/${process.env.AUTOMARKER_OUTPUT_FOLDER}`;
          const runTestArgs = '--scan-class-path';
          const runReport = `--reports-dir ${output}/${process.env.AUTOMARKER_REPORT_FOLDER}`;
          const cmd1ChangeDir = `cd ${process.env.AUTOMARKER_PATH}`;
          const cmd2CreateFolder = `mkdir -p ${userPath}`;
          // step 3, 4, 5 should be writing the Solution.java, Submission.java, Tester.java
          const cmd6CompileSolution = `javac -d ${output} ${userPath}/${process.env.SOLUTION_CLASS}.java`;
          const cmd7CompileSubmission = `javac -d ${output} ${userPath}/${process.env.SUBMISSION_CLASS}.java`;
          const cmd8CompileUnitTest = `javac -d ${output} -cp ${output}:${process.env.AUTOMARKER_LIBRARY_PATH}/${process.env.AUTOMARKER_LIBRARY} ${userPath}/${process.env.TESTER_CLASS}.java`;
          const cmd9RunUnitTest = `java -jar ${process.env.AUTOMARKER_LIBRARY_PATH}/${process.env.AUTOMARKER_LIBRARY} --class-path ${output} ${runTestArgs} ${runReport}`;
          const execPromise = promisify(exec);
          let stdout:any;
          let stderr:any;
          let continueTesting:boolean = true;
          try {
            // create assignment user folder
            await execPromise(`${cmd1ChangeDir}&&${cmd2CreateFolder}`);
            fs.writeFileSync(`${process.env.AUTOMARKER_PATH}/${userPath}/${process.env.SUBMISSION_CLASS}.java`, programCode);
            fs.writeFileSync(`${process.env.AUTOMARKER_PATH}/${userPath}/${process.env.SOLUTION_CLASS}.java`, solution);
            fs.writeFileSync(`${process.env.AUTOMARKER_PATH}/${userPath}/${process.env.TESTER_CLASS}.java`, testCase);
            // compile Solution java
            await execPromise(`
            ${cmd1ChangeDir}&&
            ${cmd6CompileSolution}`);
          } catch (error) {
            response.status(500).send(error);
          }

          try {
            // try compile submission, cannot compile is considered a fail with 0 marks
            await execPromise(`
            ${cmd1ChangeDir}&&
            ${cmd7CompileSubmission}`);
          } catch (error:any) {
            stdout = error.stdout;
            stderr = error.stderr;
            const contentToBeUpdated: any = {
              score: '0',
              graderXML: {},
              status: 'Graded',
              lastUpdateDtm: new Date(),
              compileError: error.stderr,
            };
            await SubmissionModel.findByIdAndUpdate(_id, contentToBeUpdated).then(
              () => {
                response.status(200).send({ stdout, stderr });
                continueTesting = false;
              },
            ).catch(
              (updateError:any) => { response.status(500).send(updateError); },
            );
          }

          if (continueTesting) {
            try {
              // compile JUnit Unit test java
              await execPromise(`
              ${cmd1ChangeDir}&&
              ${cmd8CompileUnitTest}`);
            } catch (error:any) {
              response.status(500).send(error);
            }

            try {
              // Run Unit Test
              const { stdout: runOut, stderr: runErr } = await execPromise(`
              ${cmd1ChangeDir}&&
              ${cmd9RunUnitTest}`);
              stdout = runOut;
              stderr = runErr;
            } catch (error:any) {
              // Failing any test cases result in Status Code 1, thus is caught by the catch block
              stdout = error.stdout;
              stderr = error.stderr;
            } finally {
            // read report xml
              const xmlReport = fs.readFileSync(`${process.env.AUTOMARKER_PATH}/${output}/${process.env.AUTOMARKER_REPORT_FOLDER}/${process.env.AUTOMARKER_REPORT}`, 'utf8');
              const parser = new xml2js.Parser();
              let status:string = '';
              let score:String = '';
              parser.parseString((xmlReport), (error, result) => {
                if (error) {
                  status = 'ErrorInParsing';
                  score = '0';
                }
                const totalTest:any = result.testsuite.$.tests;
                const skippedTest:any = result.testsuite.$.skipped;
                const failedTest:any = result.testsuite.$.failures;
                const errorTest:any = result.testsuite.$.errors;
                const successTest:any = totalTest - skippedTest - failedTest - errorTest;
                score = ((successTest / totalTest) * 100).toFixed(2);
                status = 'Graded';
              });
              const contentToBeUpdated: any = {
                score,
                graderXML: xmlReport,
                status,
                lastUpdateDtm: new Date(),
                compileError: '',
              };
              await SubmissionModel.findByIdAndUpdate(_id, contentToBeUpdated).then(
                () => { response.status(200).send({ stdout, stderr }); },
              ).catch(
                (error:any) => { response.status(500).send(error); },
              );
            }
          }
        });
    });
});

app.get('/getCurrentTime', async (request, response) => {
  try {
    const currDate:Date = new Date();
    response.status(200).send(currDate);
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
