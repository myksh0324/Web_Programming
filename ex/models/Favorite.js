var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    site_id : {type:String, required:true, index:true},
    user_id : {type:String, required:true},

    site_title :{type: String, trim: true, required: true},
    site_SDate : {type: String, trim: true, required: true},
});

var Favorite = mongoose.model('Favorite ', schema);

module.exports = Favorite;