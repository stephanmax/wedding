const Https = require('https')

exports.handler = (event, context, callback) => {
  const {form_name, data} = JSON.parse(event.body).payload
  const {GITHUB_USERNAME, GITHUB_TOKEN} = process.env
  
  if (form_name === 'geschenke') {
    const options = {
      host: 'api.github.com',
      path: '/repos/stephanmax/wedding/contents/geschenke.json',
      headers: {   
        'Authorization': 'Basic ' + new Buffer(`${GITHUB_USERNAME}:${GITHUB_TOKEN}`).toString('base64'),
        'User-Agent': 'stephanmax'
      }   
   }
   
    Https.get(options, res => {
      var body = '';
    
      res.on('data', data => {
        body += data
      });
    
      res.on('end', () => {
        const {content} = JSON.parse(body)
        console.log(Buffer.from(content, 'base64').toString('ascii'))
      })
    
      res.on('error', callback);
    });
  }
}
