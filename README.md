# grunt-contrib-px2rem

> Automatically converts px to rem and makes websites responsive instantly.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-contrib-px2rem --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-contrib-px2rem');
```

## The "px2rem" task

### Overview
In your project's Gruntfile, add a section named `px2rem` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  px2rem: {
    options: {
      // Task-specific options go here.
    },
    dist: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Usage Examples

#### Default Options
In this example, the default options are used.

```js
grunt.initConfig({
  px2rem: {
    options: {
      base: 16,
      iterations: 150,
      smoothness: 0.075
    },
    dist: {
      src: 'input.css',
      dest: 'output.css'
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
