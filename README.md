Loading angular components with requirejs
==========

Ther are 7 plugins for loading angularjs components:

- module
- template
- controller
- service
- directive
- config
- filter

The goals: 
 
 - Add module support to application. Module - means not ng module but something like "namespace" for controllers, directives, filters, templates etc
 - Reduce code dependecy on application structure and module's names


#### Module 

File that return ngModule

```javascript
define(function(require){
    var ng = requrie('angular');

    return ng.module('foo', []);
})
```

#### Template

This plugin depends on requirejs text plugin. Used for loading templates

#### Controller / Service / Directive / Filter / Config

Similar goal - load components


Examples
========

For example we have application with such structure:

    app
       |-modules
       |       |-menu
       |       |    |-controller
       |       |    |           |-menu-controller.js
       |       |    |-menu.js    
       |       |-user
       |             |-controllers
       |             |           |-user-controller.js
       |             |-resources
       |             |          |-templates
       |             |          |       |-user-profile.html
       |             |          |-directives
       |             |                   |-user-menu 
       |             |                              |-user-menu.js
       |             |                              |-user-menu.html
       |             |-src
       |             |      |-providers
       |             |      |          |-profile-information.js 
       |             |      |-factory
       |             |              |-guest.js
       |             |-user.js
       |-application.js
       |-boot.js


We want to include **menu** ng module (/app/modules/menu/menu) in file:
 
  - **/app/application.js**  -  `require('module!user')`
  - **/app/modules/user.js**  -  `require('module!user')` 
  - **/app/modules/menu/menu-controller.js**  -  `require('module!@')`. @ - say to load current module that could be detected from path of the current file.
  
We want to include **user-controller** (/app/modules/user/controllers/user-controller) in file:
 
  - **/app/application.js**  -  `require('controller!user:user-controller')`. Before **:** - module name, after - controller name.
  - **/app/modules/user.js** -  `require('controller!user:user-controller')`
  - **/app/modules/user/user.js**  -  `require('controller!user-controller')`. So if you want to load controller from current module (current module I mean module under which current file is located) - you could write only controller file name. Module will be detected from current path.
  

Same for **directives**, **services**, **templates**, **filters**, **configs**.
  

Configuration
========

Plugins should be configured using placeholders in requirejs.config({...}) under structure key. 

```javascript
requirejs.config({
  baseUrl: '/application',
  paths: {
    'text': '../bower_components/requirejs-text/text',
    'base': 'plugins/base',
    'template': 'plugins/template',
    'controller': 'plugins/controller',
    'service': 'plugins/service',
    'module': 'plugins/module',
    'config': 'plugins/config',
    'directive': 'plugins/directive',
    'filter': 'plugins/filter'
  },
  structure: {
      /**
       * @description
       * requirejs.config.baseUrl + structure.prefix
       *
       * requirejs.config.baseUrl = '/application'
       * structure.prefix = modules/{module}
       * {module} - module name
       *
       * result:
       *
       * application/modules/{module}
       */
      prefix: 'modules/{module}',
      
      module: {
        path: '/{module}'
      },

      /**
       * @description
       *
       * syntax:
       *  require('template!{module}:{template-name}');
       *
       *  require('template!{template-name}') - in this case - will be used current module
       *    (which contains the current file)
       *
       *  require('template!@{template-name}') - same as above
       *
       *
       * if current module - foo (file where you use require is located under foo's module directory
       *  Example: /application/modules/foo/foo-include.js)
       *  next paths are same:
       *
       * require('template!bar')
       * require('template!@bar')
       * require('template!foo:bar')
       *
       * We will get:
       *
       *  /resource/views/{template}.{extension}
       *    -> /resource/views/bar.html     
       *   then: requirejs.config.baseUrl + module + template path
       *   -> /application/modules/foo/resource/views/bar.html
       *
       *    baseUrl: /application
       *    modules dir: /modules
       *    module name: /foo
       *    template path: /resource/views/bar.html
       */
      template: {
        path: '/resources/views/{template}.{extension}',
        extension: 'html'
      },

      /**
       * @description
       *
       * Same for controller
       */
      controller: {
        path: '/controllers/{controller}'
      },

      /**
       * @description
       *
       * Same for service
       */
      service: {
        path: '/src/{service}'
      },

      /**
       * @description
       *
       * Same for config
       */
      config: {
        path: '/resources/configs/{config}'
      },

      /**
       * @description
       *
       * Same for directive
       */
      directive: {
        path: '/resources/directives/{directive}'
      },

      /**
       * @description
       *
       * Same for filter
       */
      filter: {
        path: '/resources/filter/{filter}'
      }
    },
    shim: {
      'angular': {
        exports: 'angular'
      },
      'angular-route': {
        deps: ['angular']
      },
      'angular-cache': {
        deps: ['angular']
      },
      'angular-resource': {
        deps: ['angular']
      }
    }
});
```
