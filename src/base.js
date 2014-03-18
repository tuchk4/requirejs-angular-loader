define(function(){
  return {
    /**
     *
     * @param config
     * @param type
     */
    validate : function(config, type)
    {

      if (!config.hasOwnProperty('structure')){
        throw new Error('Structure should be defined');
      }

      var structure = config.structure;

      if (!structure.hasOwnProperty('module')
        || !structure.module.hasOwnProperty('path')
        || !structure.hasOwnProperty('prefix')){

        throw new Error('Modules structure should be defined');
      }

      this.validateType(structure, type);
    },

    /**
     *
     * @param structure
     * @param type
     */
    validateType: function(structure, type)
    {

      if (!structure.hasOwnProperty(type)
        && !structure[type].hasOwnProperty('path')){

        throw new Error('Structure for ' + type + ' should be defined');
      }
    },

    /**
     *
     * @param req
     * @returns {*}
     */
    getCurrentUrl: function(req)
    {
      if (req.hasOwnProperty('toUrl')){

        // toUrl
        return req.toUrl('.').split('?')[0];
      } else {

        // Normalize
        return req('.').split('?')[0];
      }

    },

    /**
     *
     * @param config
     * @param url
     * @returns {*}
     */
    getCurrentModule: function(config, url)
    {
      var baseUrl = config.baseUrl;
      var prefix = config.structure.prefix;

      return url.replace(
        new RegExp('^.*'+(baseUrl + prefix.replace('{module}', ''))),
        '').split('/')[0];
    },

    /**
     *
     * @param path
     * @param config
     * @param url
     * @returns {string}
     */
    path: function(path, config, url)
    {
      var prefix = config.structure.prefix;
      var module = this.getCurrentModule(config, url);

      return prefix.replace('{module}', module) + path;
    },

    /**
     *
     * @param name
     * @returns {*}
     */
    value: function(name)
    {
      var parts = name.split(':');
      var placeholder;

      if (parts.length == 1){
        placeholder = parts[0];
      } else if (parts.length == 2) {
        placeholder =  parts[1];
      } else {
        throw new Error('Invalid require path format for structure plugin');
      }

      if (placeholder[0] == '@'){
        placeholder = placeholder.substr(1);
      }

      return placeholder;
    },

    /**
     *
     * @param type
     * @param name
     * @param req
     * @param onload
     * @param config
     */
    process: function(type, name, req, onload, config)
    {
      var reqPath = this.reqPath(type, name, config, this.getCurrentUrl(req));

      req([reqPath], function(value){
        onload(value);
      });
    },

    /**
     *
     * @param type
     * @param name
     * @param config
     * @param url
     * @returns {string}
     */
    reqPath: function (type, name, config, url)
    {
      this.validate(config, type);

      var structure = config.structure;

      var component = this.value(name);

      var path = structure[type].path
        .replace(new RegExp('{' + type + '}', 'g'), component);

      return this.path(path, config, url);
    },

    /**
     *
     * @param name
     * @param normalize
     * @returns {*}
     */
    normalize: function (name, normalize)
    {
      if (name.split(':').length == 1){

        var config = requirejs.s.contexts._.config;

        var module = this.getCurrentModule(config, config.baseUrl  + this.getCurrentUrl(normalize));

        return module + ':' + name;

      } else {
        return name;
      }
    }
  }
});