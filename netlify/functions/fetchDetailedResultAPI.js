const handler = async event => {
  try {
    const { imdb_id } = event.queryStringParameters;
    const apiKey = process.env.API_KEY;

    if (!imdb_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing imdb_id query parameter' }),
      };
    }

    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdb_id}`
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
