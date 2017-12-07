const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  title: {type: String, trim: true, required: true},
  content: {type: String, trim: true, required: true},
  typeOfEvent: {type: String, trim: true, required: true},
  location: {type: String, trim: true, required: true},  
  name: {type: String, trim: true, required: true},  
  nameDetail: {type: String, trim: true, required: true}, 
  Price: {type: String, trim: true, required: true}, 
  startshour: {type: String, trim: true, required: true}, 
  startsmin: {type: String, trim: true, required: true},
  finishshour: {type: String, trim: true, required: true}, 
  finishsmin: {type: String, trim: true, required: true},  
  SDate: {type: Date, required: true},  
  FDate: {type: Date, required: true},  
  ViewSDate: {type: String, trim: true, required: true},  
  ViewFDate: {type: String, trim: true, required: true},  
  money: {type: String, trim: true, required: true},  
  sector: {type: String, trim: true, required: true},
  tags: [String],
  numLikes: {type: Number, default: 0},
  numAnswers: {type: Number, default: 0},
  numReads: {type: Number, default: 0},
  joinPeople: [String],  
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
schema.plugin(mongoosePaginate);
var Question = mongoose.model('Question', schema);

module.exports = Question;
