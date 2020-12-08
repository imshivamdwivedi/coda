const axios = require('axios');
var express = require('express');
var route = express.Router();
const Team =  require('../Server/modals/team');
var MongoClient = require('mongodb').MongoClient;

//home route
route.get('/',(req,res)=>{
    res.render('index',{
        msg:"Welcome "
    });
});

//team page
route.get('/addName',(req,res)=>{
  res.render('team',{
    msg:"Register New Team Here !"
  });
});

//Add team Name route 
route.post('/addTeamName',(req,res)=>{
   console.log(req.body);  
    var team = new Team({
       team_name:req.body.team_name
     });
     console.log(team);
    
     team.save();
     res.render('team',{
       msg:"Add Another Team !"
     })
})

//learderboard route
route.get('/leaderBoard/:page',(req,res)=>{
  var perPage = 10
  var page = req.params.page || 1
  var score = 'score'
  var docs  =  Team.find({}).sort({wins:-1})
  try {
    docs
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err, teams) {
        Team.countDocuments().exec(function(err, count) {
            if (err) return next(err)
            res.render('board', {
                docs: teams,
                current: page,
                pages: Math.ceil(count / perPage)
            })
        })
    })
  }catch (e) {
    console.log("Error :- ", e);
  }  
}); 

//leaderboard sort by name route
route.get('/leaderBoard/:page/sortByName',(req,res)=>{
  var perPage = 10
  var page = req.params.page || 1
  var docs  =  Team.find({}).sort({team_name:'asc'})
  try {
    

    docs
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err, teams) {
        Team.countDocuments().exec(function(err, count) {
            if (err) return next(err)
            res.render('board', {
                docs: teams,
                current: page,
                pages: Math.ceil(count / perPage)
            })
        })
    })
  }catch (e) {
    console.log("Error :- ", e);
  }  
}); 

//search team route
route.post('/search',(req,res)=>{
  var {team_name} =req.body;
  // console.log(team_name)
    Team.find({team_name}).exec((err,response)=>{
        if(err){
         return res.send(err);
        }
        
        if(response){
          res.render('msg',{
            msg:"Required Team Details",
            docs:response
           });
          }
         
    });
})

//score page route
route.get('/Score',(req,res)=>{
    res.render('score',{
      msg:"Decide Matches Here !"
    });
});  

//score assign route
route.post('/Score',async(req,res)=>{
     var {t1,t2,team1,team2,draw} = req.body;
      team1 =parseInt(req.body.team1);
      team2 =parseInt(req.body.team2);
      draw =parseInt(req.body.draw);
      console.log(team1);
      console.log(team2);
      console.log(draw);
     if(team1==1 && team2==0 && draw==0){  //team 1 wins
    

      await Team.updateOne({
      team_name:t1
     }, 
     {
       $inc : {'wins' : 0.5,'score':1.5}  
     }, 
     {new: true, upsert: true},
 
     function(err, results) {
       console.log(results);
       
     });
     
     await Team.updateOne({
      team_name:t2
     }, 
     {
       $inc : {'losses' : 0.5}  
     }, 
     {new: true, upsert: true},
 
     function(err, results) {
       console.log(results);
     });

     res.render('score',{
      msg:" Added result Succesfully !"
     });

     }else if(team1==0 && team2==1 && draw==0){  //team 2 wins
      await Team.updateOne({
        team_name:t2
       }, 
       {
         $inc : {'wins' : 0.5,'score':1.5}  
       }, 
       {new: true, upsert: true},
   
       function(err, results) {
         console.log(results);
       });

       await Team.updateOne({
        team_name:t1
       }, 
       {
         $inc : {'losses':1}  
       }, 
       {new: true, upsert: true},
   
       function(err, results) {
         console.log(results);
       });

       res.render('score',{
        msg:" Added result Succesfully !"
       });

     }else if(team1==0 && team2==0 && draw==1){ //draw
      await Team.updateOne({
        team_name:t2
       }, 
       {
         $inc : {'draw' : 0.5,'score':0.5}  
       }, 
       {new: true, upsert: true},
   
       function(err, results) {
         console.log(results.result);
       });

       await Team.updateOne({
        team_name:t1
       }, 
       {
         $inc : {'draw' : 0.5,'score':0.5}  
       }, 
       {new: true, upsert: true},
   
       function(err, results) {
         console.log(results);
       });

       res.render('score',{
        msg:" Added result Succesfully !"
       });
     }else{
      res.render('score',{
        msg:" Sorry , opeartion failed. Please give valid Inputs!"
      });
     }
     

});  

//data from api route
route.get('/fetchData', async(req,res)=>{
  axios.get('https://s3-ap-southeast-1.amazonaws.com/he-public-data/Leaderboard_Initial_Dataset65148c7.json')
     .then(function (response) {   
       var data = response.data;
       for(var i=0; i<data.length; i++) {
           var team = new Team({
               team_name: data[i].team_name,
               wins: data[i].wins,
               losses: data[i].losses,
               ties: data[i].draw,
               score: data[i].score,
            });
              team.save();
       } 
       res.render('index',{
         msg:"Data Added in DataBase "
       });
        
     })
     .catch(function (error) {
        res.render('index',{
          msg:"Something went wrong! Please try again"
       });
     })
    
 });

module.exports = route;
