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

    var randomQuote = ""

    $("#getRandomQuote").click(function () {
        console.log ("Getting a random Quote");
        $.ajax ({
            url: "https://favqs.com/api/qotd"
        }) .then (function (response) {
            randomQuote = (response.quote.body);
            $('#randomQuote').text(randomQuote);
        });
        
        // This should really be a drop down, it'll be easier to expand in future
        $("#pirateTranslation").click(function () {
            var fullPirateURL=baseURL+pirateURL
            translateOurQuote(randomQuote,fullPirateURL);
        })
            
        $("#cockneyTranslation").click(function () {
            var fullCockneyURL=baseURL+cockneyURL
            translateOurQuote(randomQuote, fullCockneyURL);
           })
    






        // This function allows us to pass the quote and create an API URL for fun translations
        //  EXS 27th March 2020
        function translateOurQuote (randomQuote, translateURL) {
            console.log (randomQuote, translateURL);
            myQuote=encodeURI(randomQuote);
            myURL= translateURL+myQuote;
            //console.log ("My URL is: ",myURL);
            $.ajax ({
                url: myURL
            }) .then (function (response) {
                $("#translated").text(response.contents.translated);
            })
        }
    });



















// End of jquery ready function    
});