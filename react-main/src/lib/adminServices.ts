import axios from 'axios';

function addNewModule(module:object) {
  axios.post('http://localhost:8080/modules/add', module)
    .then((res) => {
      if (res.status === 200) {
        console.log(res.data);
      } else {
        console.log(`${res.status}: ${res.data}`);
      }
    });
}

function addNewAssignment(assignment:object) {
  axios.post('http://localhost:8080/assignments/add', assignment)
    .then((res) => {
      if (res.status === 200) {
        console.log(res.data);
      } else {
        console.log(`${res.status}: ${res.data}`);
      }
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

export { addNewModule, getAllTerm, getAllModules, addNewAssignment };
