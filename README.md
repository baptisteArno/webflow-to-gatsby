<p align="center">
    <img width="500" alt="typescript-starter dark logo" src="https://user-images.githubusercontent.com/16015833/76012954-6e70e380-5f17-11ea-9a17-7c1af3b2cf64.png" style="max-width:100%;">
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/webflow-to-gatsby">
    <img src="https://img.shields.io/npm/v/webflow-to-gatsby.svg" alt="version" />
  </a>
  <a href="https://npmjs.org/package/webflow-to-gatsby">
    <img src="https://img.shields.io/npm/dm/webflow-to-gatsby.svg" alt="downloads" />
  </a>
   <a href="https://packagephobia.now.sh/result?p=webflow-to-gatsby">
    <img src="https://packagephobia.now.sh/badge?p=webflow-to-gatsby" alt="install size" />
  </a>
</p>

<h1 align="center">
    Generate a Gatsby project from Webflow code export
</h1>

## Start Now

Install the Gatsby CLI
```
npm install -g gatsby-cli
```

Run one simple command to install and use the project generator. You'll need [Node](https://nodejs.org/) `v10` or later.

```bash
npx webflow-to-gatsby <WEBFLOW_UNZIPPED_FOLDER> <GATSBY_PROJECT_NAME>
```

This will create a new Gatsby folder ready to use.

## Example

```bash
npx webflow-to-gatsby ./my-webflow-project/ my-new-gatsby-project
cd my-new-gatsby-project
npm run develop
```

Your app is served on `localhost:8000` by default.

## To-Do

- [ ] Test on Windows
- [ ] Handle srcSet
- [ ] Add unit tests
