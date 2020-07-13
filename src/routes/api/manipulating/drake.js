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
  
        if(!req.query.avatar1){
            return res.json({
                error: "Unknown avatar 1."
            });
        }

        if(!req.query.avatar2){
            return res.json({
                error: "Unknown avatar 2."
            });
        }

        let validator_url = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
        let avatar1 = await req.query.avatar1;
        let avatar2 = await req.query.avatar2;
        
        if(!avatar1.match(validator_url)){
            return res.json({
                error: "1: Invalid avatar url."
            });
        }
        
        if(!avatar2.match(validator_url)){
            return res.json({
                error: "2: Invalid avatar url."
            });
        }

        const Canvas = require("canvas");
        const canvas = Canvas.createCanvas(1000, 1000);
        const ctx = canvas.getContext("2d");
        const fondo = await Canvas.loadImage(`${WEB}/cdn/template/69002185d55aea8b3cd33ea450e217d7.jpg`);
    
        ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        const loadedAvatar1 = await Canvas.loadImage(avatar1);
        ctx.drawImage(loadedAvatar1, 500, 0, 500, 500);

        const loadedAvatar2 = await Canvas.loadImage(avatar2);
        ctx.drawImage(loadedAvatar2, 500, 500, 500, 500);

        res.send(canvas.toBuffer());
});

module.exports = router;