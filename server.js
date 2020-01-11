const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = 'cache';

const app = express();

app.get('/api/search', (req, res) => {
    const query = (req.query.query).trim();
    let result = {};
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=parse&format=json&section=0&page=${query}`;
    fs.readdir(`${path}/${query}`, (err, items) => {
        if (err) {
            fs.mkdir(`${path}/${query}`, () => {
                axios.get(searchUrl)
                    .then((response) => {
                        const responseJSON = response.data;
                        fs.writeFileSync(`${path}/${query}/${query}.txt`, JSON.stringify(responseJSON), function (err) {
                            console.log('File is created successfully.');
                        }); 
                        return res.status(200).json({ source: 'Wikipedia API', ...responseJSON, });
                    },
                    (error) => {
                        return res.json(err);
                    })
            });
        } else {
            items.forEach((i) => {
                result = Object.assign(result, JSON.parse(fs.readFileSync(`${path}/${query}/${i}`, "utf8")));
            })
            return res.status(200).json({ source: 'Cache API', ...result, });
        }
    })
});

app.listen(3000, () => {
  console.log('Server listening on port: ', 3000);
});