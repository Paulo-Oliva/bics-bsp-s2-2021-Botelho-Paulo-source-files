// Execute the script when the action button is clicked
chrome.action.onClicked.addListener((tab) =>
{
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["textSummary.js"]
    });
});
