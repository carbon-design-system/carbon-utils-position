workflow "Run tests" {
  resolves = ["GraphQL query"]
  on = "pull_request"
}

action "GraphQL query" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  env = {
    CI = "true"
  }
  args = "test"
}
