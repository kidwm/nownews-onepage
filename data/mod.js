if (document.getElementById('news_nav')) {

    var target = document.getElementById('news_nav');
    var targets = target.querySelectorAll('a');
    var index = parseInt(target.querySelector('span.current').textContent, 10);
    
    /* modify the page title and get the total pages */
    document.title = document.title.replace(/第\d+頁\s\|\s/, '');
    var total = target.querySelector('a[rel="prev"]') && target.querySelector('a[rel="next"]') ? targets.length - 1 : targets.length;

    var result = new Array(total);
    for (var i = 0; i < total; i++) {
        result[i] = 'null';
    }
    result[index - 1] = 'current';
    for (var i = 0; i < targets.length; i++) {
        if (targets[i].textContent != '<' && targets[i].textContent != '>') {
            var request = new XMLHttpRequest();
            request.onreadystatechange = fetch;
            request.open('GET', targets[i].href, true);
            // request.overrideMimeType('text/html; charset=big5');
            request.send(null);
        }
    }
}

function fetch() {
    var request = this;
    if (request.readyState === 4) {
        if (request.status === 200) {
            /* save the iframe for youtube video */
            var data = request.responseText.replace(/iframe/g, 'video');
            /* restore image src changed by mod_pagespeed lazy load */
            data = data.replace(/pagespeed_lazy_src/g, 'src');
            self.postMessage(data);
        }
    }
}

self.on('message', function(data){ shave(data); });

function shave(data) {
    var content = document.createElement('div');
    /* fix space char like %20http in img src after parser */
    content.innerHTML = data.replace(/%20/g, '');
    /* restore iframe */
    var iframes = content.querySelectorAll('video');
    for (var i = 0; i < iframes.length; ++i) {
        var iframe = iframes[i];
        iframe.insertAdjacentHTML('beforebegin', '<iframe width="' +
        iframe.getAttribute('width') +
        '" height="' +
        iframe.getAttribute('height') +
        '" src="' +
        iframe.getAttribute('src') +
        '" frameborder="0" allowfullscreen></iframe>');
        iframe.parentNode.removeChild(iframe);
    }
    var position = parseInt(content.querySelector('#news_nav > span.current').textContent, 10);
    node = content.querySelector("span.news_next");
    if (node && node.parentNode) {
        node.parentNode.removeChild(node);
    }
    node = content.querySelector("div.page_nav");
    if (node && node.parentNode) {
        node.parentNode.removeChild(node);
    }
    node = content.querySelector('p.bzkeyword');
    if (node && node.parentNode) {
        node.parentNode.removeChild(node);
    }
    result[position - 1] = content.innerHTML;
    if (result.indexOf('null') < 0) {
       render();
    }
}

function render() {
    for (var i = index - 2; i > -1 ; i--) {
        document.querySelector('div.story_content').insertAdjacentHTML('afterbegin', result[i]);
    }
    for (var i = index; i < total; i++) {
        document.getElementById('news_nav').insertAdjacentHTML('beforebegin', result[i]);
    }
    target.style.display = 'none';
}
