const router = require("express").Router();
const passport = require("passport");
const { WEB } = require("../../config.json");

router.get("/", passport.authenticate("discord"));
router.get("/redirect", passport.authenticate("discord", {
    failureRedirect: "/forbideen",
    successRedirect: WEB
})/*, function(req, res) {
    res.send(req.user);
}*/)

module.exports = router;