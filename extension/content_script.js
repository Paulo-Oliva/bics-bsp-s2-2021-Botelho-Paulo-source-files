
/**
 * Returns an array of all the text nodes in a wordpress article.
 * @returns {Array}
 */
function getTextSources()
{
    let textSources = document.querySelectorAll(".article-content p, .post-content p, .entry-content p, #article-content p, .f-content-entry p");
    return textSources;
}


/**
 * Given an array of text nodes, returns the text contained in them as a string.
 * @param {Array} textSources an array of all the text nodes in a wordpress article.
 * @returns {String} The full text contained in the node array.
 */
function getFullText(textSources)
{
    let textToSum = "";

    for (let item of textSources)
    {
        textToSum += item.textContent + "\n";
    }
    // console.log(textToSum);
    return textToSum;
}


function getTextArray(textSources)
{
    let sentencesArray = [];
    for (let item of textSources)
    {
        sentencesArray.push(item.textContent);
    }
    // console.log(sentencesArray);
    return sentencesArray;
}


/**
 * Highlights the text in the page based on the sentences in the summary.
 * @param {string[]} arrayOfSentences An array of sentences contained in the summary.
 */
function highlightText(arrayOfSentences)
{
    let paragraphs = document.getElementsByTagName("p");
    let importantParagraphs = [];

    for (let paragraph of paragraphs)
    {
        // console.log(paragraph.textContent);
        for (let index = 0; index < arrayOfSentences.length; index++)
        {
            let sumSentence = arrayOfSentences[index];
            if (paragraph.textContent.includes(sumSentence))
            {
                // console.log("This paragraphs contains an important sentence. Index: " + index);
                // console.log(paragraph.textContent);
                if (!importantParagraphs.includes(paragraph))
                {
                    importantParagraphs.push(paragraph);
                }
            }
        }
    }
    console.log('importantParagraphs :>> ', importantParagraphs);
    for (let paragraph of importantParagraphs)
    {
        // Get the text of the paragraph.
        let text = paragraph.textContent;

        for (const sentence of arrayOfSentences)
        {
            // Replace the sentence with a mark tag.
            text = text.replace(sentence, "<mark>" + sentence + "</mark>");
        }
        paragraph.innerHTML = text;
    }
}

function removeHighlighting()
{
    let paragraphs = document.getElementsByTagName("p");
    for (let paragraph of paragraphs)
    {
        paragraph.innerHTML = paragraph.textContent.replace(/<mark>/g, "").replace(/<\/mark>/g, "");
    }
}

console.log("Text Summarizer's content script is running.");

let isHighlighted = false;

// Listen for the popup to send a message
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse)
    {
        // Content script received a message from the popup.
        console.log("Content script received a message from the popup with the following message: "
            + request.message);

        if (request.message == "get_text")
        {
            // Get the text from the page and send it as a response.
            let textSources = getTextSources();
            let textToSum = getFullText(textSources);

            sendResponse({ message: "send_text", textContent: textToSum });
        }
        else if (request.message == "highlight_text")
        {
            let textToHighlight = request.textToHighlight;
            // console.log("Text to highlight:\n" + textToHighlight);
            // console.log(typeof textToHighlight);

            if (isHighlighted)
            {
                removeHighlighting();
            }
            highlightText(textToHighlight);
            isHighlighted = true;

            // Send a response because Chrome is bugged in v99-101
            // https://stackoverflow.com/questions/71520198/manifestv3-new-promise-error-the-message-port-closed-before-a-response-was-rece
            sendResponse();
        }
    });
