module.exports.forgotPass = (req, res, next) => {
    if(!req.body.email){
        res.json({
            code : 400,
            massage : "vui long nhap email"
        })
        return;
    }
    next();
}

module.exports.resetPasswordPost = async (req, res, next) => {
    if(!req.body.password){
        res.json({
            code : 400,
            massage : "cậu quên nhập mẩu khẩu rùi"
        });
        return;
    }

    if(!req.body.confirmPassword){
        res.json({
            code : 400,
            massage: "Ní ơi nhập thêm cái nì đi ní"
        })
        return;
    }

    if(req.body.confirmPassword  !== req.body.password){
        res.json({
            code : 400,
            massage: "Không kop mk:)))"
        });
    }
    next();
}