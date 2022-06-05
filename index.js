const express = require("express")

const ejs = require("ejs");

const path = require("path");

const { parse } = require("path");

const fs = require("fs")



//creating server 
const app = express()
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static('public'));

app.get("/", (req, res, next) => {
    res.render("index");
})

app.get("/search", (req, res, next) => {
    const query = req.query;
    const question = query.question


    // console.log(question)

    k = fs.readFileSync("keywords.txt").toString().split("\n");
    mg = fs.readFileSync("magnitude.txt").toString().split("\n");
    idfs = fs.readFileSync("idf_keywords.txt").toString().split("\n");
    tf_idf = fs.readFileSync("tf_idf.txt").toString().split("\n");
    u = fs.readFileSync("problem_urls.text").toString().split("\n");
    tt = fs.readFileSync("problem_titles.text").toString().split("\n")

    const q = question.toString().split(" ");

    for (let i = 0; i < Object.keys(q).length; i++) {
        q[i] = q[i].toLowerCase();
    }

    qtf = {}

    for (i = 0; i < Object.keys(k).length; i++) {
        k[i] = k[i].slice(0, -1);
    }

    for (i = 0; i < Object.keys(mg).length; i++) {
        mg[i] = mg[i].slice(0, -1);
    }

    for (i = 0; i < Object.keys(idfs).length; i++) {
        idfs[i] = idfs[i].slice(0, -1);
    }

    var ans = new Array(2885).fill(0);

    const s = Object.keys(question).length
    it = 0
    magni = 0;

    for (i = 0; i < 2885; i++) {
        w1 = k[i];
        cnt = 0;
        for (j = 0; j < s; j++) {
            if (w1 === (q[j])) {
                cnt++;
            }
        }
        let t = (((cnt / s) * parseFloat(idfs[i])));
        ans[i] = t;
        magni += t * t;
    }

    magni = Math.sqrt(magni);
    // console.log(qtf);

    const N = 3146
    const M = 2885

    let arr = new Array(N);
    for (var i = 0; i < N; i++) {
        arr[i] = new Array(M).fill(0);
    }
    //  arr[0][0]=1
    for (i = 0; i < 463071; i += 3) {
        a = parseInt(tf_idf[i]);
        b = parseInt(tf_idf[i + 1]);
        c = parseFloat(tf_idf[i + 2]);
        arr[a - 1][b - 1] = c;
    }

    // arrSS => array of similarity scores of questions
    let arrSS = new Array(3146).fill(0);

    for (it = 0; it < 3146; it++) {
        for (i = 0; i + 1 < 2885; i += 2) {
            a1 = parseFloat(ans[i]);
            arrSS[it] += a1 * arr[it][i];
        }
        var mag = parseFloat(mg[it])
        var tr1 = magni * mag;
        arrSS[it] = arrSS[it] / tr1;
    }

    // arrf => array containing score and index of problems 
    let arrf = new Array(N);
    for (var i = 0; i < N; i++) {
        arrf[i] = new Array(2).fill(0);
    }

    for (i = 0; i < 3146; i++) {
        arrf[i][0] = arrSS[i];
        arrf[i][1] = i;
    }


    arrf.sort((a, b) => b[0] - a[0]);

    var arrQ = new Array(41);
    var prob = new Array(41);
    for (i = 0; i < 40; i++) {
        ss = `./allfiles/problem${arrf[i][1] + 1}.txt`;
        // console.log(ss);
        arrQ[i] = fs.readFileSync(ss).toString().split("\n");
        arrQ[i] = arrQ[i].toString();
        arrQ[i] = arrQ[i].slice(0, -1);
        arrQ[i] = arrQ[i].substring(2);
        prob[i] = arrf[i][1];
    }


    setTimeout(() => {
        const arr = [
            {
                title: `${tt[prob[0]]}`,
                url: `${u[prob[0]]}`,
                statement: `${arrQ[0]}`
            },
            {
                title: `${tt[prob[1]]}`,
                url: `${u[prob[1]]}`,
                statement: `${arrQ[1]}`
            },
            {
                title: `${tt[prob[2]]}`,
                url: `${u[prob[2]]}`,
                statement: `${arrQ[2]}`
            },
            {
                title: `${tt[prob[3]]}`,
                url: `${u[prob[3]]}`,
                statement: `${arrQ[3]}`
            },
            {
                title: `${tt[prob[4]]}`,
                url: `${u[prob[4]]}`,
                statement: `${arrQ[4]}`
            },
            {
                title: `${tt[prob[5]]}`,
                url: `${u[prob[5]]}`,
                statement: `${arrQ[5]}`
            },
            {
                title: `${tt[prob[6]]}`,
                url: `${u[prob[6]]}`,
                statement: `${arrQ[6]}`
            },
            {
                title: `${tt[prob[7]]}`,
                url: `${u[prob[7]]}`,
                statement: `${arrQ[7]}`
            },
            {
                title: `${tt[prob[8]]}`,
                url: `${u[prob[8]]}`,
                statement: `${arrQ[8]}`
            },
            {
                title: `${tt[prob[9]]}`,
                url: `${u[prob[9]]}`,
                statement: `${arrQ[9]}`
            },
        ];
        res.json(arr);
    }, 2000)

});


app.listen(PORT, () => {
    // console.log("server is running ")
})
