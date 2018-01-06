var mongoose = require('../utils/database.js');
var fs = require('fs');

var Position = mongoose.model('position', {
	company: String,
	position: String,
	salary: String,
	address: String,
	filename: String
})

module.exports = {
	addPosition(company, position, salary, address, filename, cb) {
		var position = new Position({company, position, salary, address, filename});
		position.save(function(err) {
			cb(err);
		})
	},
	getPosition(params, cb) {
		Position.find(params).then((result) => {
			cb(result);
		}).catch(() => {
			cb("error");		
		})
	},
	getPositionByPage(page, size, cb) {
		page = parseInt(page, 10);
		size = parseInt(size, 10);
		Position.find({}).limit(size).skip((page - 1) * size).then((result) => {
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
		Position.findByIdAndRemove(id, (err) => {
			cb(err);
		})
	},
	getPositionById(id, cb) {
		Position.findById(id).then((result) => {
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
		Position.findByIdAndUpdate(id, params).then((result) => {
			cb(result);
		}).catch(() => {
			cb("error")
		})		
	},
	getPositionBySalary(salary, cb){
		Position.find({salary: salary}).then((result) =>{
			cb(result);
		}).catch((err) => {
			cb("error")
		})
	}
} 