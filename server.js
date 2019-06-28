const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3008;
const cors = require('cors');
const fetch = require('node-fetch');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//twilio
const twilio = require('twilio');
const { accountSid, authToken } = require('/config');
const client = new twilio(accountSid, authToken)
const { IMGUR_ID } = require('/config');



app.get('/send-text', async (req, res) => {
  const { recipient, textMsg} = req.query;

  client.messages.create({
    body: textMsg,
    to: recipient,
    from: '14159410232'
  })

})

app.get('/comments', async (req, res) => {
  const { id } = req.query;
  
  fetch(`https://api.imgur.com/3/gallery/${id}/comments/best`, {
      headers: {
        "Authorization": 'Client-ID ' + IMGUR_ID,
      }
    })
    .then((result) => 
      result.json()
    )
    .then((comments) => 
      res.json(comments)
    )
})

app.get('/gallery', async (req, res) => {
  fetch(`https://api.imgur.com/3/gallery/hot/time/1?showViral=showViral=true&mature=true&album_previews=false`, {
      headers: {
        "Authorization": 'Client-ID ' + IMGUR_ID,
      }
    })
    .then((imgData) => 
      imgData.json()
    )
    .then((images) => {
      res.json(images);
    })
})

app.get('/test', (req, res) => {
  res.json("HI");
});

const server = app.listen(port, () => {
  console.log(`Starting the server at port ${port}`);
});

module.exports = app;