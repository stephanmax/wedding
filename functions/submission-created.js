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
      let body = '';
    
      res.on('data', data => body += data);
    
      res.on('end', () => {
        const {content, sha} = JSON.parse(body)
        const giftsJSON = JSON.parse(Buffer.from(content, 'base64').toString('ascii'))

        const gifts = giftsJSON.geschenke
        const giftIds = data.geschenke

        giftIds.forEach(giftId => {
          const giftIndex = gifts.findIndex(gift => gift.id === giftId)
          gifts[giftIndex] = {
            ...gifts[giftIndex],
            vergeben: true
          }
        })

        const req = Https.request({...options, method: 'PUT'}, res => {
          res.on('end', () => callback(null, {
            statusCode: 200,
            body: gifts
          }))
          res.on('error', callback);
        })

        req.write(JSON.stringify({
          sha,
          content: Buffer.from(JSON.stringify({ geschenke: gifts})).toString('base64'),
          message: `Gifts chosen: ${giftIds}`
        }))
        req.end()
      })
    
      res.on('error', callback);
    });
  }
}
