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

handler.on('issue_comment', ({ payload }) => {
  console.log('issue_comment');

  if (payload.action === 'created') {
    // github.issues.editComment({
    //   owner: payload.repository.owner.login,
    //   repo: payload.repository.name,
    //   id: payload.comment.id,
    //   body: payload.comment.body + ' • c •',
    // }).catch(e => console.error(e));
    handleBuild(payload, payload.comment.body);
  }
});

handler.on('issues', ({ payload }) => {
  console.log('issues');

  if (payload.action === 'opened') {
    handleBuild(payload, payload.issue.body);
  }
});

handler.on('pull_request', ({ payload }) => {
  console.log('pull_request');

  console.log(payload);
  // if (payload.action === 'opened') {
  //   handleBuild(payload, payload.issue.body);
  // }
});

function handleBuild(payload, text) {
  if (/^\/build\b/m.test(text)) {
    github.issues.createComment({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      number: payload.issue.number,
      body: 'builds: [windows](http://placekitten.com/200/300), [mac](http://placekitten.com/300/300)',
    }).catch(e => console.error(e));
  }
}

const events = require('github-webhook-handler/events');
Object.keys(events).forEach(e => console.log(e, '=', events[e]));

console.log('started');
