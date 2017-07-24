const githubApi = require('github');
const config = require('./config.json');
const github = githubApi({});

github.authenticate({
  type: "oauth",
  token: config.token,
});

github.issues.getForRepo({
  owner: 'Agamnentzar',
  repo: 'release-test',
})
  .then(x => x.data.map(i => i.body))
  .then(x => console.log(x))
  .catch(e => console.error(e));

// github.issues.createComment({
//   owner: 'Agamnentzar',
//   repo: 'release-test',
//   number: 1,
//   body: '• c •'
// })
//   .then(x => console.log(x))
//   .catch(e => console.error(e));
