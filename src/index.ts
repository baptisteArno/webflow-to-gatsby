import HTMLtoJSX from 'htmltojsx';
import prettier from 'prettier';
const { exec, spawn } = require('child_process');
import fs from 'fs';
import * as cheerio from 'cheerio';

const main = async () => {
  if (process.argv.length <= 2) {
    console.log(
      'Syntax : webflow-to-gatsby <WEBFLOW UNZIPPED FOLDER> <GATSBY PROJECT NAME>'
    );
    process.exit();
  }
  const webflowFolderPath =
    process.argv[2].charAt(process.argv[2].length - 1) === '/'
      ? process.argv[2].slice(0, -1)
      : process.argv[2];
  const gatsbyProjectName = process.argv[3];
  const returnCode = await createGatsbyProject(gatsbyProjectName);
  if (returnCode != 0) {
    process.exit();
  }
  await transferWebflowFiles(webflowFolderPath, gatsbyProjectName);
  injectIndexFile(webflowFolderPath, gatsbyProjectName);
};

const createGatsbyProject = (projectName: string) => {
  return new Promise(resolve => {
    const gatsbyProjectCreation = spawn('gatsby', [
      'new',
      projectName,
      'https://github.com/gatsbyjs/gatsby-starter-hello-world'
    ]);

    gatsbyProjectCreation.stdout.on('data', data => {
      console.log(`${data}`);
    });

    gatsbyProjectCreation.stderr.on('data', data => {
      console.log(`${data}`);
    });

    gatsbyProjectCreation.on('error', error => {
      console.log(`${error.message}`);
    });
    gatsbyProjectCreation.on('close', code => {
      resolve(code);
    });
  });
};

const transferWebflowFiles = (
  webflowFolderPath: string,
  gatsbyProjectName: string
) => {
  return new Promise((resolve, reject) => {
    exec(
      `cp -r ${webflowFolderPath}/images ${webflowFolderPath}/css ${webflowFolderPath}/fonts ./${gatsbyProjectName}/src/`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(
            `Error when copying folders to gatsby project: ${error.message}`
          );
          reject(error.message);
        }
        if (stderr) {
          console.log(
            `Error when copying folders to gatsby project: ${stderr}`
          );
          reject(stderr);
        }
        console.log('Copied resources.');
        resolve(stdout);
      }
    );
  });
};

const injectIndexFile = (
  webflowFolderPath: string,
  gatsbyProjectName: string
) => {
  const { imageImports, imageVariables, html } = extractImageFiles(
    `${process.cwd()}/${webflowFolderPath}/index.html`
  );
  const output = convertHtmlToJsx(html);
  let formattedJsx = output
    .replace(/(\r\n|\n|\r)/gm, '')
    .split('return (')[1]
    .split(');')[0]
    .replace(/ +(?= )/g, '')
    .split('{/* [if lte IE 9]><![endif] */}')
    .join('');
  formattedJsx = prettier.format(formattedJsx, { parser: 'html' });
  imageVariables.forEach(
    src =>
      (formattedJsx = formattedJsx.replace(
        new RegExp(`src="${src}"`, 'gm'),
        `src={${src}}`
      ))
  );

  const stream = fs.createWriteStream(
    `./${gatsbyProjectName}/src/pages/index.js`
  );
  stream.once('open', () => {
    stream.write('import React from "react"\n');
    stream.write(
      `import '../css/normalize.css'\nimport '../css/webflow.css'\nimport '../css/${
        webflowFolderPath.split('/')[webflowFolderPath.split('/').length - 1]
      }.css'\n`
    );
    imageImports.forEach(imageImport => stream.write(imageImport + '\n'));
    stream.write('export default () => (\n');
    stream.write('<div class="body">');
    stream.write(formattedJsx);
    stream.write('</div>');
    stream.write(')');
    stream.end();
  });
};

const extractImageFiles = (htmlFilePath: string) => {
  const imageImports = [];
  const imageVariables = [];
  const memo = [];
  const $ = cheerio.load(fs.readFileSync(htmlFilePath, 'utf-8'));
  $('img').each(function(
    this: Cheerio,
    _index: number,
    _current: CheerioElement
  ) {
    const src = $(this).attr('src');
    const srcVarName = src
      .split('/')[1]
      .split('.png')[0]
      .replace(/-(\w)/g, g => {
        return g[1].toUpperCase();
      });
    if (!memo.includes(srcVarName)) {
      imageImports.push(`import ${srcVarName} from "../${src}"`);
      imageVariables.push(srcVarName);
      memo.push(srcVarName);
    }
    $(this).attr('src', srcVarName);
    $(this).attr('srcset', '');
  });
  return {
    imageImports,
    imageVariables,
    html: $.html()
  };
};

const convertHtmlToJsx = (html: string) => {
  const converter = new HTMLtoJSX({
    createClass: true,
    outputClassName: 'AwesomeComponent'
  });

  return converter.convert(html.split('</head>')[1]);
};

main().then();
