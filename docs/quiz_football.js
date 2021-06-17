console.log("connexion à quiz_football.js");

var trialCount = 0;
var correctAnswersCount = 0;

class Proposition {
    constructor(nb, code, text){
        this.propId = "P"+nb;
        this.propValue = code;
        this.propText = text;
    }
}

class Question {
    constructor(nb, title, propositions, rightAnswer, correction, clue) {
        this.questId = "QN"+nb;
        this.questTitle = title;
        this.questPropArray = propositions;
        this.questRightAnswerValue = rightAnswer.propValue; // A DECLINER : Réponses multiples
        this.questCorrectionText = correction;
        this.questClue = clue;
    }
}

class Quiz {
    constructor(nb,title,questions){
        this.quizId = "QZ"+nb;
        this.quizTitle = title;
        this.quizCount = questions.length;
        this.quizQuestArray = questions;
    }
}

// Désactiver un élément
function disableElement(element) {
	element.disabled = true;
}

// Activer un élément
function activateElement(element) {
	element.removeAttribute("disabled");
}

// Montrer un élément 
function showElement(element) {
    element.style.display = "block";
}

// Cacher un élément 
function hideElement(element) {
    element.style.display = "none";
}

function printOneQuestion(nb, question) {

    var questHTML = "<div id=\"question"+nb+"\" class=\"question-card\"> <p class=\"question-title\">"+question.questTitle+"</p>";

    for (let i=0; i<question.questPropArray.length; i++) {
    questHTML += "<input type=\"radio\" name=\"q"+nb+"\" id=\"q"+nb+"p"+(i+1)+"\" value=\""+question.questPropArray[i].propValue+"\"> <label for=\"q"+nb+"p"+(i+1)+"\"> "+question.questPropArray[i].propText+" </label><br>"
    }

    questHTML += "<br><p id=\"question"+nb+"Indice\" class=\"hidden-default\"><strong>Indice</strong><br>"+question.questClue+"<br><p id=\"question"+nb+"Correction\" class=\"hidden-default\"><strong>Correction</strong><br>"+question.questCorrectionText+"</p> </div>";

    document.getElementById("finalValidZone").insertAdjacentHTML("beforebegin", questHTML);
}

function printQuiz(quiz) {
    document.getElementById("quizTitle").innerHTML = quiz.quizTitle;

    for(let i=0; i < quiz.quizCount; i++) {
        let j = i+1;
        //console.log(j);
        printOneQuestion(j, quiz.quizQuestArray[i]);
    }
}

function getSelectedAnswer(name) {
    let answersPossible = document.getElementsByName(name);
    //console.log(answersPossible);
    let i = 0
    
    while (i<answersPossible.length) {
        if (answersPossible[i].checked) {
            //console.log(answersPossible[i].value);
            return answersPossible[i].value;
        }
        else {
            i++;
        }
    }
    //console.log("NO_ANSW");
    return "NO_ANSW";
}

function allQuestionsAnswered(quizCount) {
    let i = 0;

    while (i< quizCount) {
        let questionName = "q"+(i+1);
        let selectedValue = getSelectedAnswer(questionName);
        //console.log(selectedValue+" "+typeof(selectedValue));
        if (selectedValue.localeCompare("NO_ANSW") == 0) return false;
        i++;
    }

    return true;
}

function checkAnswer(value, quizQuestion) {
    // console.log(value+" - "+quizQuestion.questRightAnswerValue.toString());
    // console.log(typeof(value)+" - "+typeof(quizQuestion.questRightAnswerValue.toString()));
    let test = (value.localeCompare(quizQuestion.questRightAnswerValue) == 0) ? true : false;
    // console.log(test);
    return test;
}

function disableAllForm() {
    var form = document.getElementById("questionForm");
    var elements = form.elements;
    for (let i = 0; i < elements.length; ++i) {
        disableElement(elements[i]);
    }
}

