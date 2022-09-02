import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  assignmentId: {
    type: String,
  },
  userKey: {
    type: String,
  },
  status: {
    type: String,
  },
  score: {
    type: Number,
  },
  programCode: {
    type: Object,
  },
  graderXML: {
    type: Object,
  },
  lastUpdateDtm: {
    type: Date,
  },
});

const submissionModel = mongoose.model('submissions', submissionSchema, 'submissions');

export default submissionModel;
