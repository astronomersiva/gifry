require('dotenv').load();

const request = require('request');
const { promisify } = require('util');
const requestPromisified = promisify(request);

const { env } = process;

module.exports = async function(query) {
  let options = {
    method: 'GET',
    url: 'https://api.giphy.com/v1/gifs/translate',
    qs:  {
      api_key: env.api_key,
      s: query
    }
  };
  
  try {
    let response = await requestPromisified(options);
    let parsedResponse = JSON.parse(response.body);
    return parsedResponse.data;
  } catch(e) {
    throw e;
  }
}
