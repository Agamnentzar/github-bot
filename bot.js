const express = require('express');
const bodyParser = require('body-parser');
const githubApi = require('github');
const config = require('./config.json');
const github = githubApi({});

github.authenticate({
  type: "oauth",
  token: config.token,
});

// github.issues.getForRepo({
//   owner: 'Agamnentzar',
//   repo: 'release-test',
// })
//   .then(x => x.data.map(i => i.body))
//   .then(x => console.log(x))
//   .catch(e => console.error(e));

// github.issues.createComment({
//   owner: 'Agamnentzar',
//   repo: 'release-test',
//   number: 1,
//   body: '• c •'
// })
//   .then(x => console.log(x))
//   .catch(e => console.error(e));

const app = express();

app.set('port', process.env.PORT || 8095);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('errorhandler')());

app.get('*', handleRequest);
app.post('*', handleRequest);

app.listen(app.get('port'), () => console.log('Listening on port ' + app.get('port')));

function handleRequest(req, res) {
  console.log('------ request ------');
  console.log('METHOD: ', req.method);
  console.log('PATH: ', req.path);
  console.log('BODY: ', req.body);
  res.send('');
  
  if (req.body.action) {
    handleEvent(req.body);
  }
}

function handleEvent(body) {
  if (body.action === 'created' && body.repository && body.issue && body.comment) {
    github.issues.editComment({
      owner: body.repository.owner.login,
      repo: body.repository.name,
      id: body.comment.id,
      body: body.comment.body + ' • c •',
    }).catch(e => console.error(e));
  }
}
