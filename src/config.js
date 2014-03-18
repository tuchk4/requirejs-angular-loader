define(['base'], function(base){
  return {

    normalize: function (name, normalize) {

      return base.normalize(name, normalize);
    },

    load: function (name, req, onload, config) {

      base.process('config', name, req, onload, config);
    }
  }
});
