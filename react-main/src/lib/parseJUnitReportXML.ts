import parseJUnitCDATA from './parseJUnitCDATA';

function parseJUnitReportXML(rawReport:string) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(rawReport, 'text/xml');
  const testCases:any[] = [];
  const summaryNode:any = xmlDoc.getElementsByTagName('testsuite')[0];
  const totalTest:any = summaryNode.getAttribute('tests');
  const skippedTest:any = summaryNode.getAttribute('skipped');
  const failedTest:any = summaryNode.getAttribute('failures');
  const errorTest:any = summaryNode.getAttribute('errors');
  const successTest:any = totalTest - skippedTest - failedTest - errorTest;
  const score:string = ((successTest / totalTest) * 100).toFixed(2);

  let i:number = 0;
  let testCaseNode:any = xmlDoc.getElementsByTagName('testcase')[i];

  while (testCaseNode !== undefined) {
    const immediateChild:any = testCaseNode.childNodes[1];
    let status;
    let message;
    let testCaseName;
    let executionTime;
    let displayName:string;
    const countForDisplay = i + 1;
    const firstNodeName = immediateChild.nodeName;
    switch (firstNodeName) {
      case 'failure': {
        const nextChild:any = testCaseNode.childNodes[3];
        const sysOut:string = nextChild.childNodes[0].nodeValue;
        displayName = parseJUnitCDATA(sysOut, 'display-name: ');
        if (displayName === '') {
          displayName = testCaseNode.getAttribute('name');
        }
        status = 'failed';
        message = immediateChild.getAttribute('message');
        testCaseName = displayName;
        executionTime = testCaseNode.getAttribute('time');
        break;
      }
      case 'error': {
        const nextChild:any = testCaseNode.childNodes[3];
        const sysOut:string = nextChild.childNodes[0].nodeValue;
        displayName = parseJUnitCDATA(sysOut, 'display-name: ');
        if (displayName === '') {
          displayName = testCaseNode.getAttribute('name');
        }
        status = 'error';
        message = immediateChild.getAttribute('message');
        testCaseName = displayName;
        executionTime = testCaseNode.getAttribute('time');
        break;
      }
      case 'system-out': {
        const sysOut:string = immediateChild.childNodes[0].nodeValue;
        displayName = parseJUnitCDATA(sysOut, 'display-name: ');
        if (displayName === '') {
          displayName = testCaseNode.getAttribute('name');
        }
        status = 'passed';
        message = '';
        testCaseName = displayName;
        executionTime = testCaseNode.getAttribute('time');
        break;
      }
      default: {
        status = 'unknown';
        message = `Unexpected node in test case result: ${firstNodeName}`;
        testCaseName = testCaseNode.getAttribute('name');
        executionTime = testCaseNode.getAttribute('time');
        break;
      }
    }
    const testCase = {
      key: countForDisplay,
      testCaseName,
      status,
      message,
      executionTime,
    };
    testCases.push(testCase);
    i += 1;
    testCaseNode = xmlDoc.getElementsByTagName('testcase')[i];
  }
  const parsedReport = {
    totalTest,
    skippedTest,
    failedTest,
    errorTest,
    successTest,
    score,
    testCases,
  };
  return parsedReport;
}

export default parseJUnitReportXML;
