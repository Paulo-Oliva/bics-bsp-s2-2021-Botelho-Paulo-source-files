chrome.action.onClicked.addListener((tab) =>
{
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["/lib/summary.js", "textSummary.js"]
    });
});