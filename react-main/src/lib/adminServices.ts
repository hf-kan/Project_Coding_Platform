import axios from 'axios';

function addNewModule(module:object) {
  axios.post('http://localhost:8080/module/add', module)
    .then((res) => {
      if (res.status === 200) {
        console.log('add module OK');
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

export { addNewModule, getAllTerm };
