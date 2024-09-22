const express = require('express');
const router = express.Router();
const config = require('../config');
const translations = require('../translations');
const axios = require('axios');

router.get('/', async (req, res) => {
    res.json("success");
});

router.post('/ussd', async (req, res) => {
    try {
        const { sessionId, serviceCode, phoneNumber, text } = req.body;

        // Log the received request
        console.log(`Received request: ${JSON.stringify(req.body)}`);

        if (!sessionId || !serviceCode || !phoneNumber) {
            return res.status(400).send("Missing required fields.");
        }

        let response = '';
        let language = 'en';  // Default language is English
        const textArray = text ? text.split('*') : [];
        const userInput = textArray.length ? textArray[textArray.length - 1] : '';

        // Step 1: Language Selection
        if (text === '') {
            response = `CON ${translations[language].welcome}`;
        } else if (['1', '2', '3'].includes(textArray[0])) {
            // Set language based on user's choice
            switch (textArray[0]) {
                case '1': language = 'en'; break;
                case '2': language = 'rw'; break;
                case '3': language = 'fr'; break;
            }

            // Step 2: Choose between weather and price updates
            if (textArray.length === 1) {
                response = `CON ${translations[language].chooseService}`;
            } 
            // If Weather is chosen
            else if (textArray[1] === '1') {
                if (textArray.length === 2) {
                    response = `CON ${translations[language].enterCountry}`;
                } else if (textArray.length === 3) {
                    response = `CON ${translations[language].enterCity}`;
                } else if (textArray.length === 4) {
                    response = `CON ${translations[language].enterDistrict}`;
                } else if (textArray.length === 5) {
                    const country = textArray[2];
                    const city = textArray[3];
                    const district = userInput;
                    const location = `${city}, ${district}, ${country}`;

                    try {
                        const weather = await getWeather(location);
                        response = `END ${translations[language].weather(location, weather.description, weather.temp)}`;
                    } catch (error) {
                        response = `END ${translations[language].error} ${location}`;
                    }
                }
            } 
            // If Price updates is chosen
            else if (textArray[1] === '2') {
                if (textArray.length === 2) {
                    response = `CON ${translations[language].enterProduct}`;
                } else if (textArray.length === 3) {
                    response = `CON ${translations[language].enterLocation}`;
                } else if (textArray.length === 4) {
                    const product = textArray[2];
                    const district = userInput;

                    try {
                        const markets = await getMarkets(district);
                        let marketOptions = markets.slice(0, 10).map((market, index) => `${index + 1}. ${market}`).join('\n');
                        response = `CON ${translations[language].chooseMarket}\n${marketOptions}`;
                    } catch (error) {
                        response = `END ${translations[language].errorMarkets}`;
                    }
                } else if (textArray.length === 5) {
                    const marketIndex = parseInt(userInput) - 1;
                    const selectedMarket = await getMarkets(textArray[3])[marketIndex];

                    try {
                        const price = await getProductPrice(textArray[2], selectedMarket);
                        response = `END ${translations[language].priceUpdate(textArray[2], selectedMarket, price)}`;
                    } catch (error) {
                        response = `END ${translations[language].errorPrice}`;
                    }
                }
            } else {
                response = `END ${translations[language].invalidOption}`;
            }
        } else {
            response = `END ${translations[language].invalidOption}`;
        }

        // Send response back
        res.set('Content-Type', 'text/plain');
        res.send(response);
    } catch (err) {
        console.error(`Error handling USSD request: ${err.message}`);
        res.status(500).send('Server error.');
    }
});

// Function to get weather for a given location
const getWeather = async (location) => {
    try {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${config.weatherApiKey}&units=metric`;
        const response = await axios.get(url);
        const { weather, main } = response.data;

        return {
            description: weather[0].description,
            temp: main.temp
        };
    } catch (err) {
        console.error(`Error fetching weather: ${err.message}`);
        throw new Error('Weather service error');
    }
};

// Mock API function for getting markets in a district
const getMarkets = async (district) => {
    // You can replace this with a real API call
    return ['Market A', 'Market B', 'Market C', 'Market D', 'Market E', 'Market F', 'Market G', 'Market H', 'Market I', 'Market J'];
};

// Mock API function for getting the price of a product in a market
const getProductPrice = async (product, market) => {
    // You can replace this with a real API call
    return `$${(Math.random() * 100).toFixed(2)}`;
};

module.exports = router; // Exporting the router
