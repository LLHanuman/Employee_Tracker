const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

// Questions
const questions = [
    { name: "name", message: "What is the employee's name?" },
    { name: "id", message: "Their ID?" },
    { name: "email", message: "Their Email?" },
    {
        type: "list",
        name: "role",
        message: "What is their title?",
        choices: ["Manager", "Engineer", "Intern"],
    },
];

// Specific questions
const managerQuestions = [{
    name: "office",
    message: "What's the manager's office number?"
}, ];

const engineerQuestions = [{
    name: "github",
    message: "What is the engineer's Github username?"
}, ];

const internQuestions = [{
    name: "school",
    message: "What school does the intern attend?"
}, ];

const confirm = [{
    type: "confirm",
    name: "addEmployee",
    message: "Would you like to add another Employee?",
}, ];

// Adding info to HTML
const start = async() => {
    const employees = [];
    let newEmployee = true;

    while (newEmployee) {
        const { name, id, email, role } = await inquirer.prompt(questions);

        if (role === "Manager") {
            const { office } = await inquirer.prompt(managerQuestions);
            // New Manager
            employees.push(new Manager(name, id, email, office));
        } else if (role === "Engineer") {
            const { github } = await inquirer.prompt(engineerQuestions);
            // New Engineer
            employees.push(new Engineer(name, id, email, github));
        } else {
            const { school } = await inquirer.prompt(internQuestions);
            // New Intern
            employees.push(new Intern(name, id, email, school));
        }
        // Adding another Employee y/n
        const { addEmployee } = await inquirer.prompt(confirm);

        newEmployee = addEmployee;
    }

    const html = render(employees);

    if (!fs.existsSync(outPath)) {
        const error = await mkDir(OUTPUT_DIR);
        error && console.error(error);
    }

    const error = await writeFile(outPath, html);
    error && console.error(error);
};

// Writing files
const mkDir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

start();