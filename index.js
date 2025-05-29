const csv = require('csv-parser');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

// Validate environment variables
if (!process.env.API_KEY) {
  throw new Error('API_KEY is not defined in .env file');
}
if (!process.env.API_URL) {
  throw new Error('API_URL is not defined in .env file');
}

const results = [];
const apiKey = process.env.API_KEY;
const apiUrl = process.env.API_URL;

// 1 minute delay for API rate limit
const delay = () => new Promise(resolve => setTimeout(resolve, 60 * 1000));

// Read the CSV file and store the results in the results array
const readCSV = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream('./users_to_delete.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        if(results[0]?.['MoEngage_ID']) {
          console.log("Starting to delete users");
          resolve();
        } else {
          reject(new Error("Your data is invalid, please check the file. No MoEngage_ID found"));
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Send a request to the API to delete a user
const sendRequest = async (i) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${apiKey}`
      },
      body: JSON.stringify({
        identity_type: 'moengage_id',
        identity_value: results[i]['MoEngage_ID']
      })
    };
    const response = await fetch(apiUrl, options);
    const data = await response.json();
    data.status === 'success' ? console.log(`User ${results[i]['MoEngage_ID']} deleted successfully`) : console.log(`User ${results[i]['MoEngage_ID']} not found or already deleted`);
    // If the API returns a 429 error, wait for 1 minute and try again
    if (data.code === 429) {
      console.log('Rate limit hit, waiting for 1 minute...');
      await delay();
      return sendRequest(i);
    }
  } catch (error) {
    console.error(`Error processing user ${results[i]?.['MoEngage_ID']}:`, error.message);
  }
}

// Delete all users in the results array
const deleteUsers = async () => {
  let count = 0;
  for (let i = 0; i < results.length; i++) {
    count++;
    // 5_000 requests per minute
    if (count === 5_000) {
      console.log('Rate limit approaching, waiting for 1 minute...');
      await delay();
      count = 0;
    }
    await sendRequest(i);
  }
}

// Start the process
const main = async () => {
  try {
    await readCSV();
    await deleteUsers();
    console.log('Process completed!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

main();