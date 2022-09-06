import axios from 'axios';

const expressServerPath = 'http://localhost:8080';

function addNewModule(module:object, callBack: Function) {
  axios.post(`${expressServerPath}/modules/add`, module)
    .then((res) => {
      callBack(res);
    });
}

function addNewAssignment(assignment:object, callBack: Function) {
  axios.post(`${expressServerPath}/assignments/add`, assignment)
    .then((res) => {
      callBack(res);
    });
}

function getAllTerm(callback: Function) {
  axios.get(`${expressServerPath}/terms`)
    .then((res) => {
      const term = res.data;
      const output = JSON.parse(JSON.stringify(term));
      callback(output);
    });
}

function getAllModules(callback: Function) {
  axios.get(`${expressServerPath}/getAllModules`)
    .then((res) => {
      const term = res.data;
      const output = JSON.parse(JSON.stringify(term));
      callback(output);
    });
}

function addNewTerm(term:object, callBack: Function) {
  axios.post(`${expressServerPath}/terms/add`, term)
    .then((res) => {
      callBack(res);
    });
}

function addNewUser(user:object, callBack: Function) {
  axios.post(`${expressServerPath}/users/add`, user)
    .then((res) => {
      callBack(res);
    });
}

export {
  addNewModule,
  getAllTerm,
  getAllModules,
  addNewAssignment,
  addNewTerm,
  addNewUser,
};
