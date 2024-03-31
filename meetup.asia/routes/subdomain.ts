/*
 * GET users listing.
 */
import express = require('express');
const subdomain = express();
import { readFile } from 'fs'

subdomain.get('/', (req: express.Request, res: express.Response) => {

    res.send(req.subdomains);
});

export default subdomain;