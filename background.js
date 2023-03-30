// Context Menu
chrome.contextMenus.create({
  id: "getAnswers",
  title: "Get Answers",
  contexts: ["all"],
});
chrome.contextMenus.create({
  id: "toggleAnswers",
  title: "Show/Hide Answers",
  contexts: ["all"],
});
chrome.contextMenus.create({
  id: "eraseAnswers",
  title: "Erase Answers",
  contexts: ["all"],
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  runScript(tab, `scripts/${info.menuItemId}.js`);
});

// Keyboard Shortcuts
chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    runScript(tabs[0], `scripts/${command}.js`);
  });
});

// Run Script
function runScript(tab, script) {
  chrome.tabs.executeScript(tab.id, { file: script }, () => {});
}
