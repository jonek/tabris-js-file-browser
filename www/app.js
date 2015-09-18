var currentDirectory;

tabris.create("Page", {
    title: "Using the Cordova file plugin...",
    topLevel: true,
    background: "#fff"
}).once("appear", createExample).open();

function createExample(page) {
  var rootDirMappings = [
    {name: ".applicationDirectory", value: cordova.file.applicationDirectory},
    {name: ".applicationStorageDirectory", value: cordova.file.applicationStorageDirectory},
    {name: ".externalApplicationStorageDirectory", value: cordova.file.externalApplicationStorageDirectory},
    {name: ".externalRootDirectory", value: cordova.file.externalRootDirectory}
  ];

  var rootDirPickerLabel = tabris.create("TextView", {
    layoutData: {left: 0, top: 0, right: 0},
    text: "Cordova File Plugin \"cordova.file...\""
  }).appendTo(page);

  var rootDirPicker = tabris.create("Picker", {
    layoutData: {left: 0, top: [rootDirPickerLabel, 0], right: 0},
    items: rootDirMappings.map(function(item) {return item.name;}),
    selectionIndex: 0
  }).appendTo(page);

  var currentDirectoryView = tabris.create("TextInput", {
    layoutData: {left: 0, top: [rootDirPicker, 0], right: 0},
    editable: false,
    autoCorrect: false,
    text: currentDirectory
  }).appendTo(page);

  var scrollView = tabris.create("ScrollView", {
    direction: "vertical",
    layoutData: {left: 0, top: [currentDirectoryView, 0], right: 0, bottom: 0}
  }).appendTo(page);

  var success = function(param) {
    console.log("using directory:\n" + JSON.stringify(param));
    var directoryReader = param.createReader();
    console.log("directoryReader:\n" + JSON.stringify(directoryReader));
    directoryReader.readEntries(function(result) {
      result.forEach(function (entry) {
        var dirEntryView = tabris.create("TextView", {
          layoutData: {left: 3, right: 3, top: ["prev()", 3]},
          font: "20px",
          background: "#ddd",
          text: entry.fullPath,
          markupEnabled: true
        }).appendTo(scrollView);
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

  rootDirPicker.on("change:selectionIndex", function(picker, index) {
    changeDir(rootDirMappings[index].value);
  });

}
