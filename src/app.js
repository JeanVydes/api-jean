const config = require("../config.json");
const express = require("express");
const app = express();
const PORT = config.PORT || 3001;
const session = require("express-session");
const passport = require("passport");
const discordStrategy = require("./strategies/discordstrategy");

const path = require("path");
const fetch = require("node-fetch");

const connectMongoose = require("./database/connect")

//Routes
const authRoute = require("./routes/auth");
const supportRoute = require("./routes/support");
const logoutRoute = require("./routes/logout");
const tokenRoute = require("./routes/api/user/token");

const welcomeRoute = require("./routes/api/welcome/welcome");
const drakeRoute = require("./routes/api/manipulating/drake");
const dipperRoute = require("./routes/api/manipulating/dipper");

const dogRoute = require("./routes/api/animals/dog");
const catRoute = require("./routes/api/animals/cat");
const pandaRoute = require("./routes/api/animals/panda");
const bearRoute = require("./routes/api/animals/bear");
const birdRoute = require("./routes/api/animals/birb");
const parrotRoute = require("./routes/api/animals/parrot");
const penguinRoute = require("./routes/api/animals/penguin");
const lionRoute = require("./routes/api/animals/lion");
const eagleRoute = require("./routes/api/animals/eagle");
const llamaRoute = require("./routes/api/animals/llama"); 
const elephantRoute = require("./routes/api/animals/elephant");
const hummingbirdRoute = require("./routes/api/animals/hummingbird");
const foxRoute = require("./routes/api/animals/fox");

const { isAuthorized } = require("./utils/authorized");

const xuser = require("./database/models/user");

app.use(session({
    secret: "some random secret",
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    resave: true,
    saveUninitialized: false,
    name: "cute cat"
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname + "/views"));

//Passport

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.render("index", {
        id: (req.isAuthenticated() ? `${req.user.id}` : ``),
        username: (req.isAuthenticated() ? `${req.user.username}` : ``),
        avatar: (req.isAuthenticated() ? `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png` : null),
        show: (req.isAuthenticated() ? "block" : "none"),
        showlogin: (req.isAuthenticated() ? "none" : "block"),
    })
});

//Default
app.use("/auth", authRoute);
app.use("/support", supportRoute);
app.use("/logout", logoutRoute);
app.use("/api/token", tokenRoute);

//CDN
app.use('/cdn', express.static(path.join(__dirname, '../cdn')));

//More
app.get("/documentation", (req, res) => {
    res.render("endpoints", {
        id: (req.isAuthenticated() ? `${req.user.id}` : ``),
        username: (req.isAuthenticated() ? `${req.user.username}` : ``),
        avatar: (req.isAuthenticated() ? `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png` : null),
        show: (req.isAuthenticated() ? "block" : "none"),
        showlogin: (req.isAuthenticated() ? "none" : "block"),
    })
});

app.get("/token", isAuthorized, (req, res) => {
    res.render("me", {
        id: (req.isAuthenticated() ? `${req.user.id}` : ``),
        username: (req.isAuthenticated() ? `${req.user.username}` : ``),
        avatar: (req.isAuthenticated() ? `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png?size=2048` : null),
        show: (req.isAuthenticated() ? "block" : "none"),
        showlogin: (req.isAuthenticated() ? "none" : "block"),
        token: (req.isAuthenticated() ? req.user.token : ``),
        flags: (req.isAuthenticated() ? req.user.flags : 0),
        discriminator: (req.isAuthenticated() ? req.user.discriminator : ``),
        verified: (req.isAuthenticated() ? req.user.verified : false),
        staff: (req.isAuthenticated ? req.user.staff : false),
        developer: (req.isAuthenticated ? req.user.developer : false),
        showtoken: false
    })
});

app.get("/user/:id", async function(req, res) {

    let u = req.params.id;

    let user = await xuser.findOne({ id: u });
    if(!user){
        res.redirect("/unknown-user")
    }

    res.render("user", {
        id: (req.isAuthenticated() ? `${req.user.id}` : ``),
        username: (req.isAuthenticated() ? `${user.username}` : ``),
        avatar: (req.isAuthenticated() ? `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png` : null),
        show: (req.isAuthenticated() ? "block" : "none"),
        showlogin: (req.isAuthenticated() ? "none" : "block"),
        flags: user.flags,
        discriminator: user.discriminator,
        verified: user.verified,
        staff: user.staff,
        developer: user.developer,
        showtoken: false
    })
});

app.get("/wait-what", async function(req, res) {
    res.render("unknown_user", {
        id: (req.isAuthenticated() ? `${req.user.id}` : ``),
        username: (req.isAuthenticated() ? `${req.user.username}` : ``),
        avatar: (req.isAuthenticated() ? `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png` : null),
        show: (req.isAuthenticated() ? "block" : "none"),
        showlogin: (req.isAuthenticated() ? "none" : "block"),
    })
});

app.get("/limbo", async function(req, res) {
    res.render("limbo", {
        id: (req.isAuthenticated() ? `${req.user.id}` : ``),
        username: (req.isAuthenticated() ? `${req.user.username}` : ``),
        avatar: (req.isAuthenticated() ? `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png` : null),
        show: (req.isAuthenticated() ? "block" : "none"),
        showlogin: (req.isAuthenticated() ? "none" : "block"),
    })
});

//API

app.use(`/api/animal/dog`, dogRoute);
app.use(`/api/animal/cat`, catRoute);
app.use(`/api/animal/lion`, lionRoute);
app.use(`/api/animal/panda`, pandaRoute);
app.use(`/api/animal/eagle`, eagleRoute);
app.use(`/api/animal/llama`, llamaRoute);
app.use(`/api/animal/penguin`, penguinRoute);
app.use(`/api/animal/parrot`, parrotRoute);
app.use(`/api/animla/bird`, birdRoute);
app.use(`/api/animal/elephant`, elephantRoute);
app.use(`/api/animal/fox`, foxRoute);
app.use(`/api/animal/hummingbird`, hummingbirdRoute);
app.use(`/api/animal/bear`, bearRoute);

app.use("/api/welcome", welcomeRoute);
app.use("/api/drake", drakeRoute);
app.use("/api/dipper", dipperRoute);


//404
app.use(function(req, res){
    res.status(404).render('limbo', {
        id: (req.isAuthenticated() ? `${req.user.id}` : ``),
        username: (req.isAuthenticated() ? `${req.user.username}` : ``),
        avatar: (req.isAuthenticated() ? `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png` : null),
        show: (req.isAuthenticated() ? "block" : "none"),
        showlogin: (req.isAuthenticated() ? "none" : "block"),
    });
});

app.listen(PORT, () => {
    console.log(`Listen on ${PORT}`)
});
