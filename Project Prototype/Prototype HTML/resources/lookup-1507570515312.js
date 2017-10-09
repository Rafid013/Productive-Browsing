(function(window, undefined) {
  var dictionary = {
    "d12245cc-1680-458d-89dd-4f0d7fb22724": "Screen 1",
    "da6d847e-ece8-4686-866f-d9bc6abb57a5": "Screen 7",
    "e6ee197c-4e6c-411a-bea1-8fd4c4157187": "Screen 6",
    "acdca7f4-20b0-4bb3-a4b0-14b5bec67328": "Screen 5",
    "2cc5f335-0af7-488a-b55e-0a5c60cae180": "Screen 4",
    "101b5eb0-72b0-4c54-8ea5-439df803d898": "Stat Screen",
    "f4fbbde6-b618-484e-8097-555f79c194b4": "Screen 3",
    "b37829e1-8b14-41bd-b9fe-e22f8b157d13": "Screen2",
    "87db3cf7-6bd4-40c3-b29c-45680fb11462": "960 grid - 16 columns",
    "e5f958a4-53ae-426e-8c05-2f7d8e00b762": "960 grid - 12 columns",
    "f39803f7-df02-4169-93eb-7547fb8c961a": "Template 1",
    "bb8abf58-f55e-472d-af05-a7d1bb0cc014": "default"
  };

  var uriRE = /^(\/#)?(screens|templates|masters|scenarios)\/(.*)(\.html)?/;
  window.lookUpURL = function(fragment) {
    var matches = uriRE.exec(fragment || "") || [],
        folder = matches[2] || "",
        canvas = matches[3] || "",
        name, url;
    if(dictionary.hasOwnProperty(canvas)) { /* search by name */
      url = folder + "/" + canvas;
    }
    return url;
  };

  window.lookUpName = function(fragment) {
    var matches = uriRE.exec(fragment || "") || [],
        folder = matches[2] || "",
        canvas = matches[3] || "",
        name, canvasName;
    if(dictionary.hasOwnProperty(canvas)) { /* search by name */
      canvasName = dictionary[canvas];
    }
    return canvasName;
  };
})(window);