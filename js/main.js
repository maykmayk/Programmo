const _app = {}

_app.fetching = async () => {
    let quote = "";
    const quoteCont = document.getElementById("quoteToCopy");
    const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
    
    fetch(quoteApiUrl)
        .then(response => response.json())
        .then(async data => {
            const sourceText = data.content;
            const targetLanguage = "it"; 
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLanguage}&dt=t&q=${encodeURI(sourceText)}`);
            const translatedData = await response.json();
            const translatedText = translatedData[0][0][0];
            console.log(translatedText);
            quote = translatedText;
        
            // Array of chars in quote
            const arr = quote.split("").map((value) => {
            return "<span class='quote-chars'>" + value + "</span>";
            });
            quoteCont.innerHTML += arr.join("");
    });
};

_app.checking = () => {
    _app.mistakes = 0;
    _app.userInput = document.getElementById("textArea")
    _app.userInput.addEventListener("input", () => {
        let quoteChars = document.querySelectorAll(".quote-chars");
        quoteChars = Array.from(quoteChars);
    
        let userInputChars = _app.userInput.value.split("");
        quoteChars.forEach((char, index) => {
            if (char.innerText == userInputChars[index]) {
                char.classList.add("success");
            }
            else if (userInputChars[index] == null) {
                if (char.classList.contains("success")) {
                    char.classList.remove("success");
                } else {
                    char.classList.remove("fail");
                }
            }
            else {
                if (!char.classList.contains("fail")) {
                    _app.mistakes++;
                    char.classList.add("fail");
                }
                document.getElementById("errors").innerText = _app.mistakes;
            }
    
            //Return true if all chars are correct
            let check = quoteChars.every((element) => {
                return element.classList.contains("success");
            });
    
            //End test if all chars are correct
            if (check) {
                _app.end = true
            }
    
        });
    
    })
}

_app.startUp = () => {
    const quoteCont = document.getElementById("quoteToCopy")
    const textArea = document.getElementById("textArea")
    const btnStart = document.getElementById('startBtn');
    const btnStop = document.getElementById('stopBtn');
    const timerDiv = document.getElementById('timer');
    const errors = document.getElementById('errors');
    const results = document.getElementById('results');
    let timer;
    let time;
    _app.timetaken = []

    btnStart.addEventListener('click', () => {
        textArea.focus();
        errors.textContent = '0';
        timerDiv.textContent = '0s';
        quoteCont.innerHTML = ""
        textArea.value = ""
        let timeLeft = 60;
        timer = setInterval(function() {
            time = timeLeft
            timerDiv.textContent = timeLeft + "s";
            timeLeft -= 1;
            if (timeLeft < 0) {
                clearInterval(timer);
                timerDiv.textContent = '0s';
                results.classList.add('d-flex');
                results.classList.remove('d-none');
            }
        }, 1000);
        _app.fetching();
        _app.checking();
        btnStart.classList.add('d-none');
        btnStart.classList.remove('d-flex');
        btnStop.classList.add('d-flex');
        btnStop.classList.remove('d-none');
    });

    btnStop.addEventListener('click', () => {
        clearInterval(timer);
        results.classList.add('d-flex');
        results.classList.remove('d-none');
        btnStart.classList.remove('d-none');
        btnStart.classList.add('d-flex');
        btnStop.classList.remove('d-flex');
        btnStop.classList.add('d-none');
        let timeTaken = 1;
        if (time != 0) {
            timeTaken = (60 - time) / 100;
        }
        document.getElementById("wpm").innerText = (_app.userInput.value.length / 5 /  timeTaken).toFixed(2) + "wpm";
        document.getElementById("accuracy").innerText = Math.round(((_app.userInput.value.length - _app.mistakes) / _app.userInput.value.length) * 100) + "% accuracy";
    });

    document.addEventListener("keyup", function(event) {
        if (event.code === 'Enter') {  
            clearInterval(timer);
            results.classList.add('d-flex');
            results.classList.remove('d-none');
            btnStart.classList.remove('d-none');
            btnStart.classList.add('d-flex');
            btnStop.classList.remove('d-flex');
            btnStop.classList.add('d-none');
            let timeTaken = 1;
            if (time != 0) {
                timeTaken = (60 - time) / 100;
            }
            document.getElementById("wpm").innerText = (_app.userInput.value.length / 5 /  timeTaken).toFixed(2) + "wpm";
            document.getElementById("accuracy").innerText = Math.round(((_app.userInput.value.length - _app.mistakes) / _app.userInput.value.length) * 100) + "% accuracy";
        }
    });
}

// _app.end = () => {
//     const btnStart = document.getElementById('startBtn');
//     const btnStop = document.getElementById('stopBtn');
//     const results = document.getElementById('results');
//     let timer;
//     let time;
//     _app.timetaken = []

//     clearInterval(timer);
//     results.classList.add('d-flex');
//     results.classList.remove('d-none');
//     btnStart.classList.remove('d-none');
//     btnStart.classList.add('d-flex');
//     btnStop.classList.remove('d-flex');
//     btnStop.classList.add('d-none');
//     let timeTaken = 1;
//     if (time != 0) {
//         timeTaken = (60 - time) / 100;
//     }
//     document.getElementById("wpm").innerText = (_app.userInput.value.length / 5 /  timeTaken).toFixed(2) + "wpm";
//     document.getElementById("accuracy").innerText = Math.round(((_app.userInput.value.length - _app.mistakes) / _app.userInput.value.length) * 100) + "% accuracy";
// }

_app.startUp()