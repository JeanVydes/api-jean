const { isAuthorized } = require("../../../utils/authorized");

const router = require("express").Router();

router.get("/", isAuthorized, async function(req, res) {
    res.json({
        token: req.user.token
    });
});

module.exports = router;