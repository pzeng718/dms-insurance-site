const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbHandler = require('./db/handler');
const modelResult = require('./data/model_result.json');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to Our Insurance Company Website');
});

app.post('/db', (req, res) => {
    const query = req.body.query;
    dbHandler.executeQuery(query, (err, results) => {
        if (err) {
            res.status(500).send('Query error: ' + err);
            return;
        }
        res.json(results);
    });
});

app.post('/getQuote', (req, res) => {
    let {user, basePrice} = req.body;
    let {data: cityData, priceAmplifier: cityPriceAmplifier} = modelResult.city_ranking;
    let {data: riskData, priceAmplifier: riskPriceAmplifier} = modelResult.risk_ranking;
    let cityRank = cityData.find(ranking => ranking.cityName === user.city);
    if(cityRank){
        basePrice = basePrice * (cityPriceAmplifier + cityRank.rank * (1 - cityPriceAmplifier) / cityData.length);
    }
    let riskRank = riskData.find(ranking => ranking.cityName === user.city);
    if(riskRank){
        basePrice = basePrice * (riskPriceAmplifier - riskRank.rank * (riskPriceAmplifier - 1) / riskData.length);
    }
    basePrice = Math.round(basePrice);

    res.status(200).send({price: basePrice});
});

app.use((req, res, next) => {
    res.status(404).send("The page your are trying to find does not exist.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
