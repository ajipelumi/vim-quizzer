$(document).ready(() => {
  $('.btn').click(() => {
    fetch('/api/v1/questions')
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
        if (score === totalQuestions) {
          const wittyMessage = '<h4>Congratulations! You are a Vim Wizard! <i class="fas fa-hat-wizard"></i></h4>';
          const funnyQuote = '<p>"Vim is like magic, once you learn it, it is hard to live without it." - Vim Guru</p>';
          const scoreImgDiv = `<div class='score-img-div'>${wittyMessage}${funnyQuote}</div>`;
          $('.quiz-section').append(scoreImgDiv);
        } else if (score > totalQuestions / 2) {
          const wittyMessage = '<h4>Well done! You are a Vim Prodigy! <i class="fas fa-user-graduate"></i></h4>';
          const funnyQuote = '<p>"Vim is like a hidden talent, once you master it, you will impress everyone around you!" - Vim Guru</p>';
          const scoreImgDiv = `<div class='score-img-div'>${wittyMessage}${funnyQuote}</div>`;
          $('.quiz-section').append(scoreImgDiv);
        } else {
          const wittyMessage = '<h4>Good effort! You are a Vim Rookie! <i class="fas fa-user-graduate"></i> Keep practicing!</h4>';
          const funnyQuote = '<p>"Vim is like learning to ride a bike, it may seem tricky at first, but with time, you will be flying through code like a pro." - Vim Guru</p>';
          const scoreImgDiv = `<div class='score-img-div'>${wittyMessage}${funnyQuote}</div>`;
          $('.quiz-section').append(scoreImgDiv);
        }

        const scoreText = '<h4 class=\'score-text\'>Your Score</h4>';
        const correctScore = `<h5 class='correct-score'>Correct Questions: ${score}</h5>`;
        const incorrectScore = `<h5 class='incorrect-score'>Incorrect Questions: ${totalQuestions - score}</h5>`;
        const scoreDiv = `<div class='score-div'>${scoreText}${correctScore}${incorrectScore}</div>`;
        $('.quiz-section').append(scoreDiv);
        const startAgainButton = '<button class=\'start-again\'>Start Again</button>';
        const startAgainDiv = `<div class='start-again-div'>${startAgainButton}</div>`;
        $('.quiz-section').append(startAgainDiv);

        const shareScore = `<h5 class='share-score'>Share your score on social media!</h5>`;
        const shareButtons = `<div class='share-buttons'><a href='https://twitter.com/intent/tweet?text=I%20scored%20${score}%20out%20of%20${totalQuestions}%20on%20Vim%20Quizzer!%20How%20well%20do%20you%20know%20Vim%3F%20Take%20the%20quiz%20here%3A%20https%3A%2F%2Fquiz.pelumi.tech%2F' target='_blank'><i class='fab fa-twitter'></i></a>
        <a href='https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fquiz.pelumi.tech%2F&quote=I%20scored%20${quizScore}%20out%20of%20${totalQuestions}%20on%20Vim%20Quizzer!%20How%20well%20do%20you%20know%20Vim%3F%20Take%20the%20quiz%20here%3A%20https%3A%2F%2Fquiz.pelumi.tech%2F' target='_blank'><i class='fab fa-facebook'></i></a>
        <a href='https://api.whatsapp.com/send?text=I%20scored%20${score}%20out%20of%20${totalQuestions}%20on%20Vim%20Quizzer!%20How%20well%20do%20you%20know%20Vim%3F%20Take%20the%20quiz%20here%3A%20https%3A%2F%2Fquiz.pelumi.tech%2F' target='_blank'><i class='fab fa-whatsapp'></i></a>
        const shareDiv = `<div class='share-div'>${shareScore}${shareButtons}</div>`;
        $('.quiz-section').append(shareDiv);
    }
  });
}

$('.quiz-section').on('click', '.start-again', () => {
  fetch('/api/v1/questions')
    .then((response) => response.json())
    .then((data) => {
      $('.quiz-section').empty();
      displayQuestion(data);
    })
    .catch((error) => {
      alert(`Error: ${error}`);
    });
});
