$(document).ready(() => {
  $('.btn').click(() => {
    fetch('https://opentdb.com/api.php?amount=2&type=multiple')
      .then((response) => response.json())
      .then((data) => {
        $('.quiz-section').empty();
        displayQuestion(data);
      })
      .catch((error) => {
        alert(`Error: ${error}`);
      });
  });
});

function displayQuestion(data) {
  const quiz = data.results;
  const quizLength = quiz.length;
  let quizIndex = 0;
  let score = 0;
  let correctAnswer = quiz[quizIndex].correct_answer;
  let incorrectAnswers = quiz[quizIndex].incorrect_answers;
  let answers = incorrectAnswers.concat(correctAnswer);
  let shuffledAnswers = _.shuffle(answers);
  let { question } = quiz[quizIndex];
  let questionNumber = quizIndex + 1;
  const totalQuestions = quizLength;
  let questionNumberText = `Question ${questionNumber} of ${totalQuestions}`;
  let questionText = `<h3>${question}</h3>`;
  let questionNumberDiv = `<div class='question-number'>${questionNumberText}</div>`;
  let questionDiv = `<div class='question'>${questionText}</div>`;

  $('.quiz-section').append(questionNumberDiv);
  $('.quiz-section').append(questionDiv);

  for (let i = 0; i < shuffledAnswers.length; i++) {
    const answer = shuffledAnswers[i];
    const answerLabel = `<label class='answer'><input type='radio' name='answer' value='${answer}'><span>${answer}</span></label>`;
    const answerDiv = `<div class='answer-div'>${answerLabel}</div>`;
    $('.quiz-section').append(answerDiv);
  }

  $('input[type="radio"]').change(function () {
    const selectedAnswer = $(this).val();
    $('input[type="radio"]').attr('disabled', true);
    if (selectedAnswer === correctAnswer) {
      score++;
      $(this).parent().addClass('correct');
      $('.score').text(score);
    } else {
      $(this).parent().addClass('incorrect');
      $(this).parent().parent().siblings()
        .find(`label:contains(${correctAnswer})`)
        .parent()
        .addClass('correct');
    }
  });

  const nextButton = '<button class=\'next\'>Next</button>';
  const buttonDiv = `<div class='button-div'>${nextButton}</div>`;
  $('.quiz-section').append(buttonDiv);

  $('.quiz-section').on('click', '.next', () => {
    quizIndex++;
    if (quizIndex < quizLength) {
      $('.quiz-section').empty();
      correctAnswer = quiz[quizIndex].correct_answer;
      incorrectAnswers = quiz[quizIndex].incorrect_answers;
      answers = incorrectAnswers.concat(correctAnswer);
      shuffledAnswers = _.shuffle(answers);
      question = quiz[quizIndex].question;
      questionNumber = quizIndex + 1;
      questionNumberText = `Question ${questionNumber} of ${totalQuestions}`;
      questionText = `<h3>${question}</h3>`;
      questionNumberDiv = `<div class='question-number'>${questionNumberText}</div>`;
      questionDiv = `<div class='question'>${questionText}</div>`;

      $('.quiz-section').append(questionNumberDiv);
      $('.quiz-section').append(questionDiv);

      for (let i = 0; i < shuffledAnswers.length; i++) {
        const answer = shuffledAnswers[i];
        const answerLabel = `<label class='answer'><input type='radio' name='answer' value='${answer}'><span>${answer}</span></label>`;
        const answerDiv = `<div class='answer-div'>${answerLabel}</div>`;
        $('.quiz-section').append(answerDiv);
      }

      $('input[type="radio"]').change(function () {
        const selectedAnswer = $(this).val();
        $('input[type="radio"]').attr('disabled', true);
        if (selectedAnswer === correctAnswer) {
          score++;
          $(this).parent().addClass('correct');
          $('.score').text(score);
        } else {
          $(this).parent().addClass('incorrect');
          $(this).parent().parent().siblings()
            .find(`label:contains(${correctAnswer})`)
            .parent()
            .addClass('correct');
        }
      });

      $('.quiz-section').append(buttonDiv);
    } else {
      $('.quiz-section').empty();
      const scoreText = '<h3 class=\'score-text\'>Score</h3>';
      const correctScore = `<h4 class='correct-score'>Correct: ${score}</h4>`;
      const incorrectScore = `<h4 class='incorrect-score'>Incorrect: ${totalQuestions - score}</h4>`;
      const scoreDiv = `<div class='score-div'>${scoreText}${correctScore}${incorrectScore}</div>`;
      $('.quiz-section').append(scoreDiv);
      const startAgainButton = '<button class=\'start-again\'>Start Again</button>';
      const startAgainDiv = `<div class='start-again-div'>${startAgainButton}</div>`;
      $('.quiz-section').append(startAgainDiv);
    }
  });
}

$('.quiz-section').on('click', '.start-again', () => {
  fetch('https://opentdb.com/api.php?amount=2&type=multiple')
    .then((response) => response.json())
    .then((data) => {
      $('.quiz-section').empty();
      displayQuestion(data);
    })
    .catch((error) => {
      alert(`Error: ${error}`);
    });
});
