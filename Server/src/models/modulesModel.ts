import mongoose from 'mongoose';
import termSchema from './termModel';

const ModuleSchema = new mongoose.Schema({
  moduleId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  term: {
    type: String,
  },
});

const Module = mongoose.model('Module', ModuleSchema);

export default Module;
