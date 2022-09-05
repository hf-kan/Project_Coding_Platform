import axios from 'axios';

function addNewModule(module:object, callBack: Function) {
  axios.post('http://localhost:8080/modules/add', module)
    .then((res) => {
      callBack(res);
    });
}

function addNewAssignment(assignment:object, callBack: Function) {
  axios.post('http://localhost:8080/assignments/add', assignment)
    .then((res) => {
      callBack(res);
    });
}

function getAllTerm(callback: Function) {
  axios.get('http://localhost:8080/terms')
    .then((res) => {
      const term = res.data;
      const output = JSON.parse(JSON.stringify(term));
      callback(output);
    });
}

function getAllModules(callback: Function) {
  axios.get('http://localhost:8080/getAllModules')
    .then((res) => {
      const term = res.data;
      const output = JSON.parse(JSON.stringify(term));
      callback(output);
    });
}

function addNewTerm(term:object, callBack: Function) {
  axios.post('http://localhost:8080/terms/add', term)
    .then((res) => {
      callBack(res);
    });
}

function addNewUser(user:object, callBack: Function) {
  axios.post('http://localhost:8080/users/add', user)
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
