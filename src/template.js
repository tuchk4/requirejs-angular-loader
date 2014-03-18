define(['base'], function(base){
  return {

    normalize: function (name, normalize) {

      return base.normalize(name, normalize);
    },

    load: function (name, req, onload, config) {

      base.validate(config, 'template');

      var structure = config.structure;

      var template = base.value(name);

      var extension = 'html';
      if (structure.template.hasOwnProperty('extension')){
        extension = structure.template.extension;
      }

      var path = structure.template.path
        .replace('{template}', template)
        .replace('{extension}', extension);

      var reqPath = base.path(path, config, base.getCurrentUrl(req));


      req(['text!' + reqPath], function(value){
        onload(value);
      });
    }
  }
});
