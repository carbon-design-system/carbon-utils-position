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
  uses = "cal-smith/github-action-npm-browsers@master"
  needs = ["npm install"]
  args = "test"
  env = {
    CI = "true"
  }
}

workflow "New workflow" {
  resolves = ["Filters for GitHub Actions"]
  on = "issues"
}

action "Filters for GitHub Actions" {
  uses = "actions/bin/filter@4227a6636cb419f91a0d1afb1216ecfab99e433a"
}