function displayScoreComment(score, total, trials) {
    var scoreHTML = score+"/"+total;
    document.getElementById("resultats").innerHTML = scoreHTML;

    var tryAgainText = "<br>Vous pouvez retenter en utilisant les indices";
    var betterNextTime = "<br>Vous ferez mieux la prochaine fois !"
    var complement = (trials < 2) ? tryAgainText : betterNextTime;

    var scoreComment = "";

    switch(score) {
        case 0:
            scoreComment = "Aucune réponse correcte"+complement;
            break;
        case 1:
        case 2:
            scoreComment = "Il y a plusieurs erreurs"+complement;
            break;
        case 3:
        case 4:
            scoreComment = "Une majorité de bonnes réponses"+complement;
            break;
        case 5:
            if (trials == 1) {
                scoreComment = "C'est un triomphe, Bravo !"
            }
            else {
                scoreComment = "Toutes les réponses sont correctes, Bravo !"
            }
            break;
        default: break;
    }

    document.getElementById("scoreComment").innerHTML = scoreComment;
}

function recordAnswers(quiz) {
    disableAllForm();
    correctAnswersCount = 0;
    if (trialCount < 3) {
        for (let i=0;i < quiz.quizCount;i++) {
            let questionName = "q"+(i+1);
            let questionId = "question"+(i+1);
            let selectedValue = getSelectedAnswer(questionName);
    
            if (selectedValue.localeCompare("NO_ANSW") != 0)  {
    
                if (checkAnswer(selectedValue, quiz.quizQuestArray[i])){
                    document.getElementById(questionId).classList.remove("wrong-answer");
                    document.getElementById(questionId).classList.add("right-answer");
                    showElement(document.getElementById(questionId+"Correction"));
                    if (correctAnswersCount < 5) correctAnswersCount++;
                } else {
                    // document.getElementById(questionId).classList.remove("right-answer");
                    document.getElementById(questionId).classList.add("wrong-answer");
                    if (trialCount == 2) {
                        showElement(document.getElementById(questionId+"Correction"));
                    }
                    else {
                        showElement(document.getElementById(questionId+"Indice"));
                    }
                }
           }
        }
        hideElement(document.getElementById("finalValidZone"));
        hideElement(document.getElementById("btnValid"));
        
        if (correctAnswersCount > 4) {
            hideElement(document.getElementById("tryAgainBtn"));
        }
        displayScoreComment(correctAnswersCount, quiz.quizCount, trialCount);
        if (trialCount == 2)  hideElement(document.getElementById("tryAgainBtn"));
        
        showElement(document.getElementById("score"));

        trialCount++; 
        
        // console.log(correctAnswersCount);
    } 
        
}

function validateQuiz(quizCount) {
    //console.log("validateQuiz "+quizCount);
    
    if (document.getElementById("finalValid").checked) {

        if (allQuestionsAnswered(quizCount)){
            activateElement(document.getElementById("btnValid"));
            hideElement(document.getElementById("score"));

        } else {
            // document.getElementById("scoreText").innerHTML = "Vous n'avez pas répondu à toutes les questions"
            // showElement(document.getElementById("score"));
            alert("Vous n'avez pas répondu à toutes les questions");

            document.getElementById("finalValid").checked = false;
        }
    }
    else {
        disableElement(document.getElementById("btnValid"));
       
    }
}

function reopenQuiz(quizCount) {
    if (trialCount < 3) {
        document.getElementById("finalValid").checked = false;
        disableElement(document.getElementById("btnValid"));

        document.getElementById("trialCountZone").innerHTML = ((3 - trialCount) > 1) ? "Il reste "+(3 - trialCount)+" tentatives." : "Il reste "+(3 - trialCount)+" tentative.";

        showElement(document.getElementById("finalValidZone"));
        showElement(document.getElementById("btnValid"));
        hideElement(document.getElementById("score"));

        for (let i=0;i < quizCount;i++){
            let questionId = "question"+(i+1);
            if (document.getElementById(questionId).classList.contains("wrong-answer")) {
                var elements = document.getElementById(questionId).children;
                for (let i = 0; i < elements.length; ++i) {
                    activateElement(elements[i]);
                }
            }
        }
        activateElement(document.getElementById("finalValid"));
    }
    else {
        //hideElement(document.getElementById("tryAgainBtn"));
        alert("Pas plus de 3 tentatives !");
    }
}

