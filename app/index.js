const generator = require('yeoman-generator').Base;
const dependencies = require('./dependencies');

module.exports = generator.extend({

  initializing: function() {
    this.pkg = require('../package.json');
    this.appname = this.appname.replace(/\s/ig, '-');
    this.main = 'src/index.js';
  },

  prompting: function() {
    // let done = this.async();

    return this.prompt([
      {
        type    : 'input',
        name    : 'name',
        message : 'Your project name',
        default : this.appname
      },
      {
        type    : 'input',
        main    : 'main',
        name    : 'main',
        message : 'The entrypoint to your project',
        default : this.main
      }
    ]).then(answers => {
      this.name = answers.name;
      this.main = answers.main;
    });
  },

  writing: {
    app: function() {
      this.fs.copyTpl(
        this.templatePath('package.tpl.json'),
        this.destinationPath('package.json'),
        { projectName: this.name, main: this.main }
      );
      this.fs.copy(
        this.templatePath('scripts'),
        this.destinationPath('scripts')
      );
      this.fs.copy(
        this.templatePath('.githooks'),
        this.destinationPath('.githooks')
      );
    },

    projectFiles: function() {
      this.fs.copy(
        this.templatePath('static/*'),
        this.destinationRoot()
      );
      this.fs.copy(
        this.templatePath('static/.*'),
        this.destinationRoot()
      )
    }
  },
  install: function() {
    this.npmInstall(dependencies.dev, { 'saveDev': true, 'save': false });
    this.npmInstall(dependencies.dependencies, { 'save': true, 'saveDev': false });
  }
});
