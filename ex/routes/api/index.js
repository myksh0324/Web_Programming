const express = require('express');
const Question = require('../../models/question'); 
const Answer = require('../../models/answer'); 
const LikeLog = require('../../models/like-log');
const catchErrors = require('../../lib/async-error');

const router = express.Router();

router.use(catchErrors(async (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    next({status: 401, msg: 'Unauthorized'});
  }
}));

router.use('/questions', require('./questions'));


// Like for Question
router.post('/questions/:id/like', catchErrors(async (req, res, next) => {
  console.log("Join 눌렀습니다.")
  const user = req.user;
  
  const question = await Question.findById(req.params.id);
  console.log(question, "정보입니다.");
  console.log(user.id , "- 참여인");
  console.log(question.joinPeople.length, "배열 길이입니다.");
  question.joinPeople.push(user.email);
  console.log(question , "재정보입니다.");
  
  if (!question) {
    return next({status: 404, msg: 'Not exist question'});
  }
  var likeLog = await LikeLog.findOne({author: req.user._id, question: question._id});
  if (!likeLog) {
    question.numLikes++;
    await Promise.all([
      question.save(),
      LikeLog.create({author: req.user._id, question: question._id})
    ]);
  }
  return res.json(question);
}));

// Like for Answer
router.post('/answers/:id/like', catchErrors(async (req, res, next) => {
  const answer = await Answer.findById(req.params.id);
  answer.numLikes++;
  await answer.save();
  return res.json(answer);
}));

router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: err.status,
    msg: err.msg || err
  });
});

module.exports = router;
