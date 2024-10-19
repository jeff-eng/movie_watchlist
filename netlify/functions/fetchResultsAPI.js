const handler = async event => {
  try {
    const { searchquery } = event.queryStringParameters;

    const apiKey = process.env.API_KEY;

    if (!searchquery) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing searchquery query parameter' }),
      };
    }

    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchquery}`
    );

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
