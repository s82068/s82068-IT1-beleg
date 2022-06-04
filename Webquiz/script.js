//Idee dafür, das nicht bloß erster Button richtig ist 
//neues feld in json und button mit richtiger zuerst randomisiert belegen und dann den rest 

//erstellen der Verbindung aus vo HTML und JS
let topicSaver = null
let integerSaver = null
let numberOfAnswersClicked = 0
let rightAnswerClickedVariable = 0
let wrongAnswerClickedVariable = 0
let alreadyUsedQuestions= []  
let randomInteger = -1
const bar = document.getElementById("Bar")
const statscontainer = document.getElementById("stats-container")
const inhaltcontainer = document.getElementById("inhaltcontainer")
const label1 = document.getElementById("label-1")
const label2 = document.getElementById("label-2")
const btn9 = document.getElementById("btn-9")
btn9.addEventListener("click", restartClicked)
//AJAX
const email = "s82068@htw-dresden.de"
const password = "secret"
let randomQuizID

//Themen
const btn1 = document.getElementById("btn-1") //Mathe
const btn2 = document.getElementById("btn-2") //Internettechnologien
const btn3 = document.getElementById("btn-3") //Allgemein
const btn4 = document.getElementById("btn-4") //Noten
btn1.addEventListener("click", topicButtonClicked)
btn2.addEventListener("click", topicButtonClicked)
btn3.addEventListener("click", topicButtonClicked)
btn4.addEventListener("click", topicButtonClicked)
//Antworten
const btn5 = document.getElementById("btn-5")
const btn6 = document.getElementById("btn-6")
const btn7 = document.getElementById("btn-7")
const btn8 = document.getElementById("btn-8")
btn5.addEventListener("click", answerButtonClicked)
btn6.addEventListener("click", answerButtonClicked)
btn7.addEventListener("click", answerButtonClicked)
btn8.addEventListener("click", answerButtonClicked)

//wählt Thema aus
//dies wird benötigt, damit später die richtigen fragen geladen werden
function topicButtonClicked(element){
  const pressedButtonTopic = element.currentTarget
   //geht sicher, dass ein thema ausgewählt ist und dass der rest dann auch funktionieren kann
  if(topicSaver != null){
    alert("Das aktuelle Quiz muss erst beendet werden, bevor du ein weiter beginnen darfst!")
    return
  }
  //speichert das thema in variabeln
  if(pressedButtonTopic == btn1){
    const selectedTopic = quizQuestion["teil-mathe"]
    loadPossibleQuestions(selectedTopic)
  } 
  else if(pressedButtonTopic == btn2){
    const selectedTopic = quizQuestion["teil-internettechnologien"]
    loadPossibleQuestions(selectedTopic)
  } 
  else if (pressedButtonTopic == btn3){ 
    const selectedTopic = quizQuestion["teil-allgemein"]
    loadPossibleQuestions(selectedTopic)
  }
  else if(pressedButtonTopic == btn4){
    const selectedTopic = quizQuestion["online-fragen"]
    loadPossibleQuestionsREST()
    
  }
}


//holt sich die fragen vom server und befüllt damit das label und die button
function loadPossibleQuestionsREST() {
  topicSaver = "online-fragen"
  //bereitet die ajax abfrage vor als HMTL Request
  randomQuizID = Math.floor((Math.random() * 4) +70) //Zahl noch noch nicht richtig     74, 73, 72,71, 70
  let url = 'https://irene.informatik.htw-dresden.de:8888/api/quizzes/' + randomQuizID.toString() //url des servers mit Fragen ID
  let xhr = new XMLHttpRequest();
    xhr.open('GET', url, false); 
    xhr.setRequestHeader("Authorization", "Basic " + window.btoa(email+":"+password)) 
    xhr.send() //schickt ajax ab
  let resultJSON = JSON.parse(xhr.responseText) //lädt antwort in json und danach in label und button
                                                //die ursprüngliche antwort ist ein string in form eines json, welches umgewandelt wird
  label1.innerHTML = resultJSON.text
  btn5.innerHTML = resultJSON.options[0]
  btn6.innerHTML = resultJSON.options[1]
  btn7.innerHTML = resultJSON.options[2]
  btn8.innerHTML = resultJSON.options[3]
  console.log(topicSaver)
  
}

