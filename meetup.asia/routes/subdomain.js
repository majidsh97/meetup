"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * GET users listing.
 */
const express = require("express");
const subdomain = express();
subdomain.get('/', (req, res) => {
    res.send(req.subdomains);
});
exports.default = subdomain;
//# sourceMappingURL=subdomain.js.map