console.log("Extension initialized...");

function splitText(str)
{
    return str.match(/(.+?([A-Z].)[\.|\?](?:['")\\\s]?)+?\s?)/igm);
}

// Get all the text nodes from a wordpress article
function getTextSources()
{
    let textSources = document.querySelectorAll('.article-content p');
    return textSources;
}

// Returns the full text to be summarized.
function getFullText(textSources)
{
    let textToSum = "";

    for (let item of textSources)
    {
        textToSum += item.textContent + "\n";
    }
    console.log(textToSum);
    return textToSum;
}

// Returns an array of sentences contained in the summary stripped of the newline char.
function splitSummary(textSummary)
{
    let splittedSummary = splitText(textSummary.text);

    for (let index = 0; index < splittedSummary.length; index++)
    {
        splittedSummary[index] = splittedSummary[index].replace("\n", "");
    }
    return splittedSummary;
}

// Highlights the text in the page based on the sentences in the summary.
function highlightText(arrayOfSentences)
{
    let paragraphs = document.getElementsByTagName("p");
    for (let paragraph of paragraphs)
    {
        // console.log(paragraph.textContent);
        for (let index = 0; index < arrayOfSentences.length; index++)
        {
            let sumSentence = arrayOfSentences[index];

            if (paragraph.textContent.includes(sumSentence))
            {
                // console.log("This paragraphs contains an important sentence. Index: " + index);
                paragraph.innerHTML = paragraph.textContent.replace(sumSentence, "<mark>" + sumSentence + "</mark>");
            }
        }
    }
}

let textSources = getTextSources();
let textToSum = getFullText(textSources);

// Create a summary of 5 sentences
let textSummary = summarize(textToSum, 5, 40);
console.log(textSummary.text);

let splittedSummary = splitSummary(textSummary);
console.log(splittedSummary);

highlightText(splittedSummary);
