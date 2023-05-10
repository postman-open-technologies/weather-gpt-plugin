const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { config } = require('dotenv');
config();

const app = express();
const port = process.env.PORT || 8080;

const apiKey = process.env.WEATHER_API_KEY; // Replace with your Weather API key

const manifestFilePath = path.join(__dirname, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestFilePath, 'utf8'));

// app.get('/.well-known/ai-plugin.json', (req, res) => {
//     res.json(manifest);
// });

// Define the path to the OpenAPI file
const openApiFilePath = path.join(`${__dirname}/api/`, 'openapi.yaml');
const logoFilePath = path.join(__dirname, 'logo.png');

// Add the /.well-known/openapi.yaml route
app.get('/openapi.yaml', (req, res) => {
  fs.readFile(openApiFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading OpenAPI file');
      return;
    }
    res.set('Content-Type', 'text/yaml');
    res.send(data);
  });
});

// Add the /.well-known/openapi.yaml route
app.get('/logo.png', (req, res) => {
    fs.readFile(logoFilePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Error reading app logo file');
        return;
      }
      res.set('Content-Type', 'image/png');
      res.send(data);
    });
  });

// Endpoint to get wind speed, pressure, and humidity, and temperature
app.get('/weather/wind-pressure-humidity/:city', (req, res) => {
  const city = req.params.city;
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  https.get(url, (apiRes) => {
    let data = '';

    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
      const parsedData = JSON.parse(data);
      const result = {
        wind_kph: parsedData.current.wind_kph,
        pressure_mb: parsedData.current.pressure_mb,
        humidity: parsedData.current.humidity,
        temperate_c: parsedData.current.temp_c,
        temperate_f: parsedData.current.temp_f,
        condition: parsedData.current.condition.text,
      };
      res.json(result);
    });
  }).on('error', (err) => {
    res.status(500).send(err.message);
  });
});

// Endpoint to get region and country
app.get('/weather/region-country/:city', (req, res) => {
  const city = req.params.city;
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  https.get(url, (apiRes) => {
    let data = '';

    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
      const parsedData = JSON.parse(data);
      const result = {
        region: parsedData.location.region,
        country: parsedData.location.country,
      };
      res.json(result);
    });
  }).on('error', (err) => {
    res.status(500).send(err.message);
  });
});

// Endpoint to get local time
app.get('/weather/local-time/:city', (req, res) => {
  const city = req.params.city;
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  https.get(url, (apiRes) => {
    let data = '';

    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
      const parsedData = JSON.parse(data);
      const result = {
        localtime: parsedData.location.localtime,
      };
      res.json(result);
    });
  }).on('error', (err) => {
    res.status(500).send(err.message);
  });
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
