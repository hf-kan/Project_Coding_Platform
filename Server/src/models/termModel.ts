import mongoose from 'mongoose';

const termSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
  },
  term: {
    type: String,
    required: true,
  },
  startdate: {
    type: Date,
  },
  enddate: {
    type: Date,
  },
});

const Module = mongoose.model('Term', termSchema);

export default Module;
