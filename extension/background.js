chrome.action.onClicked.addListener((tab) =>
{
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["/dependecies/summary.js", "textSummary.js"]
    });
});