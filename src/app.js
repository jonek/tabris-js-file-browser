var currentDirectory;

tabris.create("Page", {
    title: "Using the Cordova file plugin...",
    topLevel: true,
    background: "#fff"
}).once("appear", createExample).open();

function createExample(page) {
  var rootDirMappings = [
    {name: "cordova.file.applicationDirectory", value: cordova.file.applicationDirectory},
    {name: "cordova.file.applicationStorageDirectory", value: cordova.file.applicationStorageDirectory},
    {name: "cordova.file.externalApplicationStorageDirectory", value: cordova.file.externalApplicationStorageDirectory},
    {name: "cordova.file.externalRootDirectory", value: cordova.file.externalRootDirectory}
  ];

  var rootDirPickerLabel = tabris.create("TextView", {
    layoutData: {left: 16, top: 8, right: 16},
    text: "Cordova Filesystem Entry Point",
    textColor: "#009688"
  }).appendTo(page);

  var rootDirPicker = tabris.create("Picker", {
    layoutData: {left: 16, top: [rootDirPickerLabel, 0], height: 48, right: 16},
    items: rootDirMappings.map(function(item) {return item.name;}),
    selectionIndex: 0
  }).appendTo(page);

  var urlBar = tabris.create("Composite", {
    layoutData: {left: 0, right: 0, top: [rootDirPicker, 0], height: 48},
  }).appendTo(page);

  var currentDirectoryView = tabris.create("TextInput", {
    layoutData: {left: 16, top: 0, right: [0, 80]},
    font: "16px",
    editable: false,
    autoCorrect: false,
    text: currentDirectory
  }).appendTo(urlBar);

  var upButton = tabris.create("Button", {
    layoutData: {left: [currentDirectoryView, 16], right: 16, top: 0},
    text: "Up",
    enabled: false
  }).appendTo(urlBar);

  var scrollView = tabris.create("ScrollView", {
    direction: "vertical",
    layoutData: {left: 0, top: [urlBar, 16], right: 0, bottom: 0}
  }).appendTo(page);

  var success = function(param) {
    console.log("using directory:\n" + JSON.stringify(param));
    var directoryReader = param.createReader();
    console.log("directoryReader:\n" + JSON.stringify(directoryReader));
    directoryReader.readEntries(function(result) {
      result.forEach(function (entry) {
        var row = tabris.create("Composite", {
          layoutData: {left: 0, right: 0, top: ["prev()", 1], height: 72},
          background: "#ddd"
        }).appendTo(scrollView);
        var dirEntryView = tabris.create("TextView", {
          layoutData: {left: 16, right: 16, centerY: 0},
          font: "20px",
          text: entry.fullPath,
          markupEnabled: true
        }).appendTo(row);
        if(entry.isDirectory) {
          dirEntryView.set("font", "bold 20px");
          dirEntryView.on("tap", function() {
            console.log("tapped: " + entry.fullPath);
            changeDir(entry.nativeURL);
          });
        }
      });
    });
  };
  var error = function(param) {console.log('== error \"' + param + '\"');};

  function changeDir(dir) {
    currentDirectory = dir;
    console.log("====\nCURRENT DIRECTORY:\n" + currentDirectory);
    currentDirectoryView.set("text", currentDirectory);
    scrollView.children().dispose();
    window.resolveLocalFileSystemURL(currentDirectory, success, error);
  }

  rootDirPicker.on("select", function(picker, selection, options) {
    changeDir(rootDirMappings[options.index].value);
  });

}
