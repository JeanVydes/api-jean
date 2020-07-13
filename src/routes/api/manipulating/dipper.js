const router = require("express").Router();
const { WEB } = require("../../../../config.json");

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

        if(!req.query.avatar){
            return res.json({
                error: "Unknown avatar."
            });
        }

        let validator_url = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
        let avatar = await req.query.avatar;
        
        if(!avatar.match(validator_url)){
            return res.json({
                error: "Invalid avatar url."
            });
        }

        const Canvas = require("canvas");
        const canvas = Canvas.createCanvas(2300, 2500);
        const ctx = canvas.getContext("2d");
        const fondo = await Canvas.loadImage(`${WEB}/cdn/template/69102185d55aea8b3cd33ea450e217d7.jpg`);
    
        ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        const loadedAvatar = await Canvas.loadImage(avatar);
        ctx.rotate(60 / 4 / 180)
        ctx.drawImage(loadedAvatar, 820, 270, 680, 680);

        res.send(canvas.toBuffer());
});

module.exports = router;