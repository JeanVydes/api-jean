const config = require("../../config.json");
const DiscordStrategy = require("passport-discord").Strategy;
const passport = require("passport");

const mongoose = require("mongoose");
const xuser = require("../database/models/user");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    let existUser = await xuser.findOne({ id: id });

    if(existUser) done(null, existUser);
});

passport.use(new DiscordStrategy({
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    callbackURL: config.CLIENT_REDIRECT,
    scope: ["identify"]
}, async (accessToken, refreshToken, profile, done) => {

    function token() {
        var result           = '';
        var characters       = `${profile.accessToken}12345678910__--`;
        var charactersLength = characters.length;
        for ( var i = 0; i < 50; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }


    try {
        const isUser = await xuser.findOne({ id: profile.id });
        if(isUser){
            if(isUser.avatar !== profile.avatar){
                await xuser.findOneAndUpdate({ id: profile.id }, {$set:{avatar: profile.avatar}})
            }

            if(isUser.username !== profile.username){
                await xuser.findOneAndUpdate({ id: profile.id }, {$set:{username: profile.username}})
            }

            if(isUser.email !== profile.flags){
                await xuser.findOneAndUpdate({ id: profile.id }, {$set:{email: profile.flags}})
            }

            done(null, isUser);
        } else {
            const newUser = new xuser({
                id: profile.id,
                username: profile.username,
                discriminator: profile.discriminator,
                avatar: profile.avatar,
                flags: profile.flags,
                verified: false,
                staff: false,
                token: token()
            });

            let savedU = await newUser.save();
            done(null, savedU);
        }
    } catch(err) {
        console.log(err);
        done(err, null);
    }
}));