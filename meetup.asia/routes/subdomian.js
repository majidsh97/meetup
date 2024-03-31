"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * GET users listing.
 */
const express = require("express");
const router = express.Router();
router.get('/', (req, res) => {
    res.send(req.subdomains[0]);
});
exports.default = router;
//# sourceMappingURL=subdomian.js.map