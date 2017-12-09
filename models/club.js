var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//establishes the typical model for a club in the database.
var ClubSchema = new mongoose.Schema({
    
    title: {
        type: String,
        lowercase: true,
        required: true
    },
    clubtype: {
        type: Boolean,
        required: true
    },
    description: {
        type: String,
        required: false,
    },
    secret: {
        type: String,
        required: true
    },
    members: [
        {
            name: {
                 type: String, 
                 required: true
            },
            email: { 
                type: String, 
                required: true
            }
        }
    ],
    events: [
        {
            title: {
                type: String,
                required: true
            },
            description: {
                type: String
            },
            date: {
                type: Date,
                required: true
            },
            creator : {
                name: {
                    type: String,
                    required: true
                },
                email: {
                    type: String,
                    required : true
                }
            },
            checkins: [
                {
                    name: {
                         type: String, 
                         required: true
                    },
                    email: { 
                        type: String, 
                        required: true
                    }
                }
            ]
        }
    ]
});
ClubSchema.pre('save', function(next) {
    var club = this;
    var saltBase = 5;

    if(!club.isModified('secret')) {
        return next();
    }

    bcrypt.genSalt(saltBase, function(err, salt) {
        if (err) {
            return next(err);
        }

        bcrypt.hash(club.secret, salt, null, function(err, hash) {
            if (err) {
                return next(err);
            }
            club.secret = hash;
            next();
        });
    });
});

ClubSchema.methods.compareSecret = function(attempt, cb) {

    bcrypt.compare(attempt, this.secret, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        else {
            cb(null, isMatch)
        }
    });


}

module.exports = mongoose.model('Club', ClubSchema) 