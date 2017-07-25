const http = require('http');
const createHandler = require('github-webhook-handler');
const bodyParser = require('body-parser');
const githubApi = require('github');
const config = require('./config.json');
const github = githubApi({});
const handler = createHandler({ path: '/', secret: config.secret });

github.authenticate({ type: "oauth", token: config.token });

http
  .createServer((req, res) => handler(req, res, err => res.send('error')))
  .listen(process.env.PORT || 8095);

handler.on('error', err => console.error(err));

handler.on('issue_comment', ({ body }) => {
  if (body.action === 'created') {
    // github.issues.editComment({
    //   owner: body.repository.owner.login,
    //   repo: body.repository.name,
    //   id: body.comment.id,
    //   body: body.comment.body + ' • c •',
    // }).catch(e => console.error(e));
    handleBuild(body, body.comment.body);
  }
});

handler.on('issues', ({ body }) => {
  if (body.action === 'opened') {
    handleBuild(body, body.issue.body);
  }
});

handler.on('pull_request', ({ body }) => {
  console.log(body);
  // if (body.action === 'opened') {
  //   handleBuild(body, body.issue.body);
  // }
});

function handleBuild(body, text) {
  if (/^\/build\b/m.test(text)) {
    github.issues.createComment({
      owner: body.repository.owner.login,
      repo: body.repository.name,
      number: body.issue.number,
      body: 'builds: [windows](http://placekitten.com/200/300), [mac](http://placekitten.com/300/300)',
    }).catch(e => console.error(e));
  }
}

const events = require('github-webhook-handler/events');
Object.keys(events).forEach(e => console.log(e, '=', events[e]));

console.log('started');
