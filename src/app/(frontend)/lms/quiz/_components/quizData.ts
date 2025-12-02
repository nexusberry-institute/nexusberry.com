export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export const quizData: Question[] = [
  {
    id: 1,
    text: "What will be the output of the following code?\n\ndef greet():\n    return \"Hi\"\nprint(greet())",
    options: ["None", "Hi", "\"greet\"", "Error"],
    correctAnswer: 1,
    explanation: "The function returns \"Hi\", and print() displays it."
  },
  {
    id: 2,
    text: "What is the output?\n\ndef add(a, b=3):\n    return a + b\nprint(add(2))",
    options: ["3", "5", "2", "Error"],
    correctAnswer: 1,
    explanation: "b uses its default value 3 since only one argument is passed → 2+3=5."
  },
  {
    id: 3,
    text: "Identify the problem:\n\ndef append_item(item, items=[]):\n    items.append(item)\n    return items\n\nprint(append_item(1))\nprint(append_item(2))",
    options: ["Works fine", "Raises TypeError", "Keeps appending to the same list", "Creates new list each time"],
    correctAnswer: 2,
    explanation: "Default mutable arguments persist between calls — same list reused."
  },
  {
    id: 4,
    text: "What is the correct call for this function?\n\ndef func(a, *, b):\n    print(a, b)",
    options: ["func(1, 2)", "func(a=1, 2)", "func(1, b=2)", "func(a=1, b)"],
    correctAnswer: 2,
    explanation: "The * forces b to be a keyword-only argument."
  },
  {
    id: 5,
    text: "What will this print?\n\nx = 10\ndef show():\n    x = 5\n    print(x)\nshow()\nprint(x)",
    options: ["5 then 10", "10 then 5", "5 then 5", "10 then 10"],
    correctAnswer: 0,
    explanation: "Local x=5 inside the function; global x=10 outside."
  },
  {
    id: 6,
    text: "Which statement correctly imports only the sqrt() function from the math module?",
    options: ["import sqrt from math", "import math.sqrt", "from math import sqrt", "include math.sqrt"],
    correctAnswer: 2,
    explanation: "The correct syntax is 'from module import function'."
  },
  {
    id: 7,
    text: "What does this output?\n\nf = lambda x, y: x * y\nprint(f(2, 3))",
    options: ["2x3", "6", "23", "Error"],
    correctAnswer: 1,
    explanation: "lambda defines an anonymous function. 2*3=6."
  },
  {
    id: 8,
    text: "What is the output?\n\nnums = [1, 2, 3, 4]\nevens = list(filter(lambda x: x % 2 == 0, nums))\nprint(evens)",
    options: ["[1, 3]", "[2, 4]", "[1, 2, 3, 4]", "None"],
    correctAnswer: 1,
    explanation: "filter() keeps values where the condition is True."
  },
  {
    id: 9,
    text: "What is the output of:\n\ndef count(n):\n    if n == 0:\n        return\n    print(n)\n    count(n-1)\ncount(3)",
    options: ["3 3 3", "1 2 3", "3 2 1", "Error"],
    correctAnswer: 2,
    explanation: "Function calls itself decreasing n → prints 3 → 2 → 1."
  },
  {
    id: 10,
    text: "What will this code output?\n\ndef gen():\n    yield 1\n    yield 2\ng = gen()\nprint(next(g))\nprint(next(g))",
    options: ["1 1", "1 2", "2 1", "Error"],
    correctAnswer: 1,
    explanation: "Each next() retrieves the next yielded value in sequence."
  }
];

// export const quizData: Question[] = [
//   {
//     id: 1,
//     text: "What is the capital of France?",
//     options: ["London", "Berlin", "Paris", "Madrid"],
//     correctAnswer: 2
//   },
//   {
//     id: 2,
//     text: "Which planet is known as the Red Planet?",
//     options: ["Venus", "Mars", "Jupiter", "Saturn"],
//     correctAnswer: 1
//   },
//   {
//     id: 3,
//     text: "Who painted the Mona Lisa?",
//     options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
//     correctAnswer: 2
//   }
// ];