//lädt fragen aus lokalen json und befüllt damit das label und die button
function loadPossibleQuestions(selectedTopic){
  randomInteger = Math.floor(Math.random() * selectedTopic.length)
  topicSaver = selectedTopic
  //diese funktion und die speziellen string werden hier benötigt damit die 
  //mathe fragen "mathematisch" angezeigt werden
  if(topicSaver == quizQuestion["teil-mathe"]){
    const questionString = "$$" + topicSaver[randomInteger].a + "$$" 
    const renderedQuestions = []
    for(let i = 0; i<=3; i++){
      renderedQuestions[i] = "$$" + topicSaver[randomInteger].l[i] + "$$"
    }
    label1.innerHTML = questionString
    btn5.innerHTML = renderedQuestions[0]
    btn6.innerHTML = renderedQuestions[1]
    btn7.innerHTML = renderedQuestions[2]
    btn8.innerHTML = renderedQuestions[3]
    renderMathInElement(document.body, {
      delimiters: [
          {left: "$$", right: "$$", display: true},
          {left: "$", right: "$", display: false},
          {left: "\(", right: "\)", display: false},
          {left: "\[", right: "\]", display: true},
          {left: "\begin{equation}", right: "\end{equation}", display: true}
      ]
  });
  } else{
    const questionString = topicSaver[randomInteger].a
    label1.innerHTML = questionString
    btn5.innerHTML = topicSaver[randomInteger].l[0]
    btn6.innerHTML = topicSaver[randomInteger].l[1]
    btn7.innerHTML = topicSaver[randomInteger].l[2]
    btn8.innerHTML = topicSaver[randomInteger].l[3]
  }
}


//ein antwortknopf wurde gedrückt -> entscheiden, ob richtig oder nicht + neue frage
//funktioniert bloß bei lokalen fragen. das prinzip wird aber auch bei ajax wiederverendet 
function answerButtonClicked(element){ 
  const pressedButton = element.currentTarget
  let pressedButtonAsInt = null
  //geht sicher, dass ein thema ausgewählt ist und dass der rest dann auch funktionieren kann
  if(topicSaver === null){
    return
  } 
  //je nach online und lokal werden unterschiedliche funktionen nach dem anklicken eines buttons aufgerufen, da
  //sich sich die "reaktionen" leicht unterscheiden
  if(topicSaver === "online-fragen"){
    //bei online fragen muss sich die antwort kurz gemerkt werden, damit diese an den server geschickt werden kann
    //hier als int (eigentlich string), damit es in die url eingefügt werden kann 
    if(pressedButton == btn5){
      pressedButtonAsInt = 0
    } else if (pressedButton == btn6){
      pressedButtonAsInt = 1
    } else if (pressedButton == btn7){
      pressedButtonAsInt = 2
    } else {
      pressedButtonAsInt = 3
    }
    sendButtonPressedToServerAndRecieveAnswer(pressedButtonAsInt, pressedButton)
    return
  }
  //hier muss sich die antwort bloß als element gemerkt werden, damit richtig/falsch entschieden werden kann
  if(pressedButton == btn5){
    rightAnswerClickedFunction(btn5)
  }
  else {
    wrongAnswerClickedFunction(pressedButton)
  }  
}


