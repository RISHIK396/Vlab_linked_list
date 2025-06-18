class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    sleep = ms => new Promise(res => setTimeout(res, ms));

    getNodeAt(index) {
        let curr = this.head, i = 1;
        while (curr && i < index) curr = curr.next, i++;
        return curr;
    }

    async traverseToIndex(index) {
        let curr = this.head, i = 1;
        const [arrows, nodes, head, headarrow] = [
            document.querySelectorAll(".arrow"),
            document.querySelectorAll(".node"),
            document.querySelector(".head-pointer"),
            document.querySelector(".head-arrow")
        ];

        head.classList.add("blink-found");
        await this.sleep(1000);
        head.classList.remove("blink-found");

        headarrow.classList.add("pointer-expands");
        await this.sleep(1000);
        headarrow.classList.remove("pointer-expands");

        while (curr && i < index) {
            if (nodes[i - 1]) nodes[i - 1].classList.add("traverse-node");
            await this.sleep(400);
            if (arrows[i - 1]) arrows[i - 1].classList.add("traverse-arrow");
            await this.sleep(400);
            if (nodes[i - 1]) {
                nodes[i - 1].classList.add("blink-node");
                await this.sleep(300);
                nodes[i - 1].classList.remove("blink-node", "traverse-node");
            }
            if (arrows[i - 1]) arrows[i - 1].classList.remove("traverse-arrow");
            curr = curr.next;
            i++;
        }
    }

    async insertAt(value, index) {
        document.getElementById("searchResult").textContent = "";
        if (index < 1 || index > this.size + 1) return alert("Valid index: 1 to " + (this.size + 1));
        await this.traverseToIndex(index);

        const newNode = new Node(value);
        if (index === 1) this.head = newNode, newNode.next = this.head;
        else {
            const prev = this.getNodeAt(index - 1);
            newNode.next = prev.next;
            prev.next = newNode;
        }
        this.size++;
        this.display();

        const nodes = document.querySelectorAll(".node");
        if (nodes[index - 1]) {
            nodes[index - 1].style.opacity = "0";
            nodes[index - 1].style.transform = "scale(0.7)";
            setTimeout(() => {
                nodes[index - 1].style.transition = "opacity 0.6s, transform 0.6s";
                nodes[index - 1].style.opacity = "1";
                nodes[index - 1].style.transform = "scale(1)";
            }, 100);
        }
    }

    async deleteAt(index) {
        document.getElementById("searchResult").textContent = "";
        if (index < 1 || index > this.size) return alert("Valid index: 1 to " + this.size);
        await this.traverseToIndex(index);

        const nodes = document.querySelectorAll(".node");
        if (nodes[index - 1]) {
            nodes[index - 1].style.transition = "opacity 0.5s";
            nodes[index - 1].style.opacity = "0";
            await this.sleep(500);
        }

        if (index === 1) this.head = this.head.next;
        else {
            const prev = this.getNodeAt(index - 1);
            prev.next = prev.next.next;
        }

        this.size--;
        this.display();
    }

    async search(value) {
        const nodes = document.querySelectorAll(".node"),
              arrows = document.querySelectorAll(".arrow"),
              nodeVals = document.querySelectorAll(".node-value"),
              head = document.querySelector(".head-pointer"),
              headArrow = document.querySelector(".head-arrow"),
              nullSign = document.querySelector(".null-sign");
        
        let curr = this.head, index = 1, found = [];

        nodes.forEach(n => n.classList.remove("traverse-node", "blink-node", "blink-found"));
        arrows.forEach(a => a.classList.remove("traverse-arrow"));
        nodeVals.forEach(v => {
            v.classList.remove("blink-node", "blink-found");
            if (v.dataset.blinkInterval) clearInterval(v.dataset.blinkInterval);
        });

        head.classList.add("blink-found");
        await this.sleep(1000);
        head.classList.remove("blink-found");
        headArrow.classList.add("pointer-expands");
        await this.sleep(1000);
        headArrow.classList.remove("pointer-expands");

        while (curr) {
            const valDiv = nodes[index - 1]?.querySelector(".node-value");
            if (valDiv) {
                valDiv.classList.add("blink-node");
                await this.sleep(300);
                valDiv.classList.remove("blink-node");
                if (curr.value === value) {
                    found.push(index);
                    valDiv.classList.add("blink-found");
                    document.getElementById("searchResult").textContent = `Indices: ${found.join(", ")}`;
                }
            }
            if (nodes[index - 1]) {
                nodes[index - 1].classList.add("traverse-node");
                await this.sleep(400);
            }
            if (arrows[index - 1]) {
                arrows[index - 1].classList.add("traverse-arrow");
                await this.sleep(400);
            }
            curr = curr.next;
            index++;
        }

        if (nullSign) {
            nullSign.classList.add("blink-null");
            await this.sleep(1000);
            nullSign.classList.remove("blink-null");
        }

        await this.sleep(1000);
        nodeVals.forEach(v => v.classList.remove("blink-found"));
        if (!found.length) document.getElementById("searchResult").textContent = "Not Found";
    }

    async createFromValues(values) {
        this.head = null;
        this.size = 0;
        let prev = null;
        values.forEach((val, i) => {
            const newNode = new Node(val);
            if (i === 0) this.head = newNode;
            else prev.next = newNode;
            prev = newNode;
            this.size++;
        });
        this.display();
    }

    display() {
        const listContainer = document.getElementById("linkedList");
        listContainer.innerHTML = "";
        let curr = this.head, index = 1;

        while (curr) {
            const wrapper = document.createElement("div");
            wrapper.className = "node-wrapper";

            const node = document.createElement("div");
            node.className = "node";
            node.innerHTML = `
                ${index === 1 ? `<div class="head-pointer">HEAD</div><div class="head-arrow">↓</div>` : ""}
                <div class="node-value">${curr.value}</div>
                <div class="node-pointer"><span class="arrow">→</span></div>
            `;

            const indexDiv = document.createElement("div");
            indexDiv.className = "node-index";
            indexDiv.textContent = `Index: ${index}`;

            wrapper.appendChild(node);
            wrapper.appendChild(indexDiv);
            listContainer.appendChild(wrapper);
            curr = curr.next;
            index++;
        }

        const pointers = document.querySelectorAll(".node-pointer");
        if (pointers.length) pointers[pointers.length - 1].innerHTML = `<span class="null-sign">∅</span>`;
    }

    highlightNode(index) {
        const node = document.querySelectorAll(".node")[index - 1];
        if (node) {
            node.classList.add("blink-node");
            setTimeout(() => node.classList.remove("blink-node"), 500);
        }
    }
}

