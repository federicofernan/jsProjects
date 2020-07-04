const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {

    const urlPathName = url.parse(req.url, true).pathname;
    const query = url.parse(req.url, true).query;
    const id = url.parse(req.url, true).query.id;

    //PRODUCT OVERVIEW ROUTE
    if (urlPathName === '/products' || urlPathName === '') {
        res.writeHead(200, {'Content-type': 'text/html'});
        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;

            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
                const cardsOut = laptopData.map(lap => replaceTemplate(data, lap)).join(' ');
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOut);
                res.end(overviewOutput);
            });
        });
    }

    //LAPTOP DETAILS
    else if (urlPathName === '/laptop' && id < laptopData.length) {
        res.writeHead(200, {'Content-type': 'text/html'});
        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
            let laptop = laptopData[id];
            const output = replaceTemplate(data, laptop);
            res.end(output);
        });
    }

    //IMAGES
    else if ((/\.(jpg|jpeg|png|gif)$/i).test(urlPathName)) {
        fs.readFile(`${__dirname}/data/img${urlPathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'image/jpg'});
            res.end(data);
        });
    }

    //URL NOT FOUND - 404
    else {
        res.writeHead(404, {'Content-type': 'text/html'});
        res.end('URL was not found');
    }

});

server.listen(1337, '127.0.0.1', () => {
    console.log('Listening for requests!');
});

function replaceTemplate(originalHtml, laptop) {
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output;
};