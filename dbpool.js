/**
 * 利用mysql模块创建一个连接池
 * 连接库 mtime 供app获取数据
 */

const mysql = require('mysql');

var pool = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'',
    database:'mTime',
    connectionLimit:10
});

module.exports = pool;