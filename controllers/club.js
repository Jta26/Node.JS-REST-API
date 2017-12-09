var Club = require("../models/club");

exports.getClubs = function(req, res, next) {
    Club.find(function(err, clubs) {

        if(err) {
            res.send(err);
        }
        res.json(clubs);
    });
}

exports.createClub = function(req, res, next) {
    var title = req.body.title;
    var clubtype = req.body.clubtype;
    var secret = req.body.secret;
    var description = req.body.description;
    var name = req.body.name;
    var email = req.body.email;

    if (!title) {
        return res.send(422).send({error: "You Must Enter a Club Title"});
    }
    if (!clubtype) {
        return res.send(422).send({error: "You Must Select a Club Type"});
    }
    if (!secret) {
        return res.send(422).send({error: "You Must Enter a Club Secret"});
    }
    if (!description) {
        description =  "";
    }
    if (!name) {
        return res.send(422).send({error: "You Must Enter Your Name"});
    }
    if (!email) {
        return res.send(422).send({error: "You Must Enter Your Email"});
    }

    Club.findOne({title: title}, function(err, clubExists) {
        if (err) {
            res.next(err);
        }

        var club = new Club({
            title: title,
            clubtype: clubtype,
            secret: secret,
            description: description,
            members: {
                name: name,
                email: email
            },
        });

        club.save(function(err, club) {
            if (err) {
                return next(err);
            }
            res.status(201).json({msg: "Club Added Successfully"});
        });
    });
}

exports.deleteClub = function(req, res, next) {

    Club.remove( {
        _id: req.params._id
    }, function(err, club) {
        res.json({msg: "Club Removed"});
    });
}

exports.addMember = function(req, res, next) {
    var member = req.body.name;
    var email = req.body.email;

    if (!member) {
        return res.json({err: "Please Enter a Name for the Member"});
    }
    if (!email) {
        return res.json({err: "Please Enter an Email for the Member"});
    }
    Club.findByIdAndUpdate({_id: req.params._id}, 
        {$push : {members: 
            {   
                name: member, 
                email: email
            }
        }
    }, function(err, existingClub) {
        res.json({msg: "Member Added Successfully"});
    });
}

exports.removeMember = function(req, res, next) {
    var email = req.body.email;

    if(!email) {
        return res.json({err: "Please Enter an Email for the Member"});
    }
    Club.findByIdAndUpdate({_id: req.params._id}, 
        {$pull : {members: 
            {   
                email: email
            }
        }
    }, function(err, existingClub) {
        res.json({msg: "Member Removed Successfully"});
    });

}

exports.addevent = function(req, res, next) {

}