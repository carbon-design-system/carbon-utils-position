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

workflow "Add issues to project" {
  on = "issues"
  resolves = ["GraphQL query"]
}

action "Filters for GitHub Actions" {
  uses = "actions/bin/filter@4227a6636cb419f91a0d1afb1216ecfab99e433a"
  args = "action 'opened|reopened'"
  secrets = ["GITHUB_TOKEN"]
}

action "GraphQL query" {
  uses = "helaili/github-graphql-action@fb0ce78d56777b082e1a1659faf2b9f5a8832ed3"
  needs = ["Filters for GitHub Actions"]
  secrets = ["GITHUB_TOKEN"]
  args = "--query .github/graphql/add-to-project.yaml"
}

workflow "Publish package" {
  on = "push"
  resolves = [
    "test",
    "filter for master",
    "publish",
  ]
}

action "install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["filter for master"]
  args = "install"
}

action "build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["install"]
  args = "build"
}

action "test" {
  uses = "cal-smith/github-action-npm-browsers@master"
  needs = ["install"]
  args = "test"
  env = {
    CI = "true"
  }
}

action "publish" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["build", "test"]
  args = "publish dist --dry-run"
  secrets = ["GITHUB_TOKEN"]
}

action "filter for master" {
  uses = "actions/bin/filter@4227a6636cb419f91a0d1afb1216ecfab99e433a"
  args = "branch master"
}
