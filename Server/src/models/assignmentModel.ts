import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  module: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  term: {
    type: String,
    required: true,
  },
  descr: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  solution: {
    type: Object,
  },
  testCase: {
    type: Object,
  },
});

const Assignment = mongoose.model('assignment', AssignmentSchema);

export default Assignment;