const linkedList = new LinkedList();
let isOperationRunning = false;

async function runSimulation() {
    if (isOperationRunning) return alert("Please wait, operation in progress.");
    isOperationRunning = true;

    try {
        const val = id => document.getElementById(id).value.trim();
        const get = id => document.getElementById(id);
        const [insVis, delVis, srcVis] = [
            get("insertDeleteFields").style.display !== "none",
            get("deleteField").style.display !== "none",
            get("searchField").style.display !== "none"
        ];

        if (insVis) {
            if (val("nodeValue") && val("nodeIndex") && !isNaN(val("nodeValue")) && !isNaN(val("nodeIndex")))
                await linkedList.insertAt(+val("nodeValue"), +val("nodeIndex"));
            else alert("Enter valid value and index.");
        } else if (srcVis) {
            if (val("searchValue") && !isNaN(val("searchValue")))
                await linkedList.search(+val("searchValue"));
            else alert("Enter valid value.");
        } else if (delVis) {
            if (val("deleteindex") && !isNaN(val("deleteindex")))
                await linkedList.deleteAt(+val("deleteindex"));
            else alert("Enter valid index.");
        }
    } finally {
        isOperationRunning = false;
    }
}

function resetInputs() {
    ["nodeValues", "nodeValue", "nodeIndex", "deleteindex", "searchValue"].forEach(id => document.getElementById(id).value = "");
}

function toggleFields(show) {
    resetInputs();
    document.getElementById('insertDeleteFields').style.display = show === "insert" ? 'block' : 'none';
    document.getElementById('deleteField').style.display = show === "delete" ? 'block' : 'none';
    document.getElementById('searchField').style.display = show === "search" ? 'block' : 'none';
    document.getElementById('runSimulationButton').style.display = 'block';
}

function showInsertFields() { toggleFields("insert"); }
function showDeleteFields() { toggleFields("delete"); }
function showSearchField() { toggleFields("search"); }

function createList() {
    const input = document.getElementById("nodeValues").value.trim();
    if (!input) return alert("Enter values to create a list.");
    const values = input.split(",").map(x => +x.trim()).filter(x => !isNaN(x));
    if (!values.length) return alert("Invalid input. Use comma-separated numbers.");
    if (values.length > 8) return alert("Max 8 values allowed.");
    linkedList.createFromValues(values);
    document.getElementById("operations").style.display = "block";
}