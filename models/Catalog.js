var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Schema = mongoose.Schema;


var tagSchema = new mongoose.Schema({
  "key":String,
  "value":Schema.Types.Mixed,
  _id:false
})

var koSchema = new mongoose.Schema({
  key:String
  object: Schema.Types.Mixed,
  data: Schema.Types.Mixed,
  tag:[tagSchema],
  uri:['String'],

  
  owner:{type:String, lowercase:true},
  name: String,
  date_created: Date,
  date_updated: Date
});

module.exports = mongoose.model('KO', koSchema);


// var dictionarySchema = new mongoose.Schema({
//   tag:String,
//   type:String,
//   _id:false
// })

// var permissionSchema = new mongoose.Schema({
//   user:String,
//   permission:String,
//   _id:false
// })

// var dataobjectSchema = new Schema();
// dataobjectSchema.add({
//   name:String,
//   uri: [String],
//   tag:[tagSchema],
//   dataset: [dataobjectSchema],
//   data: Schema.Types.Mixed,
//   date_created: Date,
//   date_updated: Date
// });