const express = require('express')
const axios = require('axios');
const app = express()
const port = 3000
//http://norvig.com/big.txt
app.get('/', async (req, res) => {
    const url = req.query.url
    var frequencyMap = {};

    try {
        if (url) {
            var { data } = await axios.get(url)
            if (data.length === 0 || typeof data === "String") throw "Empty Text file Or not a valid Text file"
            else {
                data.toLowerCase();
                //remove special characters and newline characters
                data = data.replace(/[.*+?^${}()|[\]\\]/g, '');
                data = data.replace(/[\r\n]+/gm, '');
                // //Split the big text into an array to parse the 
                var wordsArray = data.split(" ");

                for (var i = 0; i <= wordsArray.length; i++) {
                    var word = wordsArray[i];
                    if (word != "" || undefined || null) {
                        if (frequencyMap[word] === undefined) {
                            frequencyMap[word] = 1;
                        } else {
                            frequencyMap[word] += 1;
                        }
                    }
                }

                var sorted = [];
                for (var word in frequencyMap) {
                    sorted.push({
                        word,
                        count: frequencyMap[word]
                    })
                }

                sorted.sort((a, b) => {
                    return b.count - a.count;
                })
                var top10 = sorted.slice(0, 10);

                const linksArr = top10.map(x => `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf&lang=en-en&text=${x.word}`);

                const resultArray = await Promise.all(top10.map(async (i) => fetchData(i)));

                res.send(resultArray);
            }
        } else throw "No URL Provided"
    } catch (err) {
        res.status(400).send(err)
    }
})

async function fetchData(item) {
    try {
        const { data } = await axios.get(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf&lang=en-en&text=${item.word}`);
        var synValues = null;
        var posValue = null;
        if (data.def.length && data.hasOwnProperty("def")) {
            if (data.def[0].hasOwnProperty("pos")) {
                posValue = data.def[0].pos;;
                if (data.def[0].hasOwnProperty("tr")) {
                    synValues = getSynonyms(data.def[0].tr)
                }
            }
        }
        return {
            words: item.word,
            count: item.count,
            pos: posValue,
            syn: synValues
        }
    } catch (e) {
        console.log(e)
    }
}

function getSynonyms(arr) {
    var syn = [];
    arr.map(item => {
        if(item.syn)
        syn.push(item.text);
    })
    return syn;
}

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
