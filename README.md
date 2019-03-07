# klasa-docs-bot

[![Build Status](https://dev.azure.com/dirigeants/klasa/_apis/build/status/dirigeants.klasa-docs-bot?branchName=master)](https://dev.azure.com/dirigeants/klasa/_build/latest?definitionId=2&branchName=master)

klasa-docs-bot is a super simple docs bot for your Discord Server! It allows you to check Klasa pull requests or issues as well as get documentation strings right in your Discord server!

*While this was specifically coded for the [Klasa docs.json](https://github.com/dirigeants/klasa/tree/docs), it might work for other styles of docs.json. If you are using [Klasas DocsGen](https://github.com/dirigeants/docsgen) it will always work.*

## How to run

Make sure you have at least node.js 10.8.0!

First, install the modules:

```bash
npm i
# Or for our yarn peeps
yarn
```

Then, drop your token in the config.mjs file, and run

```bash
npm run start
# Or
node --experimental-modules .
```

If you have any issues, please feel free to leave them here or join our Discord Server. The link is on the [Klasa Website](https://klasa.js.org)
