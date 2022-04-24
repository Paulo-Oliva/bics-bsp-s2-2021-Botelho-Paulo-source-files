let lexRankButton = document.getElementById("lex_rank_button");
let textRankButton = document.getElementById("text_rank_button");
let naiveRankButton = document.getElementById("naive_rank_button");

let selectedButton = null;

function addEventListeners()
{
    algorithmEventListener(lexRankButton);
    algorithmEventListener(textRankButton);
    algorithmEventListener(naiveRankButton);
    addEventListenerToSummaryButton();
}

function algorithmEventListener(button)
{
    button.addEventListener("click", function ()
    {
        if (selectedButton == button)
        {
            return;
        }
        else
        {
            button.style.backgroundColor = "rgb(0, 255, 0)";
            selectedButton = button;
            switch (button)
            {
                case lexRankButton:
                    textRankButton.style.backgroundColor = "rgb(255, 255, 255)";
                    naiveRankButton.style.backgroundColor = "rgb(255, 255, 255)";
                    displayLexRankParameters();
                    break;
                case textRankButton:
                    lexRankButton.style.backgroundColor = "rgb(255, 255, 255)";
                    naiveRankButton.style.backgroundColor = "rgb(255, 255, 255)";
                    displayTextRankParameters();
                    break;
                case naiveRankButton:
                    lexRankButton.style.backgroundColor = "rgb(255, 255, 255)";
                    textRankButton.style.backgroundColor = "rgb(255, 255, 255)";
                    displayNaiveRankParameters();
                    break;
            }
        }
    });
}

// Add 2 paragraphs to the algorithm parameters div.
function displayLexRankParameters()
{
    let algorithmParametersDiv = document.getElementById("algorithm_parameters");
    algorithmParametersDiv.replaceChildren();

    let paragraph1 = document.createElement("p");
    paragraph1.innerHTML = "Sentences:";
    let sentences = document.createElement("input");
    sentences.setAttribute("type", "number");
    sentences.setAttribute("id", "sentences");
    sentences.setAttribute("value", 5);
    sentences.setAttribute("min", 1);
    sentences.setAttribute("max", 100);
    sentences.setAttribute("step", 1);
    algorithmParametersDiv.appendChild(paragraph1).appendChild(sentences);

    let paragraph2 = document.createElement("p");
    paragraph2.innerHTML = "Keywords:";
    let keywords = document.createElement("input");
    keywords.setAttribute("type", "number");
    keywords.setAttribute("id", "keywords");
    keywords.setAttribute("value", 60);
    keywords.setAttribute("min", 1);
    keywords.setAttribute("max", 100);
    keywords.setAttribute("step", 1);
    algorithmParametersDiv.appendChild(paragraph2).appendChild(keywords);
}

function displayTextRankParameters()
{
    let algorithmParametersDiv = document.getElementById("algorithm_parameters");
    algorithmParametersDiv.replaceChildren();

    let paragraph1 = document.createElement("p");
    paragraph1.innerHTML = "Sentences:";
    let sentences = document.createElement("input");
    sentences.setAttribute("type", "number");
    sentences.setAttribute("id", "sentences");
    sentences.setAttribute("value", 5);
    sentences.setAttribute("min", 1);
    sentences.setAttribute("max", 100);
    sentences.setAttribute("step", 1);
    algorithmParametersDiv.appendChild(paragraph1).appendChild(sentences);
}

function displayNaiveRankParameters()
{
    let algorithmParametersDiv = document.getElementById("algorithm_parameters");
    algorithmParametersDiv.replaceChildren();

    let paragraph1 = document.createElement("p");
    paragraph1.innerHTML = "Sentences:";
    let sentences = document.createElement("input");
    sentences.setAttribute("type", "number");
    sentences.setAttribute("id", "sentences");
    sentences.setAttribute("value", 5);
    sentences.setAttribute("min", 1);
    sentences.setAttribute("max", 100);
    sentences.setAttribute("step", 1);
    algorithmParametersDiv.appendChild(paragraph1).appendChild(sentences);
}

function getSentencesNumber()
{
    return document.getElementById("sentences").value;
}

function getKeywordsNumber()
{
    return document.getElementById("keywords").value;
}

/**
 * Returns an array of sentences contained in the summary stripped of the newline char.
 * 
 * @param {string} textSummary The summary text.
 * @returns An array of sentences contained in the summary.
 */
function splitSummary(textSummary)
{
    let splittedSummary = splitText(textSummary.text);

    for (let index = 0; index < splittedSummary.length; index++)
    {
        splittedSummary[index] = splittedSummary[index].replace("\n", "");
    }
    return splittedSummary;
}

/**
 * Splits a string into an array of sentences.
 * 
 * @param {string} str A string of text.
 * @returns An array of sentences contained in the string.
 */
function splitText(str)
{
    return str.match(/(.+?([A-Z].)[\.|\?](?:['")\\\s]?)+?\s?)/igm);
}


function addEventListenerToSummaryButton()
{
    let summaryButton = document.getElementById("summary_button");
    summaryButton.addEventListener("click", async function ()
    {
        // Get active tabs.
        let activeTabs = await chrome.tabs.query({ active: true, currentWindow: true });

        let activeTabId = activeTabs[0].id;
        console.log(activeTabId);

        // Send a message to the content script in the active tab.
        chrome.tabs.sendMessage(activeTabId, { message: "get_text" }, function (response)
        {
            // console.log("Received response from content script: " + response.message);

            try
            {
                let summaryArray = generateSummary(response.textContent, selectedButton);
                console.log(summaryArray);

                for (let index = 0; index < summaryArray.length; index++)
                {
                    summaryArray[index] = summaryArray[index].replace(/\n/, "");
                    summaryArray[index] = summaryArray[index].replace(/\s+$/, "");
                }

                console.log(summaryArray);

                // Tell the content script to highlight the text in the array.
                chrome.tabs.sendMessage(activeTabId, { message: "highlight_text", textToHighlight: summaryArray });
            }
            catch (error)
            {
                alert(error);
            }
        });
    });
}

function generateSummary(textToSummarize, selectedButton)
{
    switch (selectedButton)
    {
        case lexRankButton:
            let summary = summarize(textToSummarize, getSentencesNumber(), getKeywordsNumber());
            return splitSummary(summary);

        case textRankButton:
            return TextRank.summarize(splitText(textToSummarize), getSentencesNumber());

        case naiveRankButton:
            return NaiveRank.summarize(splitText(textToSummarize), getSentencesNumber());

        default:
            throw "Error: No algorithm was selected."
    }
}


addEventListeners();