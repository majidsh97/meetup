"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * GET home page.
 */
const express = require("express");
const router = express.Router();
const fs_1 = require("fs");
const util_1 = require("util");
const geoip_lite_1 = require("geoip-lite");
const EN = {
    lang: 'en',
    dir: 'ltr',
    title: 'Free Online Video Chat',
    welcome: 'Welcome to Meetup.asia. We can help you to connect with people around the world and have a free video chat with them. Just click on New Chat and have fun!',
    meta_description: 'Experience the thrill of meeting new people from around the world with our free online video chat. Connect with strangers, make new friends, and explore different cultures. Join now and start your adventure!',
    meta_keywords: 'PvP video chat, free online video chat, chat with strangers, meet new people, talk to strangers, video chat rooms, live chat, random chat, face to face chat, virtual meetings, sex chat, video sex chat ',
    nextbtn: 'New Chat',
    stopbtn: 'Stop',
    placeholder: 'Type to chat...'
};
const IR = {
    lang: 'FA',
    dir: 'rtl',
    title: 'ویدیو چت رایگان',
    welcome: 'به سایت MeetUp.asia خوش اومدی اینجا میتونی با بقیه مردم چت تصویری داشته باشی. کافیه که روی چت جدید بزنی.',
    nextbtn: 'چت جدید',
    stopbtn: 'توقف',
    placeholder: 'اینجا پیام خود را بنویسید ...',
    meta_description: 'Experience the thrill of meeting new people from around the world with our free online video chat. Connect with strangers, make new friends, and explore different cultures. Join now and start your adventure!',
    meta_keywords: 'PvP video chat, free online video chat, chat with strangers, meet new people, talk to strangers, video chat rooms, live chat, random chat, face to face chat, virtual meetings, sex chat, video sex chat '
};
router.get('/', (req, res, next) => {
    let b;
    if (req.subdomains.length > 0) {
        if (req.subdomains[0] == 'sina') {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            const p1 = (0, util_1.promisify)(fs_1.readFile)('/var/www/html/insta/vpnsub.txt', { encoding: 'utf-8' });
            Promise.all([p1]).then((value) => {
                let t = value[0];
                t = t.replace(/'/g, '');
                t = t.replace(/\[/g, '');
                t = t.replace(/\]/g, '');
                t = t.replace(/\s/g, '');
                let v = t.split(',');
                let a = v.join('\n');
                console.log(a);
                b = Buffer.from(a, 'utf-8').toString('base64');
                res.write(b);
                res.end();
            });
        }
        else {
            res.redirect('https://meetup.asia');
        }
    }
    else {
        const ip = req.ip; //req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('ip:' + ip); // ip address of the user
        console.log((0, geoip_lite_1.lookup)(ip)); // location of the user
        const geo = (0, geoip_lite_1.lookup)(ip);
        let indexdict;
        if (geo.country == 'IR')
            indexdict = IR;
        else
            indexdict = EN;
        res.set({ "Access-Control-Allow-Origin": '*', 'Cache-Control': 'no-cach' });
        if (res.locals.mobile) {
            res.render('m-index', indexdict);
        }
        else {
            res.render('index', indexdict);
        }
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map