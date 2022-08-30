import { AxiosResponse } from 'axios';
import { updateSubmission, userTestRun, getUserId } from '../../lib/services';

function testRunSubmission(
  testCase:string,
  assignment:any,
  submission:any,
  callBack:Function,
) {
  const { username } = submission;
  let errorMessage:string = '';
  updateSubmission(submission, (res:AxiosResponse) => {
    if (res.status === 200) {
      getUserId(username, (userId:String) => {
        if (userId.length === 0) {
          callBack('Error retrieving user ID while communicating with databse');
        } else {
          const testObject: any = {
            userId,
            assignment,
            submission,
            testCase,
          };
          userTestRun(testObject, (testRes:AxiosResponse) => {
            const {
              stdout,
              stderr,
              error,
              abnormalError,
            } = testRes.data;
            // error and abnormalError normally should be undefined
            // stderr and stdout are always defined during normal run
            if (error === undefined) {
              if (abnormalError === undefined) {
                if (stderr.length === 0) {
                  callBack(stdout);
                } else { callBack(stderr); }
              } else { callBack(abnormalError); }
            } else { callBack(error); }
          });
        }
      });
    } else {
      errorMessage = `Error ${res.status} ${res.data}`;
      callBack(errorMessage);
    }
  });
}

export default testRunSubmission;
