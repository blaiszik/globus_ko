var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Schema = mongoose.Schema;


var tagSchema = new mongoose.Schema({
  "key":String,
  "object":Schema.Types.Mixed,
  _id:false
})

var koSchema = new mongoose.Schema({
  key:String,
  object: Schema.Types.Mixed,
  data: Schema.Types.Mixed,
  data_type: {type:String, default:"ko"},
  tag:[tagSchema],
  uri:['String'],
  owner:{type:String, lowercase:true},
  name: String,
  date_created: Date,
  date_updated: Date
});


koSchema.pre('save', function(next) {
    if (!this.date_created) {
        this.date_created = new Date();
    }

    if (!this.date_updated) {
        this.date_updated = new Date();
    }
    next();
});

module.exports = mongoose.model('KO', koSchema);

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
