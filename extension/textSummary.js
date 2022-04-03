console.log("Extension initialized...");


/**
 * Splits a string into an array of sentences.
 * @param {string} str A string of text.
 * @returns An array of sentences contained in the string.
 */
function splitText(str)
{
    return str.match(/(.+?([A-Z].)[\.|\?](?:['")\\\s]?)+?\s?)/igm);
}


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
    console.log(textToSum);
    return textToSum;
}


/**
 * Returns an array of sentences contained in the summary stripped of the newline char.
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
 * Highlights the text in the page based on the sentences in the summary.
 * @param {string[]} arrayOfSentences An array of sentences contained in the summary.
 */
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

// IIFE to run the extension.
(function ()
{
    let textSources = getTextSources();
    // console.log(textSources);
    let textToSum = getFullText(textSources);
    // console.log(textToSum);

    // Create a summary of 5 sentences
    let textSummary = summarize(textToSum, 5, 40);
    console.log(textSummary.text);

    let splittedSummary = splitSummary(textSummary);
    console.log(splittedSummary);


    highlightText(splittedSummary);
})();


// let allDivs = document.querySelectorAll("div");


// for (const node of allDivs)
// {
//     let cnt = 0;
//     let descendants = node.querySelectorAll("*");
//     for (let descendant of descendants)
//     {
//         if (descendant.tagName == "p")
//         {
//             cnt++;
//         }
//     }
// }

// let largestCount = 0;
// let index = 0;
// for (let i = 0; i < allDivs.length; ++i)
// {
//     let cnt = 0;
//     let node = allDivs[i];
//     let descendants = node.querySelectorAll("*");

//     for (let descendant of descendants)
//     {
//         if (descendant.tagName == "p")
//         {
//             cnt++;
//         }
//     }
//     if (cnt > largestCount)
//     {
//         largestCount = cnt;
//         index = i;
//     }
// }

// console.log(allDivs[index]);

