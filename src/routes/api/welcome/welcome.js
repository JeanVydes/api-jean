const router = require("express").Router();

router.get('/', async function (req, res) {

        const user = require("../../../database/models/user");
        if(!req.query.token){
            return res.json({
                error: "Need token."
            });
        }

        let findToken = await user.findOne({ token: req.query.token });
        if(!findToken){
            return res.json({
                error: "Invalid token."
            });
        }
    
        if(!req.query.b){
            return res.json({
                error: "Unknown background."
            });
        }
        
        if(!req.query.a){
            return res.json({
                error: "Unknown avatar."
            });
        }

        if(!req.query.c){
            req.query.c === "f1ffff";
        }
        
        /*
        u = username
        c = color
        a = avatar
        b = background
        t = title
        me = members
        */
        let validator_url = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
        let avatar_url = await req.query.a;
        let background = await req.query.b;
        
        if(!avatar_url.match(validator_url)){
            return res.json({
                message: "Invalid avatar url."
            });
        }
        
        if(!background.match(validator_url)){
            return res.json({
                message: "Invalid background url."
            });
        }

        let color = req.query.c;
        if(color){
            let validator_hex = /[0-9A-Fa-f]{6}/g;
            if(!validator_hex.test(color)){
                return res.json({
                    message: "Invalid hex code."
                });
            }
        } else {
            color = "f1f1f1";
        }

        const Canvas = require("canvas");
        const canvas = Canvas.createCanvas(1400, 500);
        const ctx = canvas.getContext("2d");
        const fondo = await Canvas.loadImage(background);
    
        ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
        if(req.query.t){
            let title = req.query.t.replace(/[^a-zA-Z0-9 ]/g, "");
            ctx.font = "85px arial";
            ctx.fillStyle = `#${color}`;
            ctx.fillText(title, canvas.width / 2.8, canvas.height / 2.9);
        }

        if(req.query.u){
            let name = req.query.u.replace(/[^a-zA-Z0-9 ]/g, "");
            let username = name.replace(/discriminator/g, '#');

            ctx.font = "65px arial";
            ctx.fillStyle = `#${color}`;
            ctx.fillText(username, canvas.width / 3, canvas.height / 1.8);
        }

        if(req.query.m){
            let message = req.query.m.replace(/[^a-zA-Z0-9 ]/g, "");
            ctx.font = "50px arial";
            ctx.fillStyle = `#${color}`;
            ctx.fillText(message, canvas.width / 3, canvas.height / 1.3);
        }

        if(req.query.me){
            ctx.font = "35px arial";
            ctx.fillStyle = `#${color}`;
            ctx.fillText(`${members} Members`, canvas.width / 1.2, canvas.height / 1.1);
        }
    
        ctx.beginPath();
        ctx.arc(250, 250, 200, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        
        const avatar = await Canvas.loadImage(avatar_url);
        ctx.drawImage(avatar, 40, 40, 400, 400);

        res.send(canvas.toBuffer());
});

module.exports = router;