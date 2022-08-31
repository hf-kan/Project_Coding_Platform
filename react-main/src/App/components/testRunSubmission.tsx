import { AxiosResponse } from 'axios';
import { updateSubmission, userTestRun } from '../../lib/services';

function testRunSubmission(
  testCase:string,
  submission:any,
  callBack:Function,
) {
  let errorMessage:string = '';
  updateSubmission(submission, (res:AxiosResponse) => {
    if (res.status === 200) {
      const testObject: any = {
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
    } else {
      errorMessage = `Error ${res.status} ${res.data}`;
      callBack(errorMessage);
    }
  });
}

export default testRunSubmission;
