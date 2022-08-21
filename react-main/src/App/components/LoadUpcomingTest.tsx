type Test = {
    term: String;
    module: String;
    title: String
    startdt: Date;
    enddt: Date;
}

const test1: Test = {
  term: '2021-2022 Term 1',
  module: 'Software Workshop 1',
  title: 'Week 1: Looping',
  startdt: new Date(2021, 9, 15, 12, 0, 0, 0),
  enddt: new Date(2021, 9, 15, 12, 30, 0, 0),
};

const test2: Test = {
  term: '2021-2022 Term 1',
  module: 'Software Workshop 1',
  title: 'Week 2: Looping 2',
  startdt: new Date(2021, 9, 18, 14, 30, 0, 0),
  enddt: new Date(2021, 9, 18, 14, 45, 0, 0),
};

const test3: Test = {
  term: '2021-2022 Term 1',
  module: 'Software Workshop 2',
  title: 'Week 1: JavaFX',
  startdt: new Date(2021, 9, 12, 11, 30, 0, 0),
  enddt: new Date(2021, 9, 12, 11, 45, 0, 0),
};

const test4: Test = {
  term: '2021-2022 Term 1',
  module: 'Software Workshop 2',
  title: 'Week 2: Socket Programming',
  startdt: new Date(2021, 9, 13, 9, 30, 0, 0),
  enddt: new Date(2021, 9, 13, 9, 45, 0, 0),
};

const retTestArray: Test[] = [test1, test2, test3, test4];
function returnTestArray() {
  return retTestArray;
}

export default returnTestArray;
