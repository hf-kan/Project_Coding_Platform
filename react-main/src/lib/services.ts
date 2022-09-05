import axios from 'axios';
import qs from 'qs';

function getUserId(username:string, callBack:Function) {
  let output:string;
  axios.get(`http://localhost:8080/getUsersFromName/${username}`)
    .then((res) => {
      const user = res.data;
      const data = JSON.parse(JSON.stringify(user));
      output = data[0]._id;
      callBack(output);
    });
}

function getUserDisplayName(userKey:string, callBack:Function) {
  let output:string;
  axios.get(`http://localhost:8080/users/${userKey}`)
    .then((res) => {
      const user = res.data;
      const data = JSON.parse(JSON.stringify(user));
      output = data[0].name;
      callBack(output);
    });
}

function getUserRole(userKey:string, callBack:Function) {
  const output:string[] = [];
  axios.get(`http://localhost:8080/users/${userKey}`)
    .then((res) => {
      const user = res.data;
      const data = JSON.parse(JSON.stringify(user));
      for (let i = 0; i < data[0].role.length; i += 1) {
        output.push(data[0].role[i]);
      }
      callBack(output);
    });
}

function getUserPersonalInfo(userKey:string, callBack:Function) {
  axios.get(`http://localhost:8080/users/${userKey}`)
    .then((res) => {
      const user = res.data;
      const data = JSON.parse(JSON.stringify(user));
      const output = {
        id: data[0]._id,
        username: data[0].username,
        name: data[0].name,
        userId: data[0].userId,
      };
      callBack(output);
    });
}

function getStudentModules(userKey:string, callBack:Function) {
  const output:string[] = [];
  axios.get(`http://localhost:8080/users/${userKey}`)
    .then((res) => {
      const rawData = res.data;
      const data = JSON.parse(JSON.stringify(rawData));
      for (let i = 0; i < data[0].studentMod.length; i += 1) {
        output.push(data[0].studentMod[i]);
      }
      callBack(output);
    });
}

function getStudentsByModule(moduleId:string, callBack:Function) {
  const output:any[] = [];
  axios.get('http://localhost:8080/getModuleStudents', {
    params: {
      studentMod: moduleId,
    },
    paramsSerializer: (params) => qs.stringify(params),
  })
    .then((res) => {
      const rawData = res.data;
      const data = JSON.parse(JSON.stringify(rawData));
      for (let i = 0; i < data.length; i += 1) {
        output.push({
          id: data[i]._id,
          username: data[i].username,
          name: data[i].name,
          userId: data[i].userId,
        });
      }
      callBack(output);
    });
}

function getLecturerModules(userKey:string, callBack:Function) {
  const output:string[] = [];
  axios.get(`http://localhost:8080/users/${userKey}`)
    .then((res) => {
      const rawData = res.data;
      const data = JSON.parse(JSON.stringify(rawData));
      for (let i = 0; i < data[0].lecturerMod.length; i += 1) {
        output.push(data[0].lecturerMod[i]);
      }
      callBack(output);
    });
}

function getModulesById(Id: any[], callBack:Function) {
  axios.get('http://localhost:8080/modules/query', {
    params: {
      ObjectId: Id,
    },
    paramsSerializer: (params) => qs.stringify(params),
  })
    .then((res) => {
      const rawData = res.data;
      const output = JSON.parse(JSON.stringify(rawData));
      callBack(output);
    });
}

function getTermsById(Id: any[], callBack:Function) {
  axios.get('http://localhost:8080/terms/query', {
    params: {
      ObjectId: Id,
    },
    paramsSerializer: (params) => qs.stringify(params),
  })
    .then((res) => {
      const rawData = res.data;
      const output = JSON.parse(JSON.stringify(rawData));
      callBack(output);
    });
}

function getOneModuleAssignments(moduleKey: string, callBack:Function) {
  axios.get(`http://localhost:8080/assignment/module/${moduleKey}`)
    .then((res) => {
      const rawData = res.data;
      const output = JSON.parse(JSON.stringify(rawData));
      callBack(output);
    });
}

function getAssignmentsById(Id: any[], callBack:Function) {
  axios.get('http://localhost:8080/assignments/query', {
    params: {
      ObjectId: Id,
    },
    paramsSerializer: (params) => qs.stringify(params),
  })
    .then((res) => {
      const rawData = res.data;
      const output = JSON.parse(JSON.stringify(rawData));
      callBack(output);
    });
}

