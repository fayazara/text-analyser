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
                var top10 = sorted.slice(0,10);
                res.send(top10);
            }
        } else throw "No URL Provided"
    } catch (err) {
        res.status(400).send(err)
    }
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
