var mongoose = require('../utils/database.js');
var fs = require('fs');

var PositionReady = mongoose.model('positionReady', {
	name: String,
	sex: String,
	salary: String,
	level: String,
	filename: String
})

module.exports = {
	addPosition(name, sex, salary, level, filename, cb) {
		var position = new PositionReady({name, sex, salary, level, filename});
		position.save(function(err) {
			cb(err);
		})
	},
	getPosition(params, cb) {
		PositionReady.find(params).then((result) => {
			cb(result);
		}).catch(() => {
			cb("error");		
		})
	},
	getPositionByPage(page, size, cb) {
		page = parseInt(page, 10);
		size = parseInt(size, 10);
		PositionReady.find({}).limit(size).skip((page - 1) * size).then((result) => {
			cb(result);
		}).catch(() => {
			cb("error");
		})
	},
	removeItemById(file, id, cb) {
		if (file !== "1515208552291Image.png") {
			fs.unlink("./public/uploads/" + file, (err) => {
				console.log(err);
			});
		}
		PositionReady.findByIdAndRemove(id, (err) => {
			cb(err);
		})
	},
	getPositionById(id, cb) {
		PositionReady.findById(id).then((result) => {
			cb(result);
		}).catch(() => {
			cb('error')
		})
	},
	updatePositionById(id, params, filename, oldfilename, cb) {
		if (filename !== oldfilename && oldfilename !== "1515208552291Image.png") {
			fs.unlink("./public/uploads/" + oldfilename, (err) => {
				console.log(err);
			});
		}
		PositionReady.findByIdAndUpdate(id, params).then((result) => {
			cb(result);
		}).catch(() => {
			cb("error")
		})
	}
} 