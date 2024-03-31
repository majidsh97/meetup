/*
 * GET home page.
 */
import express = require('express');
import vhost from 'vhost';
import subdomain from './subdomain';
const router = express.Router();
import * as ejs from 'ejs';
import { readFile } from 'fs'
import { promisify } from 'util'
import { lookup } from 'geoip-lite';

const EN = {
    lang: 'en'
    , dir: 'ltr'
    , title: 'Free Online Video Chat'
    , welcome: 'Welcome to Meetup.asia. We can help you to connect with people around the world and have a free video chat with them. Just click on New Chat and have fun!'
    , meta_description: 'Experience the thrill of meeting new people from around the world with our free online video chat. Connect with strangers, make new friends, and explore different cultures. Join now and start your adventure!'
    , meta_keywords: 'PvP video chat, free online video chat, chat with strangers, meet new people, talk to strangers, video chat rooms, live chat, random chat, face to face chat, virtual meetings, sex chat, video sex chat '
    , nextbtn: 'New Chat'
    , stopbtn: 'Stop'
    , placeholder: 'Type to chat...'
};
const IR = {
    lang: 'FA'
    , dir: 'rtl'
    , title: 'ویدیو چت رایگان'
    , welcome: 'به سایت MeetUp.asia خوش اومدی اینجا میتونی با بقیه مردم چت تصویری داشته باشی. کافیه که روی چت جدید بزنی.'
    , nextbtn: 'چت جدید'
    , stopbtn: 'توقف'
    , placeholder: 'اینجا پیام خود را بنویسید ...'
    , meta_description: 'Experience the thrill of meeting new people from around the world with our free online video chat. Connect with strangers, make new friends, and explore different cultures. Join now and start your adventure!'
    , meta_keywords: 'PvP video chat, free online video chat, chat with strangers, meet new people, talk to strangers, video chat rooms, live chat, random chat, face to face chat, virtual meetings, sex chat, video sex chat '

};

router.get('/', (req: express.Request, res: express.Response, next) => {

    let b;
    if (req.subdomains.length > 0) {
        if (req.subdomains[0] == 'sina') {

            res.writeHead(200, { 'Content-Type': 'text/plain' })

            const p1 = promisify(readFile)('/var/www/html/insta/vpnsub.txt', { encoding: 'utf-8' });
            Promise.all([p1]).then((value) => {

                let t = value[0];

                t = t.replace(/'/g, '');
                t = t.replace(/\[/g, '');
                t = t.replace(/\]/g, '');
                t = t.replace(/\s/g, '');

                let v = t.split(',');
                let a = v.join('\n')
                console.log(a)
                b = Buffer.from(a, 'utf-8').toString('base64');
                res.write(b);

                res.end();
            });
        }
        else { res.redirect('https://meetup.asia'); }


    } else {
        const ip = req.ip //req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('ip:' + ip); // ip address of the user
        console.log(lookup(ip)); // location of the user
        const geo = lookup(ip);
        let indexdict;
        if (geo.country == 'IR')
            indexdict = IR
        else
            indexdict = EN
        res.set({ "Access-Control-Allow-Origin": '*', 'Cache-Control': 'no-cach' })
        if (res.locals.mobile) {
            res.render('m-index', indexdict);

        } else {
            res.render('index', indexdict);
        }

    }




});

export default router;