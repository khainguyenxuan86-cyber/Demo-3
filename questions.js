const questions = [

/*
==================================================
MULTIPLE CHOICE
==================================================
*/

{
  type: "multipleChoice",
  question: "What animal is this?",
  image: "images/cat.png",
  choices: ["Dog", "Cat", "Bird", "Fish"],
  answer: "Cat"
},

{
  type: "multipleChoice",
  question: "What animal is this?",
  image: "images/dog.png",
  choices: ["Dog", "Cat", "Bird", "Fish"],
  answer: "Dog"
},

{
  type: "multipleChoice",
  question: "What is the past tense of 'go'?",
  choices: ["Goed", "Went", "Gone", "Going"],
  answer: "Went"
},

/*
==================================================
UNSCRAMBLE
==================================================
*/

{
  type: "unscramble",
  question: "Put the words in the correct order.",
  image: "images/football.png",
  words: ["football", "I", "every", "play", "Sunday"],
  answer: "I play football every Sunday"
},

{
  type: "unscramble",
  question: "Put the words in the correct order.",
  words: ["likes", "She", "books", "reading"],
  answer: "She likes reading books"
},

/*
==================================================
WRITING
==================================================
IMPORTANT:
- template = the sentence pattern students must follow.
- acceptedAnswers = exact answers accepted by the game.
- sampleAnswer = answer shown when the student is wrong.
- You can add more acceptedAnswers when more than one sentence is acceptable.
==================================================
*/

{
  type: "writing",
  question: "Look at the picture and write one sentence using the sentence pattern.",
  image: "images/pizza.png",

  template: "This is a/an + noun.",

  acceptedAnswers: [
    "This is a pizza."
  ],

  sampleAnswer: "This is a pizza."
},

{
  type: "writing",
  question: "Write one sentence about what you do after school using the sentence pattern.",

  template: "I + verb + after school.",

  acceptedAnswers: [
    "I do my homework after school.",
    "I play football after school.",
    "I watch TV after school."
  ],

  sampleAnswer: "I do my homework after school."
}

];
