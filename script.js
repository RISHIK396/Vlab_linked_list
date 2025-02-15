document.addEventListener('DOMContentLoaded', function () {
    // head nav
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    const searchButton = document.getElementById('searchbt');
    searchButton.addEventListener('click', performSearch);

});

let topicElements = {
    'aim': document.getElementById('aim'),
    'theory': document.getElementById('theory'),
    'procedure': document.getElementById('procedure'),
    'practice': document.getElementById('practice'),
    'code': document.getElementById('code'),
    'result': document.getElementById('result'),
    'quiz': document.getElementById('quiz'),
    'references': document.getElementById('references'),
    'tnt': document.getElementById('tnt')
};
let currentTopic = 'aim'; // Default topic


function switchContent(topic) {
    if (topic === currentTopic) {
        return;
    }

    topicElements[currentTopic].style.display = 'none';
    topicElements[topic].style.display = 'block';
    currentTopic = topic;
}

function toggleCode(language) {
    if (language === 'cpp') {
        document.getElementById('cppCode').style.display = 'block';
        document.getElementById('pyCode').style.display = 'none';
    } else if (language === 'python') {
        document.getElementById('cppCode').style.display = 'none';
        document.getElementById('pyCode').style.display = 'block';
    }
}

function copyCode(elementId) {
    var codeBlock = document.getElementById(elementId);
    var code = codeBlock.querySelector('code').innerText;

    navigator.clipboard.writeText(code).then(function () {
        var copyButton = codeBlock.querySelector('.copy-button');
        copyButton.textContent = 'Copied!';
        setTimeout(function () {
            copyButton.textContent = 'Copy';
        }, 2000);
    }, function (err) {
        console.error('Could not copy text: ', err);
    });
}

// Practice section 


// Quiz script

const questions = [
    {
        question: "What is the advantage of using singly linked list over an array ? ",
        choices: ["Faster Random Access Time", "Dynamic memory Allocation Without Predefined Size", "Lower Memory ", "Easier to Implement"],
        correctAnswers: [1]
    },
    {
        question: " Q2) In a Singly Linked List, how do you delete the last node?",
        choices: ["Update the second last node’s next to NULL.", " Update the last node's data to NULL.", "Update the head to NULL.", " It is not possible to delete the last node."],
        correctAnswers: [0]
    },
    {
        question: " Q3) What does the next pointer in a node of a Singly Linked List represent?",
        choices: ["Points to the previous node.", "Points to the next node.", " Points to the head.", "Points to NULL."],
        correctAnswers: [1]
    },
    {
        question: " Q4) Which operation is faster in a Singly Linked List compared to an array?",
        choices: [" Searching for an element.", "Accessing the middle element.", " Inserting an element at the beginning.", "Inserting an element at the end."],
        correctAnswers: [2]
    },
    {
        question: " Q5) In a Singly Linked List, if the head is NULL, what does it indicate?",
        choices: ["The list has one node.", "The list is empty.", "The list has an infinite loop.", "The list contains only NULL values"],
        correctAnswers: [1]
    },

    {
        question: "Q6) Is it possible to traverse a singly linked list backward ? If not, why ?",
        choices:["Yes, by using a prev pointer","No, because to the next node","Yes, by reversing the list first","No, because singly linked lists are circular"],
        correctAnswers:[1]
    },
];

let currentQuestion = 0;
let score = 0;

const questionElement = document.getElementById("question");
const choicesElement = document.getElementById("choices");
const nextButton = document.getElementById("next-btn");

function loadQuestion() {
    const question = questions[currentQuestion];
    questionElement.textContent = question.question;
    choicesElement.innerHTML = '';

    question.choices.forEach((choice, index) => {
        const choiceElement = document.createElement("div");
        choiceElement.className = "choice";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `choice-${index}`;
        checkbox.value = index;

        const label = document.createElement("label");
        label.textContent = `  ${choice}`;
        label.htmlFor = `choice-${index}`;

        choiceElement.appendChild(checkbox);
        choiceElement.appendChild(label);

        choicesElement.appendChild(choiceElement);
    });
}

function checkAnswer() {
    const question = questions[currentQuestion];
    const selectedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const selectedIndexes = Array.from(selectedCheckboxes).map(checkbox => parseInt(checkbox.value));

    const isCorrect = JSON.stringify(selectedIndexes.sort()) === JSON.stringify(question.correctAnswers.sort());

    if (isCorrect) {
        score++;
    }

    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    questionElement.textContent = `You scored ${score} out of ${questions.length}!`;
    choicesElement.innerHTML = '';
    nextButton.style.display = "none";
}

nextButton.addEventListener("click", () => {
    checkAnswer();
});

loadQuestion();
