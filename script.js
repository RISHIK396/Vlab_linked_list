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
function performSearch() {
    const arrayInput = document.getElementById("arrayInput").value;
    const targetInput = document.getElementById("targetInput").value;


    const array = arrayInput.split(",").map(item => item.trim());


    const isNumericArray = array.every(item => !isNaN(parseFloat(item)));
    if (!isNumericArray) {
        displayResults(["Input array must contain only numeric or floating-point values."]);
        return;
    }


    if (array.length > 15) {
        displayResults(["Input array cannot have more than 15 elements."]);
        return;
    }

    const isAlphanumeric = array.some(item => !/^-?\d*\.?\d+$/.test(item));
    if (isAlphanumeric) {
        displayResults(["Input array must contain only numeric or floating-point values."]);
        return;
    }

    const target = parseFloat(targetInput);

    const isSorted = checkSort(array);

    let searchType;
    if (isSorted) {
        searchType = "Binary Search";
        binarySearchWithSteps(array.map(Number), target);
    } else {
        searchType = "Linear Search";
        linearSearchWithSteps(array.map(Number), target);
    }

    displayResults([`Performing ${searchType}...`]);
}

function checkSort(array) {
    for (let i = 1; i < array.length; i++) {
        if (parseFloat(array[i]) < parseFloat(array[i - 1])) {
            return false;
        }
    }
    return true;
}


function displayArray(array, status) {
    const arrayContainer = document.getElementById("arrayContainer");
    arrayContainer.innerHTML = "";

    for (let index = 0; index < array.length; index++) {
        const elementDiv = document.createElement("div");
        elementDiv.textContent = array[index];
        elementDiv.classList.add("array-element", status);
        arrayContainer.appendChild(elementDiv);
    }
}
function displayResults(statements) {
    const resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = "";

    for (let i = 0; i < statements.length; i++) {
        const statementDiv = document.createElement("div");
        statementDiv.innerHTML = statements[i];

        if (statements[i].includes("Target element found at index")) {
            statementDiv.classList.add("foundg");
        } else if (statements[i] === "Target element not found in the array.") {
            statementDiv.classList.add("not-found");
        }

        resultsContainer.appendChild(statementDiv);
    }
}

async function binarySearchWithSteps(array, target) {
    const resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = "";

    let low = 0;
    let high = array.length - 1;
    let foundIndex = -1;
    const steps = [];

    while (low <= high && foundIndex === -1) {
        const midValue = Math.floor((low + high) / 2);
        const currentArray = array.slice(low, high + 1); // Only the current search range
        displayArray(currentArray, "unchecked");

        const stepElement = document.getElementsByClassName("array-element")[midValue - low];
        stepElement.classList.remove("unchecked");
        stepElement.classList.add("checked");
        const stepStatement = `Checking element at index ${midValue}. Array: [${currentArray.join(', ')}]`;

        steps.push(stepStatement);
        displayResults(steps);
        await sleep(1000);

        if (array[midValue] === target) {
            foundIndex = midValue;
        } else if (array[midValue] < target) {
            low = midValue + 1;
        } else {
            high = midValue - 1;
        }
    }

    if (foundIndex !== -1) {
        const stepArray = array.slice(low, high + 1);
        const foundElement = document.getElementsByClassName("array-element")[foundIndex - low];
        foundElement.classList.remove("checked");
        foundElement.classList.add("found", "blink");
        const foundStatement = `Target element found at index ${foundIndex}. Array: [${stepArray.join(', ')}]`;
        steps.push(foundStatement);
        displayResults(steps);
    } else {
        const notFoundStatement = "Target element not found in the array.";
        steps.push(notFoundStatement);
        displayResults(steps);
    }
}

async function linearSearchWithSteps(array, target) {
    const resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = "";

    let foundIndex = -1;
    const steps = [];

    for (let index = 0; index < array.length && foundIndex === -1; index++) {
        const stepArray = [...array];
        displayArray(stepArray, "unchecked");

        const stepElement = document.getElementsByClassName("array-element")[index];
        stepElement.classList.remove("unchecked");
        stepElement.classList.add("checked");
        const stepStatement = `Iteration ${index + 1}: Checking element at index ${index}. Array: [${stepArray.join(', ')}]`;

        steps.push(stepStatement);
        displayResults(steps);
        await sleep(1000);

        if (stepArray[index] === target) {
            foundIndex = index;
        }
    }

    if (foundIndex !== -1) {
        const stepArray = [...array];
        const foundElement = document.getElementsByClassName("array-element")[foundIndex];
        foundElement.classList.remove("checked");
        foundElement.classList.add("found", "blink");
        const foundStatement = `Target element found at index ${foundIndex}. Array: [${stepArray.join(', ')}]`;
        steps.push(foundStatement);
        displayResults(steps);
    } else {
        const notFoundStatement = "Target element not found in the array.";
        steps.push(notFoundStatement);
        displayResults(steps);
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Quiz script

const questions = [
    {
        question: " What is the time complexity of inserting a node at the beginning of a Singly Linked List?",
        choices: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        correctAnswers: [0]
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
