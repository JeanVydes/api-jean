const express = require("express").Router();

function isAuthorized(req, res, next){
    if(req.user){
        next();
    } else {
        res.redirect("/auth")
    }
}

module.exports = { isAuthorized }