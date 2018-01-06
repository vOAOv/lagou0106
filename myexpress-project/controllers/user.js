const userModel = require("../models/user.js");
const crypto = require("crypto");

module.exports = {
	register: (req, res) => {
		const { username, password } = req.body;
		const hash = crypto.createHash('sha256');
		
		hash.update(password);//加密

		userModel.findUser({ username: username }, (result) => {
			if (result && result !== "error") {//用户已经存在时
				res.json({
					ret: true,
					data: {
						register: false
					}
				})
			} else {
				userModel.register(username, hash.digest('hex'), (err) => {//开始加密 生成16进制的字符串
					res.json({
						ret: true,
						data: {
							register: !err
						}
					})
				})
			}
		})
	},
	login: (req, res) => {
		const{ username, password } = req.body;
		const hash = crypto.createHash('sha256');

		hash.update(password);

		userModel.findUser({
			username: username,
			password: hash.digest('hex')
		}, (result) => {
			if (result && result !== "error") {
				req.session.username = username;//往session里存数据，后面往cookie里存数据的事你不用管都不帮你弄好了
			}
			res.json({
				ret: true,
				data: {
					login: (result && result !== "error") ? true : false
				}
			})
		})
	},
	isLogin: (req, res) => {
		res.json({
			ret:true,
			data: {
				isLogin:req.session.username ? true : false
			}
		})
	},
	logout: (req, res) => {
		req.session = null,
		res.json({
			ret: true,
			data: {
				logout: true
			}
		})
	},
}