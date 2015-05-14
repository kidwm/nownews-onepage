// This is NOWNEWS OnePage Add-on

var pageMod = require("sdk/page-mod");
var {Cc, Ci} = require("chrome");
var parserUtils = Cc["@mozilla.org/parserutils;1"].getService(Ci.nsIParserUtils);

exports.main = function(options, callbacks) {
 var hiddenFrames = require("sdk/frame/hidden-frame");
 var parser;
 let hiddenFrame = hiddenFrames.add(hiddenFrames.HiddenFrame({
  onReady: function() {
    parser = this.element.contentDocument.createElement('div');
  }
 }));
  var init = pageMod.PageMod({
    include: ["http://www.nownews.com/*", "https://www.nownews.com/*"],
    contentScriptWhen: 'ready',
    contentScriptFile: './mod.js',
    onAttach: function onAttach(worker) {
      worker.on('message', function(data) {
        parser.appendChild(ParseHTML(parser, data));
        worker.postMessage(parser.querySelector('div.story_content').innerHTML);
        parser.innerHTML = '';
      });
    }
 });
};

function ParseHTML(node, html) {
        return parserUtils.parseFragment(html, parserUtils.SanitizerAllowStyle, false, null, node);
}
