import dotenv from 'dotenv';
dotenv.config();

// Replace the require statement with dynamic import
import express from 'express';
import bodyParser from 'body-parser';
import nodeFetch from 'node-fetch';
import { GrantType, KindeClient } from '@kinde-oss/kinde-nodejs-sdk';

// Correct the path to the isAuthenticated module
import isAuthenticated from './middlewares/isAuthenticated.js';


const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Move the dynamic import outside the async function
const fetch = await import('node-fetch');

const options = {
  domain: process.env.KINDE_DOMAIN,
  clientId: process.env.KINDE_CLIENT_ID,
  clientSecret: process.env.KINDE_CLIENT_SECRET,
  redirectUri: process.env.KINDE_REDIRECT_URI,
  logoutRedirectUri: process.env.KINDE_LOGOUT_REDIRECT_URI || '',
  grantType: GrantType.PKCE,
};

const kindeClient = new KindeClient(options);

app.use(express.static('public'));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/login', kindeClient.login(), (req, res) => {
  return res.redirect('/admin');
});

// ... (other routes)

// New route for fetching and rendering organizations
app.get('/get-organizations', isAuthenticated(kindeClient), async (req, res) => {
  try {
    const accessToken = await kindeClient.getToken(req);

    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };

    const response = await fetch.default(`https://${process.env.BUSINESS_NAME}.kinde.com/api/v1/organizations`, {
      method: 'GET',
      headers: headers,
    });

    const body = await response.json();

    // Check for a successful response (status code 200)
    if (body.code === 'OK' && body.message === 'Success' && body.organizations) {
      const organizations = body.organizations;

      res.render('organizations', {
        user: kindeClient.getUserDetails(req),
        organizations: organizations,
      });
    } else {
      // Handle error or unexpected response
      console.error('Error fetching organizations:', body);
      res.status(500).send('Error fetching organizations');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
});

app.get('/', async (req, res) => {
  const isAuthenticated = await kindeClient.isAuthenticated(req);
  if (isAuthenticated) {
    res.redirect('/admin');
  } else {
    res.render('index', {
      title: 'Hey',
      message: 'Hello there! What would you like to do?',
    });
  }
});

// ... (remaining code)

app.listen(port, () => {
  console.log(`Kinde NodeJS Starter Kit listening on port ${port}!`);
});
