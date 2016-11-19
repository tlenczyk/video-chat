define('app',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function App() {
    _classCallCheck(this, App);

    this.message = 'Hello World!';
  };
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    longStackTraces: _environment2.default.debug,
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n\n  <div class=\"container\">\n\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <div class=\"panel panel-default\">\n          <div class=\"panel-heading\">Presenter</div>\n          <div class=\"panel-body\">\n            <div style=\"border: 1px solid black;width: 300px;height: 300px\">\n              left\n            </div>\n            <br>\n            <button class=\"btn btn-default\" type=\"submit\">Show video</button>\n            <button class=\"btn btn-default\" type=\"submit\">Hide video</button>\n            <button class=\"btn btn-default\" type=\"submit\">Mute</button>\n            <button class=\"btn btn-default\" type=\"submit\">Un-mute</button>\n          </div>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"panel panel-default\">\n          <div class=\"panel-heading\">Viewer</div>\n          <div class=\"panel-body\">\n            <div style=\"border: 1px solid black;width: 300px;height: 300px\">\n              right\n            </div>\n            <br>\n            <button class=\"btn btn-default\" type=\"submit\">Show video</button>\n            <button class=\"btn btn-default\" type=\"submit\">Hide video</button>\n            <button class=\"btn btn-default\" type=\"submit\">Mute</button>\n            <button class=\"btn btn-default\" type=\"submit\">Un-mute</button>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map