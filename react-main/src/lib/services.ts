import axios from 'axios';

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

function getModuleStudent(username:string, callBack:Function) {
  const output:string[] = [];
  axios.get(`http://localhost:8080/student/${username}`)
    .then((res) => {
      const user = res.data;
      const data = JSON.parse(JSON.stringify(user));
      for (let i = 0; i < data[0].role.length; i += 1) {
        output.push(data[0].role[i]);
      }
      callBack(output);
    });
}

export { getUserRole, getModuleStudent };
