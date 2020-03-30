// Quote Convertor 
// JS Code 26th MArch 2020
// Eddie Saunders saunders.eddie@outlook.com
//
// This script is to accept input from the user then create an API call to convert
// the quote of the day selected by the user to a translation of their choice.

// Potential issues are the face we only have 5 hits per hour using funtranslations.com

// Version 1.00
// Simple input acceptance from user, then use translateOurQuote to display the translation
// EXS 26th MArch 2020

$(document).ready(function () {


    $('.dropdown-trigger').dropdown();
    const baseURL="https://api.funtranslations.com/translate/"
    const cockneyURL="cockney.json?text=";
    const pirateURL="pirate.json?text=";
    const chefURL = "chef.json?text=";
    const oldEnglishURL = "oldenglish.json?text=";

    
    var randomQuote = ""

    $("#getRandomQuote").click(function () {
        $.ajax({
            url: "https://favqs.com/api/qotd"

        }).then(function (response) {
            console.log(response);
            randomQuote = (response.quote.body);
            $('#randomQuote').text(randomQuote);
        });

        // This should really be a drop down, it'll be easier to expand in future
        // EXS added in Chef and Old English 30th March 2020.
        $("#pirateTranslation").click(function () {
            var fullPirateURL = baseURL + pirateURL;
            translateOurQuote(randomQuote, fullPirateURL);
        });

        $("#cockneyTranslation").click(function () {
            var fullCockneyURL = baseURL + cockneyURL
            translateOurQuote(randomQuote, fullCockneyURL);
        });

        $("#chefTranslation").click(function () {
            var fullChefURL = baseURL+chefURL;
            translateOurQuote(randomQuote, fullChefURL);
        });

        $("oldEnglishTranslation").click (function () {
            var full oldEnglishUrl=baseURL+oldEnglishURL;
            translateOurQuote(randomQuote, fullOldEnglishURL);
        })
 
        // This function allows us to pass the quote and create an API URL for fun translations
        //  EXS 27th March 2020
        // Adding random comment to test git push
        function translateOurQuote (randomQuote, translateURL) {
            //console.log (randomQuote, translateURL);
            myQuote = encodeURI(randomQuote);
            myURL = translateURL + myQuote;
            $.ajax({
                url: myURL

            }).then(function (response) {
                console.log (response);
                $("#translated").text(response.contents.translated);
                // After translation call the attributeSites function
                // This may need expanding with the type of translation performed
                atrributeSites();
            })
        }

        // function psuedo
            // get translateCounterDiv - should be the current count
            // const translationsPerHour = 5 -> Top of the code> Under ready?
            // if translaterCounterDiv < translationsPerHour
                //Then update the translateCounterDiv by 1
                //Update the number on screen?
  
        // Translator Counter
        var translateCounterDiv = $("#translateCounter");
        var translateCount = 0;
        var translate
        if (translatesPerformed > 1) {
            translate++;
            translateCounterDiv.text(translateCount);
        };

        function atrributeSites() {
            // This function will display the attribute links required for API access
            // EXS msaunders.eddie@outlook.com 28th March 2020
            // convertedType would be the pirate, cockney, yoda etc...
            // EXS requested two fields for these to be written to 30th March
            const funTranslationsAPI = "https://www.funtranslations.com";
            const quoteAPI = "https://https://favqs.com/api/qotd"

            console.log("attributed sites");
            
        }

    });

    // End of jquery ready function    
});