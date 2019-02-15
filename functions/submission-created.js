exports.handler = (event, context, callback) => {
  const body = JSON.parse(event.body).payload
  console.log(body)
}
