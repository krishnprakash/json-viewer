function exposeJson(text, outsideViewer) {
  console.info("[JSONViewer] Your json was stored into 'window.json', enjoy!");

  if (outsideViewer) {
    window.json = JSON.parse(text);

  } else {
    var script = document.createElement("script");
    script.textContent = 'window.json = ' + JSON.stringify(JSON.parse(text)) + ';';
    document.head.appendChild(script);
  }
}

module.exports = exposeJson;
