exports.handler = async (event, context, callback) => {

  const data = "Hello world";

  // Return a callback witha 200 response and a message.
  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      data: data
    })
  })


}