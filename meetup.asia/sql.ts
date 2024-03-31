import { createConnection } from 'mysql';
const mysql_user = { host: 'localhost', user: "Telegram", password: "U42wKYkfxzMb363", database: 'Telegram' };
var conn = createConnection(mysql_user);
conn.connect((err) => {
    if (err) throw err;

});
export { conn, mysql_user };
