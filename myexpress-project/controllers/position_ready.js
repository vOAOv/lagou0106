const positionModel = require("../models/position_ready.js");

module.exports = {
	addPositionReady(req, res) {
		const { name, sex , salary, level, file } = req.body;//post请求
		const filename = req.file ? req.file.filename : "";
		positionModel.addPosition(name, sex , salary, level, filename, (err) => {
			res.json({
				ret: true,
				data: {
					inserted: !err
				}
			})
		})
	},
	getPositionListReady(req, res) {
		const{ page, size } = req.query;
		let totalPage = 0;
		positionModel.getPosition({}, (result) => {
			if (result && result !== "error") {
				totalPage = Math.ceil(result.length / size);
				positionModel.getPositionByPage(page, size , (result) => {
					res.json({
						ret: true,
						data: {
							list: result,
							totalPage: totalPage
						}
					})
				})
			}
		})
	},
	getPositionReady(req, res) {
		oldfilename = req.query.oldfilename
		positionModel.getPositionById(req.query.id, (result) => {
			res.json({
				ret: true,
				data: {
					info: (result && result !== "error") ? result : false
				}
			})
		})
	},
	removePositionReady(req, res) {
		console.log(req.query)
		positionModel.removeItemById(req.query.file, req.query.id, (err) => {
			res.json({
				ret: true,
				data: {
					delete: !err
				}	
			})			
		})
	},
	updatePositionReady(req, res) {
		const {name, sex, salary, level, id} = req.body;
		const params = {
			name,
			sex,
			salary,
			level
		}
		if (req.file && req.file.filename) {
			params.filename = req.file.filename
		}
		positionModel.updatePositionById(id, params, params.filename, oldfilename, (result) => {
			res.json({
				ret: true,
				data: {
					update: (result && result !== "error") ? true : false
				}
			})
		})
	} 
}