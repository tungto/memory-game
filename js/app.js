
var UIController = (function () {
    var DOMstrings = {
        card: ".card",
        matchedCards: '.match',
        deck: '.deck'
    }

    return {

        getDOMstrings: function () {
            return DOMstrings;
        },

        shuffle: function (array) {
            var currentIndex, temporarilyValue, randomIndex;
            currentIndex = array.length;
            while (currentIndex !== 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporarilyValue = array[currentIndex]
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporarilyValue;
            }
            return array
        },
    }
})();

var AppController = (function (UICtrl) {

    var DOM = UICtrl.getDOMstrings();
    var cardList = document.querySelectorAll(DOM.card);
    stars = document.querySelectorAll('.star-rating');
    // convert nodelist cards to array cards
    var cards = [...cardList];
    var openedCards = [];
    var matchedCards = document.getElementsByClassName("match");
    var moves = 0;
    var Timer, stopWatch;
    var popUp = document.querySelector('.result');
    var timesHTML;
    var playAgain = document.querySelector(".play-again")
    var closeIcon = document.querySelector('.close');

    var setUpEventListener = function () {

        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            // Display card when click
            card.addEventListener('click', displayCard);
            card.addEventListener('click', checkCard);
            card.addEventListener('click', winCheck)
        }
        document.querySelector(".restart-btn").addEventListener("click", init)
    }
    var displayCard = function () {
        // console.log(this)
        this.classList.add("show", "open", "disabled");
        openedCards.push(this);
        // console.log(openedCards);
    };

    var checkCard = function () {
        if (openedCards.length === 2) {
            moveCounter();
            if (openedCards[0].type === openedCards[1].type) {
                // Run matched func
                matched();

            } else {
                unmatched();
            }
        }
    }
    var moveCounter = function () {
        moves++;
        document.querySelector("#moves").textContent = moves;
        if (moves === 1) {
            startTimer();
        }
        if (moves > 8 && moves < 12) {

            // console.log(stars)
            stars[2].style.visibility = 'collapse'
        } else if (moves > 13) {
            stars[2].style.visibility = "collapse";
            stars[1].style.visibility = "collapse";
        }
    }
    var startTimer = function () {
        var second, minute, hour;
        second = 0; minute = 0; hour = 0;
        stopWatch = document.querySelector(".stop-watch");

        Timer = setInterval(function () {
            timesHTML = `<span>${minute} minute  ${second} second </span>`;
            stopWatch.innerHTML = timesHTML;
            second++;
            if (second === 60) {
                second = 0;
                minute++
            }
            if (minute === 60) {
                hour++
            }
        }, 1000);
    }

    var winCheck = function () {
        /*  console.log(matchedCards) */
        if (matchedCards.length == 16) {
            clearInterval(Timer);
            var finalTime = timesHTML;
            popUp.classList.add("show");

            var starRating = document.querySelector('.stars').innerHTML;

            //showing move, rating, time on modal
            document.querySelector(".moves").innerHTML = moves;
            document.querySelector("#minutes").innerHTML = finalTime;

            //closeicon on modal
            closeModal();
        }
    };

    // @description close icon on modal
    var closeModal = function () {

        closeIcon.addEventListener("click", function () {
            popUp.classList.remove("show")
        });
        playAgain.addEventListener("click", function () {
            popUp.classList.remove("show")
        });
        init();
    }


    var matched = function () {
        openedCards[1].classList.add("match", "disabled");
        openedCards[0].classList.add("match", "disabled");
        openedCards[0].classList.remove("show", "open");
        openedCards[1].classList.remove("show", "open");
        openedCards = [];
    }
    var unmatched = function () {
        openedCards[0].classList.add("unmatched");
        openedCards[1].classList.add("unmatched");

        // disable flip
        disable();

        setTimeout(function () {
            openedCards[1].classList.remove("show", "open", "unmatched");
            openedCards[0].classList.remove("show", "open", "unmatched");
            // enable flip again

            enable();
            openedCards = [];

        }, 600)
    }

    // disable flip all cards func
    var disable = function () {
        cards.forEach(card => {
            card.classList.add("disabled");
        })
    }
    // enable flip func
    var enable = function () {
        cards.forEach(card => {
            card.classList.remove("disabled");
        });
        [].forEach.call(matchedCards, matchedCard => {
            matchedCard.classList.add("disabled");
        })
    }

    var init = function () {
        var deck = document.querySelector(DOM.deck)
        setUpEventListener();
        cards = UICtrl.shuffle(cards);

        //1. Clear all cards in the deck
        deck.innerHTML = "";

        //2. Display new cards
        cards.forEach(card => {
            deck.appendChild(card);
            card.classList.remove("show", "open", "match", "disabled")
        })

        //3. Reset move
        moves = 0;
        document.querySelector("#moves").textContent = moves;
        //4. Reset Rating

        Array.prototype.forEach.call(stars, function (star) {
            star.style.visibility = 'visible'
        })
        //5. Reset timmer
        document.querySelector(".stop-watch").textContent = "";
        clearInterval(Timer)
    };

    window.onload = init();

})(UIController);
