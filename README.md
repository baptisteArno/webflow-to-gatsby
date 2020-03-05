<img width="500" alt="typescript-starter dark logo" src="https://user-images.githubusercontent.com/16015833/76012954-6e70e380-5f17-11ea-9a17-7c1af3b2cf64.png" style="max-width:100%;">

Generate a Gatsby project from Webflow code export

## Start Now

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
