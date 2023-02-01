// ==UserScript==
// @name          TagPro Speech
// @namespace     http://www.reddit.com/u/AMorpork
// @description   Adds speech synthesis to in game chat
// @include         https://tagpro.koalabeast.com/game
// @include         https://tagpro.koalabeast.com/game?*
// @copyright     2014 AnkhMorpork
// @author        AnkhMorpork
// @version       1.0
// ==/UserScript==

// Settings
var SYSTEM_MESSAGES = false,  // Should it read system messages? Join/quit messages mainly. Degree messages as well.
    CHAT_MESSAGES = true,  // Should it read normal chat messages?
    ECHO_MESSAGES = false, // Should it echo your own messages?
    FLAG_MESSAGES = false;  // Should it announce when the flag is taken?


var redFlag, blueFlag, redScore, blueScore;

window.addEventListener('load', function () {
    tagpro.ready(function () {
        if (CHAT_MESSAGES) {
            tagpro.socket.on('chat', function (message) {
                if (message.from != tagpro.playerId || ECHO_MESSAGES) {
                    if (!message.from && SYSTEM_MESSAGES) {
                        window.speechSynthesis.speak(new SpeechSynthesisUtterance(message.message))
                    } else if (message.from) {
                        window.speechSynthesis.speak(new SpeechSynthesisUtterance(tagpro.players[message.from].name + " says " + message.message))
                    }
                }
            })
        }
    });

    var flagCheck = function () {
        for (var p in tagpro.players) {
            var player = tagpro.players[p];
            if (player.flag) {
                if (player.flag == 1 && redFlag != player.id) {
                    redFlag = player.id;
                    blueScore = tagpro.score.b;
                    window.speechSynthesis.cancel();
                    window.speechSynthesis.speak(new SpeechSynthesisUtterance("Red flag taken by " + player.name));
                } else if (player.flag == 2 && blueFlag != player.id) {
                    blueFlag = player.id;
                    redScore = tagpro.score.r;
                    window.speechSynthesis.cancel();
                    window.speechSynthesis.speak(new SpeechSynthesisUtterance("Blue flag taken by " + player.name));
                }

            }
        }
        if (redFlag) {
            var red = tagpro.players[redFlag];
            if (!red.flag) {
                redFlag = null;
                if (blueScore == tagpro.score.b) {
                    window.speechSynthesis.cancel();
                    window.speechSynthesis.speak(new SpeechSynthesisUtterance("Red flag dropped by " + red.name));
                } else {
                    window.speechSynthesis.cancel();
                    window.speechSynthesis.speak(new SpeechSynthesisUtterance("Red flag captured by " + red.name));
                }
            }
        }
        if (blueFlag) {
            var blue = tagpro.players[blueFlag];
            if (!blue.flag) {
                blueFlag = null;
                if (redScore == tagpro.score.r) {
                    window.speechSynthesis.cancel();
                    window.speechSynthesis.speak(new SpeechSynthesisUtterance("Blue flag dropped by " + blue.name));
                } else {
                    window.speechSynthesis.cancel();
                    window.speechSynthesis.speak(new SpeechSynthesisUtterance("Blue flag captured by " + blue.name));
                }
            }
        }
    };
    if (FLAG_MESSAGES) {setInterval(flagCheck, 100);}
});
