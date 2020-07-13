const user = require("../database/models/user");

async function valid(token){
    let findToken = await user.findOne({ token: token });
    if(!findToken){
        return false;
    }
}

module.exports = { valid };