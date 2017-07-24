const http = require('http');
const createHandler = require('github-webhook-handler');
const bodyParser = require('body-parser');
const githubApi = require('github');
const config = require('./config.json');
const github = githubApi({});
const handler = createHandler({ path: '/', secret: config.secret });

github.authenticate({ type: "oauth", token: config.token });

http.createServer(handleRequest).listen(process.env.PORT || 8095);

function handleRequest(req, res) {
  handler(req, res, err => res.send('error'));
}

handler.on('error', err => console.error(err));
handler.on('issue_comment', event => handleComment(event.payload));

function handleComment(body) {
  if (body.action === 'created') {
    github.issues.editComment({
      owner: body.repository.owner.login,
      repo: body.repository.name,
      id: body.comment.id,
      body: body.comment.body + ' • c •',
    }).catch(e => console.error(e));
  }
}

//const events = require('github-webhook-handler/events');
//Object.keys(events).forEach(e => console.log(e, '=', events[e]));

console.log('started');
