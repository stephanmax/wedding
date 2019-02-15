const Https = require('https')

exports.handler = (event, context, callback) => {
  const {form_name, data} = JSON.parse(event.body).payload
  console.log(context)
  
  if (form_name === 'geschenke') {
    const options = {
      host: 'api.github.com',
      path: 'GET /repos/stephanmax/wedding/contents/geschenke.json',
      headers: {   
        'Authorization': 'Basic ' + new Buffer(`${context.GITHUB_USERNAME}:${context.GITHUB_TOKEN}`).toString('base64')
      }   
   }
   
    https.get(options, res => {
      var body = '';
    
      res.on('data', data => {
        body += data
      });
    
      res.on('end', () => {
        console.log(body);
      })
    
      res.on('error', callback);
    });
  }
}
