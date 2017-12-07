const express = require('express');
const Question = require('../models/question');
const Answer = require('../models/answer'); 
const catchErrors = require('../lib/async-error');
const Favorite = require('../models/Favorite');
const User = require('../models/user');


module.exports = io => {
  const router = express.Router();
  console.log("시작할때마다 사용자 연결 되었는지 확인.");    
  
  function needAuth(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      req.flash('danger', 'Please signin first.');
      res.redirect('/signin');
    }
  }

  /* GET questions listing. */
  router.get('/', catchErrors(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    console.log("게시판 목록으로 이동합니다.");    
    
    var query = {};
    const term = req.query.term;
    if (term) {
      query = {$or: [
        {title: {'$regex': term, '$options': 'i'}},
        {content: {'$regex': term, '$options': 'i'}},
        {typeOfEvent: {'$regex': term, '$options': 'i'}},
        {location: {'$regex': term, '$options': 'i'}},
        {name: {'$regex': term, '$options': 'i'}},
        {nameDetail: {'$regex': term, '$options': 'i'}},
        {Price: {'$regex': term, '$options': 'i'}},
        {startshour: {'$regex': term, '$options': 'i'}},
        {startsmin: {'$regex': term, '$options': 'i'}},
        {finishshour: {'$regex': term, '$options': 'i'}},
        {finishsmin: {'$regex': term, '$options': 'i'}},
        {SDate: {'$regex': term, '$options': 'i'}},
        {FDate: {'$regex': term, '$options': 'i'}},                       
        {money: {'$regex': term, '$options': 'i'}},                       
        {sector: {'$regex': term, '$options': 'i'}} 
      ]};
    }
    const questions = await Question.paginate(query, {
      sort: {createdAt: -1}, 
      populate: 'author', 
      page: page, limit: limit
    });
    res.render('questions/index', {questions: questions, term: term, query: req.query});
  }));

  router.get('/new', needAuth, (req, res, next) => {
    res.render('questions/new', {question: {}});
    console.log("새로운 게시물을 만듭니다.");
  });

  router.get('/:id/edit', needAuth, catchErrors(async (req, res, next) => {
    const question = await Question.findById(req.params.id);
    res.render('questions/edit', {question: question});
    console.log("게시물을 편집하러 갑니다.");    
  }));


  router.get('/:id', catchErrors(async (req, res, next) => {
    console.log("게시판을 읽으러 들어갑니다.");    
 
    
    const question = await Question.findById(req.params.id).populate('author');
    const answers = await Answer.find({question: question.id}).populate('author');
    question.numReads++;    // TODO: 동일한 사람이 본 경우에 Read가 증가하지 않도록???
    
    await question.save();
    
    res.render('questions/show', {question: question, answers: answers});
  }));

  router.post('/:id', needAuth, catchErrors(async (req, res, next) => {
    console.log("편집완료.");    
    
    var Start_Date =  req.body.SDate;
    var Finish_Date = req.body.FDate;
    var Start_Date_Edit = Start_Date.toString();
    var Finish_Date_Edit = Finish_Date.toString();
    var Start_Final = Start_Date_Edit.substring(0,15);
    var Finish_Final = Finish_Date_Edit.substring(0,15);
    console.log(Start_Final, "시작날 설정");    
    console.log(Finish_Final, "끝나는 날 설정");   

    const question = await Question.findById(req.params.id);
    
        if (!question) {
          req.flash('danger', 'Not exist question');
          return res.redirect('back');
        }
        question.title = req.body.title;
        question.content = req.body.content;
        question.typeOfEvent = req.body.typeOfEvent;
        question.location = req.body.location;
        question.name = req.body.name;
        question.nameDetail = req.body.nameDetail; 
        question.Price = req.body.Price;    
        question.startshour = req.body.startshour;    
        question.startsmin = req.body.startsmin;    
        question.finishshour = req.body.finishshour;    
        question.finishsmin = req.body.finishsmin;    
        question.SDate = req.body.SDate;    
        question.FDate = req.body.FDate;    
        question.money = req.body.money;            
        question.ViewSDate = Start_Final;    
        question.ViewFDate = Finish_Final;    
        question.sector = req.body.sector;    
        
        question.tags = req.body.tags.split(" ").map(e => e.trim());

        await question.save();
        req.flash('success', 'Successfully updated');
        res.redirect('/questions');    
        console.log(question);
        
  }));

  router.delete('/:id', needAuth, catchErrors(async (req, res, next) => {
    console.log("게시판 삭제를 합니다");    
    
    await Question.findOneAndRemove({_id: req.params.id});
    req.flash('success', 'Successfully deleted');
    res.redirect('/questions');
  }));

  router.post('/', needAuth, catchErrors(async (req, res, next) => {
    console.log("게시물 생성중입니다.");    
    
    const user = req.user;
    var Start_Date =  req.body.SDate;
    var Finish_Date = req.body.FDate;
    var Start_Date_Edit = Start_Date.toString();
    var Finish_Date_Edit = Finish_Date.toString();
    var Start_Final = Start_Date_Edit.substring(0,15);
    var Finish_Final = Finish_Date_Edit.substring(0,15);
    console.log(Start_Final, "시작날 설정");    
    console.log(Finish_Final, "끝나는 날 설정");   

    var question = new Question({
      title: req.body.title,
      typeOfEvent: req.body.typeOfEvent,      
      author: user._id,
      content: req.body.content,
      location: req.body.location,
      name: req.body.name,
      nameDetail: req.body.nameDetail,
      Price: req.body.Price,      
      startsmin: req.body.startsmin,      
      startshour: req.body.startshour,      
      finishshour: req.body.finishshour,      
      finishsmin: req.body.finishsmin,      
      SDate: req.body.SDate,      
      FDate: req.body.FDate,      
      ViewSDate: Start_Final,
      ViewFDate: Finish_Final,
      money: req.body.money,
      sector: req.body.sector,
      
      tags: req.body.tags.split(" ").map(e => e.trim()),
    });
    console.log(question);
    
    await question.save();
    req.flash('success', 'Successfully posted');
    res.redirect('/questions');
    console.log("게시물을 성공적으로 업로드하였습니다.");    
    
  }));

  router.post('/:id/answers', needAuth, catchErrors(async (req, res, next) => {
    console.log("댓글을 달았습니다.");    
    
    const user = req.user;
    const question = await Question.findById(req.params.id);
    console.log(question.author , "- 게시판 주인");
    console.log(user.id , "- 댓글 주인");
    
    if (!question) {
      req.flash('danger', 'Not exist question');
      return res.redirect('back');
    }

    var answer = new Answer({
      author: user._id,
      question: question._id,
      content: req.body.content
    });
    await answer.save();
    question.numAnswers++;
    await question.save();
    
    const url = `/questions/${question._id}#${answer._id}`;
    io.to(question.author.toString())
      .emit('answered', {url: url, question: question});
    console.log('SOCKET EMIT', question.author.toString(), 'answered', {url: url, question: question})
    req.flash('success', 'Successfully answered');
    res.redirect(`/questions/${req.params.id}`);
  }));

  router.post('/:id/Favorite', needAuth, catchErrors(async (req, res, next) => {
    console.log("Favorite 추가를 눌렀습니다.");    
    console.log(req.params.id, "방 아이디");
    console.log(req.user.id, "유저아이디");    
    const question = await Question.findById(req.params.id).populate('author');
    console.log(question.title, "방제");    
    console.log(question.ViewSDate, "시작날짜");    
    


    Question.findById(req.params.id, function(err, question){ 
      User.findById(req.user.id, function(err,user){
        var newFavorite = new Favorite({
            site_id: req.params.id,
            user_id: req.user.id,
            site_title : question.title,
            site_SDate : question.ViewSDate
        });  
  
        newFavorite.save(function(err){
          if (err) {
            res.send(err);
          } else {
            req.flash('success', 'Successfully added.');
            res.redirect('back');
          }
        });
      });
    });
  
    
  }));

  return router;
}