function getAssignmentsByIdFiltered(Id: any[], callBack:Function) {
  axios.get('http://localhost:8080/getAssignmentsBasic/query', {
    params: {
      ObjectId: Id,
    },
    paramsSerializer: (params) => qs.stringify(params),
  })
    .then((res) => {
      const rawData = res.data;
      const output = JSON.parse(JSON.stringify(rawData));
      callBack(output);
    });
}

function getAssignmentsStartEnd(Id: any[], callBack:Function) {
  axios.get('http://localhost:8080/getAssignmentsStartEnd/query', {
    params: {
      ObjectId: Id,
    },
    paramsSerializer: (params) => qs.stringify(params),
  })
    .then((res) => {
      const rawData = res.data;
      const output = JSON.parse(JSON.stringify(rawData));
      callBack(output);
    });
}

function getSubmissionsByUserAssignment(userKey: any[], assignmentId: any[], callBack:Function) {
  axios.get('http://localhost:8080/submissions/queryByUserAssignment', {
    params: {
      userKey,
      assignmentId,
    },
    paramsSerializer: (params) => qs.stringify(params),
  })
    .then((res) => {
      const rawData = res.data;
      const output = JSON.parse(JSON.stringify(rawData));
      callBack(output);
    });
}

function getSubmissionsByUser(userKey: any[], callBack:Function) {
  axios.get('http://localhost:8080/submissions/queryByUser', {
    params: {
      userKey,
    },
    paramsSerializer: (params) => qs.stringify(params),
  })
    .then((res) => {
      const rawData = res.data;
      const output = JSON.parse(JSON.stringify(rawData));
      callBack(output);
    });
}

function getSubmissionById(submissionId:string, callBack:Function) {
  axios.get('http://localhost:8080/submissions/getById', {
    params: {
      submissionId,
    },
    paramsSerializer: (params) => qs.stringify(params),
  })
    .then((res) => {
      const rawData = res.data;
      const output = JSON.parse(JSON.stringify(rawData));
      callBack(output);
    });
}

function getSubmissionsByAssignment(assignmentId: any[], callBack:Function) {
  axios.get('http://localhost:8080/submissions/queryByAssignment', {
    params: {
      assignmentId,
    },
    paramsSerializer: (params) => qs.stringify(params),
  })
    .then((res) => {
      const rawData = res.data;
      const output = JSON.parse(JSON.stringify(rawData));
      callBack(output);
    });
}

function addSubmission(submission:any, callBack:Function) {
  axios.post('http://localhost:8080/submissions/add', submission)
    .then((res) => {
      callBack(res);
    });
}

function updateSubmission(submission:any, callBack:Function) {
  axios.patch('http://localhost:8080/submissions/update', submission)
    .then((res) => {
      callBack(res);
    });
}

function submitSubmission(submission:any, callBack:Function) {
  const toBeSubmitted = submission;
  toBeSubmitted.status = 'Submitted';
  toBeSubmitted.compileError = '';
  axios.patch('http://localhost:8080/submissions/update', toBeSubmitted)
    .then((res) => {
      callBack(res);
    });
}

function userTestRun(testObject:any, callBack:Function) {
  axios.post('http://localhost:8080/testRun', testObject)
    .then((res) => {
      callBack(res);
    });
}

function runAutoMarker(submission:any, callBack:Function) {
  const submissionObject:any = { submission };
  axios.post('http://localhost:8080/runAutoMarker', submissionObject)
    .then((res) => {
      callBack(res);
    });
}

function getCurrentDateTime(callBack:Function) {
  axios.get('http://localhost:8080/getCurrentTime')
    .then((res) => {
      const curDate:Date = res.data;
      callBack(curDate);
    });
}

export {
  getUserId,
  getUserDisplayName,
  getUserRole,
  getUserPersonalInfo,
  getStudentsByModule,
  getStudentModules,
  getLecturerModules,
  getModulesById,
  getTermsById,
  getOneModuleAssignments,
  getAssignmentsById,
  getAssignmentsByIdFiltered,
  getAssignmentsStartEnd,
  getSubmissionsByUser,
  getSubmissionsByUserAssignment,
  getSubmissionsByAssignment,
  getSubmissionById,
  addSubmission,
  updateSubmission,
  submitSubmission,
  userTestRun,
  runAutoMarker,
  getCurrentDateTime,
};
