// Quote Convertor 
// JS Code 26th March 2020
////
// This script is to accept input from the user then create an API call to convert
// the quote of the day selected by the user to a translation of their choice.

// Potential issues are the face we only have 5 hits per hour using funtranslations.com

// Version 1.00
// Simple input acceptance from user, then use translateOurQuote to display the translation
// EXS 26th MArch 2020

$(document).ready(function () {

    // part of materialize to make dropdown work 
    $('.dropdown-trigger').dropdown();

    //code from materialze to make modal trigger work 
    $('.modal').modal();

    // EXS 4th April 2020 - Set up our consts for sound and URLS
    // To expand this we simply add to the list and add the relative item in HTML
    const baseURL = 'https://api.funtranslations.com/translate/'
    const cockneyURL = baseURL + 'cockney.json?text=';
    const pirateURL = baseURL + 'pirate.json?text=';
    const chefURL = baseURL + 'chef.json?text=';
    const oldEnglishURL = baseURL + 'oldenglish.json?text=';
    const fuddURL = baseURL + 'fudd.json?text=';
    const piratesAudio = new Audio('./assets/sfx/pirates.mp3');
    const cockneyAudio = new Audio('./assets/sfx/cockney.mp3');
    const chefAudio = new Audio('./assets/sfx/chef.mp3');
    const oldEnglandAudio = new Audio('./assets/sfx/oldEnglish.mp3');
    const fuddAudio = new Audio('./assets/sfx/fudd.mp3');
    const lockoutDuration = 60;

    var lockedOut = false; // EXS working on solution for clearing text, but retaining locked out message
    var randomQuote = ''
    var translationsPerHour = 5;

    //L.C 4/1
    //get user translations from local strage
    var userTranslationsSavedArray = localStorage.getItem('userTranslations');

    //keep from erroring if no translations saved in local storage
    if (!userTranslationsSavedArray) {
        userTranslationsSavedArray = [];
    } else {
        userTranslationsSavedArray = JSON.parse(userTranslationsSavedArray);
    }

    //Add users quotes/translations into the modal and mobile div 

    // L.C - separate loops for adding in the translations mobile and the modal translations 
    //in order for styles to apply correctly

    for (i = 0; i < userTranslationsSavedArray.length; i++) {
        var spaceBtwQuotes = $('<li>');
        $('#translationsMobile').append(userTranslationsSavedArray[i]);
        $('#translationsMobile').append(spaceBtwQuotes);
    }

    for (i = 0; i < userTranslationsSavedArray.length; i++) {
        var spaceBtwQuotes = $("<li>");
        $('#modalText').append(userTranslationsSavedArray[i]);
        $('#modalText').append(spaceBtwQuotes);
    }

    //L.C. 4/2
    //Click button function to clear local storage 
    $('#clearQuotesBtn').click(function () {
        localStorage.clear();
        $('modal1').hide();
        location.reload(true);
    })

    //L.C. 4/5
    //Click button function to clear local storage on mobile 
    $('#clearQuotesBtn2').click(function () {
        localStorage.clear();
        $('modal1').hide();
        location.reload(true);
    })


    // EXS 1st April 2020 - Page initalize
    initPage();


    // T.W. 3/29
    // Function To Count Each Translate
    function countOurTranslate() {
        if (translationsPerHour === 0) {
            //localStorage.setItem("limitTime", currentTime);
            // countDown(); EXS 4th April 2020  commented line out as countDown() does not exist as a function
            $('#badRequestPopup').show();
            return false;
        }
        else {
            translationsPerHour--;
            $('#translateCounter').text(translationsPerHour);
        }
    };

    randomQuote = $('#randomQuote').val();

    $('#getRandomQuote').click(function () {
        console.log('Get Random Quote');
        //$('#translated').empty();
        $('#randomQuote').empty();
        var lockedOutStatus = getLockedOutStatus();
        if (lockedOutStatus) {
            $('#badRequestPopup').show();
            return;
        }
        $.ajax({
            url: 'https://favqs.com/api/qotd',
            method: 'GET'
        }).then(function (response) {
            $('#randomQuote').empty();
            console.log("Ajax Quote Return");
            randomQuote = (response.quote.body);
            $('#randomQuote').text(randomQuote);
        });
    });

    // clear our random quote on click
    $('#randomQuote').click(function () {
        console.log('In Random Quote Text Box');
        var lockedOutStatus = getLockedOutStatus();
        if (lockedOutStatus) {
            $('#badRequestPopup').show();
            $('#randomQuote').empty();
            return;
        }
        //$('#randomQuote').empty();
        $('#translated').empty();
    });

    // Check on which list item has been clicked on the dropdown
    // Then call the translatefunction with appropriate parameters  
    $('#dropdown1 li').click(function () {
        // console.log(this.id);
        switch (this.id) {
            case 'pirateTranslation':
                translateOurQuote(pirateURL, 'pirateFont', piratesAudio);
                break;
            case 'cockneyTranslation':
                translateOurQuote(cockneyURL, 'cockneyFont', cockneyAudio);
                break;
            case 'chefTranslation':
                translateOurQuote(chefURL, 'chefFont', chefAudio);
                break;
            case 'oldEnglishTranslation':
                translateOurQuote(oldEnglishURL, 'oldEngFont', oldEnglandAudio);
                break;
            case 'fuddTranslation':
                translateOurQuote(fuddURL, 'cowboyFont', fuddAudio)
                break;
            default:
                break;
        }
    })

    function translateOurQuote(translateURL, fontType, audioFile) {
        // Clear any existing CSS font styles.
        clearStyles();

        // We maybe able to squish the myQuote calculation directly into the myURL calculation
        myQuote = encodeURI($('#randomQuote').val());
        myURL = translateURL + myQuote;

        // T.W. 4/4 Check time to see if we can count this translate or we have to wait an hour
        // checkTimeBeforeCountingTranslate();
        lockedOutStatus = getLockedOutStatus();
        if (lockedOutStatus) {
            $('#badRequestPopup').show();
            return;
        }
        $.ajax({
            url: myURL,
            method: 'GET',
            error: whoops
        }).then(function (response) {
            countOurTranslate();
            playSFX(audioFile);
            // Get our returned translation, set the translated font and display
            $('#translated').addClass(fontType);
            var translation = response.contents.translated

            var spaceBtwQuotes2 = $("<br>");

            //add quote onto the textarea do
            $("#translated").text(translation);
            //add quote into the modal on full web
            $("#modalText").append(translation + "<li>");

            //add quote into the row div on mobile
            $("#translationsMobile").append(translation + "<li>");
            $("#translationsMobile").append(spaceBtwQuotes2);
            userTranslationsSavedArray.push(translation)
            localStorage.setItem('userTranslations', JSON.stringify(userTranslationsSavedArray));
        });
    }


    // Initialize our page, created as a function in case we need to do something else in future
    // Updated EXS 4th April 2020
    // Now checks locked out status at start up.
    // Will also pull locked out time and see if the locked out status can be cleared and saved

    function initPage() {
        // var lockedOutTime = localStorage.getItem() 
        // here we'll get our locked out time from local storage and decide if we're still locked out or not
        let lockedOutStatus = getLockedOutStatus();
        //console.log (lockedOutStatus);
        if (lockedOutStatus) {
            atrributedSites();
            $('#badRequestPopup').show();
            return;
        }
        atrributedSites();
    }

    // Small function to pull locked out status - EXS 4th April 2020
    // This will pull the locked out status and locked out time
    function getLockedOutStatus() {
        lockedOut = localStorage.getItem('lockedOut');
        let lockedTime = localStorage.getItem('lockedTime');
        let currentTime = moment().format("HH:mm:ss");
        if (lockedOut) {
            let momLockedTime = moment.duration(lockedTime).asMinutes();
            let momCurrentTime = moment.duration(currentTime).asMinutes();
            minutesStuff = momCurrentTime - momLockedTime;
            //console.log (minutesStuff, lockoutDuration);
            if (minutesStuff > lockoutDuration) {
                lockedOut = false;
                localStorage.removeItem('lockedTime');
                localStorage.removeItem('lockedOut');
            }
        }
        return (lockedOut);
    }

    // Create a function to set our locked out status and time - EXS 5th April 2020
    function setLockedOutStatus() {
        lockedOut = true;
        var lockedTime = moment().format("HH:mm:ss");
        localStorage.setItem('lockedOut', lockedOut);
        localStorage.setItem('lockedTime', lockedTime);
    }

    // Creation of site credits - EXS 1st April 2020
    function atrributedSites() {
        // This function will display the attribute links required for API access
        let funTranslationsAPI = '<a href="http://funtranslations.com" target="_blank">fun translations</a>';
        let quoteAPI = '<a href="https://favqs.com/" target="_blank" >fave quotes</a>';
        attributeSites = 'Quotes supplied by ' + quoteAPI + '. Translation supplied by ' + funTranslationsAPI;
        $('#attribute-site').html(attributeSites);
    }

    // Play our sound effects EXS 1st April 2020
    function playSFX(sfxName) {
        sfxName.play();
    }

    //L.C 4/1
    //error message for too many API requests, timer set for 1 hour
    function whoops() {
        // EXS 5th April 2020 If we get here and not locked out, then lockout and save lockout time
        if (!lockedOut) {
            console.log('Recording Locked Out Status and Time');
            setLockedOutStatus();
            $('#badRequestPopup').show();
        }

        //console.log("Error with pulling translation");
        $('#badRequestPopup').show();
        setTimeout(function () {
            // EXS Clear out our locked time settings once the timeout is up
            lockedOut = false;
            $('#badRequestPopup').hide();
        }, 3600000);
    }

    //L.C. 4/2
    //function to remove special fonts from translator area 
    function clearStyles() {
        $('#translated').removeClass();
    }

    // End of jquery ready function    
});
