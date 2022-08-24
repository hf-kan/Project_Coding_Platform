import mongoose from 'mongoose';

const ModuleSchema = new mongoose.Schema({
  moduleId: {
    type: String,
  },
  name: {
    type: String,
  },
  term: {
    type: String,
  },
});

const moduleModel = mongoose.model('modules', ModuleSchema, 'modules');

export default moduleModel;
