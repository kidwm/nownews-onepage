// This is NOWNEWS OnePage Add-on

var pageMod = require("page-mod");
var {Cc, Ci} = require("chrome");
var scriptableUnescapeHTML = Cc["@mozilla.org/feed-unescapehtml;1"].getService(Ci.nsIScriptableUnescapeHTML);

exports.main = function(options, callbacks) {
 var data = require("self").data;
 var hiddenFrames = require("hidden-frame");
 var parser;
 let hiddenFrame = hiddenFrames.add(hiddenFrames.HiddenFrame({
  onReady: function() {
    parser = this.element.contentDocument.createElement('div');
  }
 }));
  var init = pageMod.PageMod({
    include: ["http://www.nownews.com/*", "https://www.nownews.com/*"],
    contentScriptWhen: 'ready',
    contentScriptFile: data.url("mod.js"),
    onAttach: function onAttach(worker) {
      worker.on('message', function(data) {
        parser.appendChild(ParseHTML(parser, data));
        worker.postMessage(parser.querySelector('div.story_content').innerHTML);
        if (parser.querySelector('div.story_photo')) {
            worker.port.emit('photo', parser.querySelector('div.story_photo').innerHTML);
        }
        parser.innerHTML = '';
      });
    }
 });
};

function ParseHTML(node, html) {  
        return scriptableUnescapeHTML.parseFragment(html, false, null, node);  
}  
