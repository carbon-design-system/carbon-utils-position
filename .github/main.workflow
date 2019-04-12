workflow "Run tests" {
  on = "pull_request"
  resolves = [
    "npm build",
    "npm install",
    "npm test",
  ]
}

action "npm install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "npm build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["npm install"]
  args = "build"
}

action "npm test" {
  uses = "cal-smith/github-action-npm-browsers"
  needs = ["npm install"]
  args = "test"
  env = {
    CI = "true"
  }
}