//richtige antwort angeklickt -> button wird grün und nächste frage wird nach einer sekunde geladen 
//und button werden wieder normal
function rightAnswerClickedFunction(btn5){
  btn5.style.backgroundColor = 'green' 
  disableAnswerButtons() 
  setTimeout(function(){ //damit man sich die richtige antwort anschauen kann, wird die nächste frage nach einer sekunde geladen
    btn5.style.backgroundColor = ''
    loadPossibleQuestions(topicSaver)
    activateAnswerButtons()
  }, 1000);
  //außerdem wird die progress bar aktualisiert und für die statistik der index für richtige fragen hochgesetzt
  numberOfAnswersClicked++
  rightAnswerClickedVariable++
  moveProgressBar()
  //außerdem checkt es, ob "genug" fragen beantwortet wurden sind und wenn ja lädt es die statistik
  checkIfEnoughAnswers()
}

//falscher antwort gedrückt 
//funktional genau wie bei den richtigen antworten, bloß das hier die falsche antwort hochgezählt wird
function wrongAnswerClickedFunction(pressedButton){
  btn5.style.backgroundColor = 'green'
  pressedButton.style.backgroundColor = 'red'
  disableAnswerButtons()
  setTimeout(function(){
    btn5.style.backgroundColor = ''
    pressedButton.style.backgroundColor = ''
    activateAnswerButtons() //buttons (und ihre angehängten funktionen) funktionieren erst wieder, wenn sie wieder aktiviert sind
    loadPossibleQuestions(topicSaver)
  }, 1000);
  numberOfAnswersClicked++
  wrongAnswerClickedVariable++
  moveProgressBar()
  checkIfEnoughAnswers()
}

//wenn entweder keine fragen mehr im lokalen json sind oder 5 fragen beantwortet wurden, wird die statistik geladen
function checkIfEnoughAnswers(){
  if(numberOfAnswersClicked >= topicSaver.length || numberOfAnswersClicked == 5){
    loadStats()
  }
}


function sendButtonPressedToServerAndRecieveAnswer(pressedButtonAsInt, pressedButton){
  //abfrage der angeklickten antwort wird vorbereitet
  let xhr = new XMLHttpRequest();
  let url = 'https://irene.informatik.htw-dresden.de:8888/api/quizzes/'+ randomQuizID +'/solve'
  xhr.open('POST', url, false);
  xhr.setRequestHeader("Authorization", "Basic " + window.btoa(email+":"+password));
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json");
  console.log("ich schicke antwort")
  let dataToSend = "["+pressedButtonAsInt+"]"
  xhr.send(dataToSend); //abfrage wird gesendet
  let resultJSON = JSON.parse(xhr.responseText)
  //wenn antwort falsch ist, dann tut es vom prinzip, dass gleiche wie bei lokal, bloß ohne die richtige antwort zu zeigen
  // -> bewegt progress bar, zählt richtig/falsch und beendet evtl quiz
  if(resultJSON.success == false){
    pressedButton.style.backgroundColor = 'red'
    //richtige anwort wird atm nicht gezeigt, da dafür neue abfragen nötig wären 
    wrongAnswerClickedVariable++ 
    numberOfAnswersClicked++
    disableAnswerButtons()
    moveProgressBar()
    setTimeout(function(){
      console.log("timeout ")
      pressedButton.style.backgroundColor = ''
      activateAnswerButtons() //buttons (und ihre angehängten funktionen) funktionieren erst wieder, wenn sie wieder aktiviert sind
      loadPossibleQuestionsREST(topicSaver)
    }, 1000);
    checkIfEnoughAnswers()
  }
  else { 
    pressedButton.style.backgroundColor = 'green'
    rightAnswerClickedVariable++
    numberOfAnswersClicked++
    moveProgressBar()
    
    setTimeout(function(){
      pressedButton.style.backgroundColor = ''
      activateAnswerButtons() //buttons (und ihre angehängten funktionen) funktionieren erst wieder, wenn sie wieder aktiviert sind
      loadPossibleQuestionsREST(topicSaver)
    }, 1000);
    checkIfEnoughAnswers()
  }
}

//Progressbar, stellt den Fortschritt dar
function moveProgressBar(){
  let intProgress
  if(topicSaver === "online-fragen"){
    intProgress = (numberOfAnswersClicked / 5) * 100
  } else {
    intProgress = (numberOfAnswersClicked / topicSaver.length) * 100
  }
  bar.style.width = intProgress + "%"
}