/* Question 1 - DEBUT */
    var propositions1 = [new Proposition (1,"PN","Pavel Nedved"), new Proposition(2, "LF", "Luis Figo"), new Proposition(3, "ZZ", "Zinedine Zidane"), new Proposition(4, "RV", "Rivaldo")];


    var correctionText1 = "En 2000, c'est <strong>Luis Figo</strong> qui a reçu le Ballon d'or.";

    var clue1 = "Ce milieu offensif a joué au Real Madrid.";

    var question1 = new Question(1, "Qui a gagné le ballon d'or en 2000 ?", propositions1, propositions1[1], correctionText1, clue1);
/* Question 1 - FIN */

/* Question 2 - DEBUT */
    var propositions2 = [new Proposition (1,"LYO","Olympique Lyonnais"), new Proposition(2, "MAR", "Olympique de Marseille"), new Proposition(3, "STE", "AS Saint Étienne"), new Proposition(4, "PSG", "Paris Saint Germain")];


    var correctionText2 = "Le club qui a gagné le plus de championnats de France est <strong>l'AS Saint-Etienne</strong> avec dix titres.";

    var clue2 = "Cette ville se trouve en Auvergne-Rhône-Alpes.";

    var question2 = new Question(2, "Quel club a gagné le plus de championnats de France ?", propositions2, propositions2[2], correctionText2, clue2);
/* Question 2 - FIN */

/* Question 3 - DEBUT */
    var propositions3 = [new Proposition (1,"JM","Javier Mascherano"), new Proposition(2, "LM", "Lionel Messi"), new Proposition(3, "RA", "Roberto Ayala"), new Proposition(4, "DS", "Diego Simeone")];

    var correctionText3 = "<strong>Javier Mascherano</strong> possède le record avec 147 sélections en équipe nationale d'Argentine.";

    var clue3 = "Ce joueur a porté les couleurs du FC Barcelone.";

    var question3 = new Question(3, "Qui possède le record de sélections dans l'équipe nationale d'Argentine ?", propositions3, propositions3[0], correctionText3, clue3);
/* Question 3 - FIN */

/* Question 4 - DEBUT */
    var propositions4 = [new Proposition (1,"ZMB","Zambie"), new Proposition(2, "CDI", "Côte d'Ivoire"), new Proposition(3, "ANG", "Angola"), new Proposition(4, "GUI", "Guinée équatoriale")];

    var correctionText4 = "\"As Palancas Negras\" (\"Les Gazelles/Antilopes noires\") est le surnom de l'équipe d'<strong>Angola</strong>.";

    var clue4 = "On trouve les antilopes noires dans le Sud de l'Afrique.";

    var question4 = new Question(4, "Quelle équipe d'Afrique est surnommée \"As Palancas Negras\" (\"Les Gazelles/Antilopes noires\") ?", propositions4, propositions4[2], correctionText4, clue4);

/* Question 4 - FIN */

/* Question 5 - DEBUT */
    var propositions5 = [new Proposition (1,"FRA","Fratton Park"), new Proposition(2, "MOL", "Molineux Stadium"), new Proposition(3, "BRI", "Brittania Stadium"), new Proposition(4, "GOO", "Goodison Park")];

    var correctionText5 = "Le stade des Wolverhampton Wanderers est le <strong>Molineux Stadium</strong>.";

    var clue5 = "L'architecte principal de ce stade était Archibald Leitch.";

    var question5 = new Question(5, "Quel est le nom du stade du club de Wolverhampton ?", propositions5, propositions5[1], correctionText5, clue5);
/* Question 5 - FIN */

var quizFootball = new Quiz(1,"Football", [question1, question2, question3, question4, question5])


function pageSetUp() {
    printQuiz(quizFootball);

    document.getElementById("trialCountZone").innerHTML = "Il reste 3 tentatives.";

    document.getElementById("finalValid").checked = false;
    disableElement(document.getElementById("btnValid"));

    document.getElementById("finalValid").addEventListener('change', () => validateQuiz(quizFootball.quizCount));
    
    document.getElementById("btnValid").addEventListener("click", () => recordAnswers(quizFootball));

    document.getElementById("tryAgainBtn").addEventListener("click", () => reopenQuiz(quizFootball.quizCount));
    
}

window.onload = pageSetUp();