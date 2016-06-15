// 端口
exports.port = '3001';

// 博客配置
exports.url = 'http://blog.sina.com.cn/u/1776757314';

// mysql 数据库配置
exports.db = {
    host: '127.0.0.1',
    port: 3306,
    database: 'sina_blog',
    user: 'root',
    password: ''
};

// 定时任务, 每30分钟
exports.cron = '* */30 * * *';