//statistikfunktion. hier wird der fragen teil versteckt und durch eine neue div mit der statistik ersetzt
function loadStats(){ 
  statscontainer.classList.remove("hide")
  inhaltcontainer.classList.add("hide")
  let statsString = null
  if(topicSaver != "online-fragen"){
    statsString = "Du hast " + rightAnswerClickedVariable + " richtige Antworten und " + wrongAnswerClickedVariable +  " falsche Antworten, bei insgesamt "+ topicSaver.length +" Fragen."
  } else {
    statsString = "Du hast " + rightAnswerClickedVariable + " richtige Antworten und " + wrongAnswerClickedVariable +  " falsche Antworten, bei insgesamt "+ numberOfAnswersClicked++ +" Fragen."
  }
  label2.innerHTML = statsString
}

//deaktiveren der button, damit es zu keinen bugs kommt
function disableAnswerButtons(){
  btn5.disabled = true
  btn6.disabled = true
  btn7.disabled = true
  btn8.disabled = true
}
//... und das aktiveren der button, damit das quiz weitergehen kann
function activateAnswerButtons(){
  btn5.disabled = false
  btn6.disabled = false
  btn7.disabled = false
  btn8.disabled = false
}


//wenn am ende der neustart button gedrückt wurde, werden die "zähler" und andere elemente wieder auf anfang gesetzt 
//die fragen erscheinen wieder und die statistik verschwindet 
function restartClicked(){
  statscontainer.classList.add("hide")
  inhaltcontainer.classList.remove("hide")
  bar.style.width= "0%"
  label1.innerHTML= "Bitte klick ein Thema an!"
  topicSaver = null
  integerSaver = null 
  numberOfAnswersClicked = 0
  rightAnswerClickedVariable = 0
  wrongAnswerClickedVariable = 0
  activateAnswerButtons()//fixt ein bug, dass answerbutton deaktiviert sind
  btn5.innerHTML = "A"
  btn6.innerHTML = "B"
  btn7.innerHTML = "C"
  btn8.innerHTML = "D"
}

//lokale fragen
const quizQuestion = { 
    "teil-mathe": [
      {"a":"(x^2)+(x^2)", "l":["2x^2","x^4","x^8","2x^4"]},
      {"a":"x^2*x^2", "l":["x^4","x^2","2x^2","4x"]},
      {"a":"(x^2)*(x^3)", "l":["x^2*x^3","x^5","5x","x^6"]},
      {"a":"77+33", "l":["110","100", "103", "2541"]}
      ],
    "teil-internettechnologien": [
      {"a":"Welche Authentifizierung bietet HTTP", "l":["Digest Access Authentication","OTP","OAuth","2-Faktor-Authentifizierung"]},
      {"a":"Welches Transportprotokoll eignet sich für zeitkritische Übertragungen", "l":["UDP","TCP","HTTP","Fast Retransmit"]},
      {"a":"Wann begann das Internet?", "l":["1969"," 1950","1970","2000"]},
      {"a":"Wie viele Menschen haben 2021 Internetzugang?", "l":["4,1 Milliarden", "6 Milliarden", "2 Milliarden", "3,4 Milliarden"]}
      ],
    "teil-allgemein": [
      {"a":"Karl der Große, Geburtsjahr", "l":["747","828","650","1150"]},
      {"a":"Wer ist der aktuelle Schachweltmeister?", "l":["Magnus Carlsen","Hikaru Nakamura","Ding Liren","Fabiano Caruana"]},
      {"a":"In welchem Land hat Deutschland 2014 die Fußball-WM gewonnen?", "l":["Brasilien", "Frankreich", "Katar",]},
      {"a":"Wer ist der aktuelle Bundeskanzler von Deutschland?", "l":["Olaf Scholz","Christian Lindner","Angela Merkel","Friedrich Merz"]}
      ]   
  }


