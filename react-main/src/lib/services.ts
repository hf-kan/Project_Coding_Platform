import axios from 'axios';
import qs from 'qs';

function getUserRole(username:string, callBack:Function) {
  const output:string[] = [];
  axios.get(`http://localhost:8080/users/${username}`)
    .then((res) => {
      const user = res.data;
      const data = JSON.parse(JSON.stringify(user));
      for (let i = 0; i < data[0].role.length; i += 1) {
        output.push(data[0].role[i]);
      }
      callBack(output);
    });
}

function getStudentModules(username:string, callBack:Function) {
  const output:string[] = [];
  axios.get(`http://localhost:8080/users/${username}`)
    .then((res) => {
      const rawData = res.data;
      const data = JSON.parse(JSON.stringify(rawData));
      for (let i = 0; i < data[0].studentMod.length; i += 1) {
        output.push(data[0].studentMod[i]);
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

export {
  getUserRole,
  getStudentModules,
  getModulesById,
  getTermsById,
  getOneModuleAssignments,
};
