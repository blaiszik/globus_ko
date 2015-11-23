var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Schema = mongoose.Schema;



var tagSchema = new mongoose.Schema({
  "key":String,
  "value":Schema.Types.Mixed,
  _id:false
})

var groupSchema = new mongoose.Schema({
  owner:{type:String, lowercase:true},
  name:String,
  tag:[tagSchema],
  uri:['String']
  member:[Schema.Types.ObjectId]
});


// userSchema.pre('save', function(next) {
//   var user = this;

//   if (!user.isModified('password')) return next();

//   bcrypt.genSalt(5, function(err, salt) {
//     if (err) return next(err);

//     bcrypt.hash(user.password, salt, null, function(err, hash) {
//       if (err) return next(err);
//       user.password = hash;
//       next();
//     });
//   });
// });


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