"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mysql_user = exports.conn = void 0;
const mysql_1 = require("mysql");
const mysql_user = { host: 'localhost', user: "Telegram", password: "U42wKYkfxzMb363", database: 'Telegram' };
exports.mysql_user = mysql_user;
var conn = (0, mysql_1.createConnection)(mysql_user);
exports.conn = conn;
conn.connect((err) => {
    if (err)
        throw err;
});
//# sourceMappingURL=sql.js.map