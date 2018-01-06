var mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/lagou");
mongoose.Promise = global.Promise;//mongoose有时候可能会用到Promise这种语法，但本身有没有内置Promise语法的支持，而node里面没有window却又global，把node里的Promise给mongoose用

module.exports = mongoose;//直接把数据库的连接返回出去