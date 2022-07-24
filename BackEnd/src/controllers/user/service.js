"use strict";

const { User } = require('../../utils/connect');
const signJWT = require('../../functions/signJWT');
const md5 = require('md5');
const path = require('path');

exports.loginOutput = (req, res) => { res.render("user/login"); }

exports.login = (req, res) => {
    let { email, password } = req.body;
    User.findOne({ where: { email: email }}).then( async (user) => {
        if ( user ) { // email로 찾았다면,
            if ( md5(password) !== user.password ) { // 비밀번호 틀림
                return res.status(405).json({
                    message: "Incorrect password.",
                    code: 405
                });
            }
            else { // 비밀번호 맞음
                let access_token = await signJWT.access({ type: 'JWT', email: user.email });
                let refresh_token = await signJWT.refresh({ type: 'JWT', email: user.email });
                return res.status(200).json({
                    message: "Authorize success.",
                    code: 200,
                    access_token,
                    refresh_token,
                });
            }
        }
        else { // 찾는 유저가 없을때
            return res.status(405).json({
                message: "Unauthorized email.",
                code: 405
            });
        }
    });
}

exports.registerOutput = (req, res) => { res.render("user/register"); }

exports.register = (req, res) => {
    let { email, password, username } = req.body;
    User.findOne({ where: { email: email }}).then(( exist_verify ) => {
        if ( exist_verify ) {
            return res.status(405).json({
                message: "Exist email.",
                code: 405
            });
        }
        else { // 찾는 이메일이 없을 경우 (중복 X)
            if ( email === "" ) {
                return res.status(405).json({
                    message: "Empty id.",
                    code: 405
                });
            }
            else if (password === "") {
                return res.status(405).json({
                    message: "Empty password.",
                    code: 405
                });
            }
            else {
                User.create({
                    username: username,
                    email: email,
                    password: md5(password),
                }).then(() => {
                    res.render("user/login");
                }).catch((err) => {
                    return res.status(500).json({
                        message: err,
                        code: 500
                    });
                });
            }
        }
    });
}

exports.profileOutput = (req, res) => {
    res.sendFile(path.join(__dirname, '../../../../FrontEnd/views/user/profile.html'));
}

exports.profile = async (req, res) => {
    const userinfo = await User.findOne({
        where: { email: req.decoded.email }
    })

    return res.status(200).json({
        message: "User auth success.",
        code: 200,
        data: userinfo
    });
}