//Requiring necessary modules
var update = require('../models/update');
var day = require('../models/day');
var user = require('../models/user');
const { body, validationResult } = require('express-validator');
var mongoose = require('mongoose');
const e = require('express');
mongoose.set('useCreateIndex', true);
//All POST requests

//Updating the amount of water, sugar, and sodium consumed
exports.addInfo = async function(req, res) {
    try{
        //Makes sure that the elements passed in are vlaid
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            var spot = errors.array()[0].param;
            if(spot === "water"){
                spot = " for Water"
            }
            else if(spot === "sugar"){
                spot = " for Sugar"
            }
            // else if(spot === "sodium"){
            //     spot = " for Sodium"
            // }
            else{
                spot = "s"
            }
            return res.status(400).send({ message: "Invalid value" + spot });
        }
        
        //If theres no current tracked date for the user (this part should not run)
        if(req.user.trackedDate === null){

            //Gets time and date from the client
            const time = req.body.time;
            const date = req.body.date;

            //Makes and saves the day with the new values passed in
            // soGoal: req.user.soGoal, sodium: req.body.sodium,
            var todayModel = new day({wGoal: req.user.wGoal, suGoal: req.user.suGoal, 
                water: req.body.water, sugar: req.body.sugar, date:date});

            await todayModel.save((err)=>{
                if(err){
                    res.status(400).send({message:"Total amounts today cannot be negative"});
                    return;
                }
                //res.status(200).send({message:"Tracked!"});
                return;
            })

            //Gets the user and links the day object to it
            var currentuser = await user.findOne({ username: req.user.username });
            //console.log(currentuser.name);
            currentuser.currentDay = todayModel;
            currentuser.trackedDate = date;

            //Makes an update object for us to refer back to in the future if we wanted to see past updates
            //COULD POTENTIALLY ADD A NOTE FIELD TOO
            // sodium: req.body.sodium,
            var updateModel = new update({water: req.body.water, sugar: req.body.sugar, time: time});
            await updateModel.save((err)=>{
                if(err){
                    res.status(400).send({message:"Error updating info"});
                    return;
                }
                //res.status(200).send({message:"Tracked!"});
                return;
            })

            //ADding the update into the array of updates for the date
            currentuser.currentDay.updates.push(updateModel);

            //Saves the user to do an overall save
            await currentuser.save((err)=>{
                if(err){
                    res.status(400).send({message:"Error updating info"});
                    return;
                }
                res.status(200).send({message:"Tracked!"});
                return;
            })
        }else{
            //Gets user and date
            var currentuser = await user.findOne({ username: req.user.username });
            //Gets time and date from client
            const date = req.body.date;
            const time = req.body.time;
            var error;

            //This part runs the same as the code above but also adds te old date to user array (code should not run)
            if(req.user.trackedDate !== date){
                // console.log("NEW DAY");
                var prevday = await day.findOne({ _id: currentuser.currentDay._id });
                prevday.wGoal = currentuser.currentDay.wGoal;
                prevday.suGoal = currentuser.currentDay.suGoal;
                // prevday.soGoal = currentuser.currentDay.soGoal;
                prevday.water = currentuser.currentDay.water;
                prevday.sugar = currentuser.currentDay.sugar;
                // prevday.sodium = currentuser.currentDay.sodium;

                currentuser.currentDay.updates.forEach(element => {
                    prevday.updates.push(element);
                });

                await prevday.save((err) => {
                    if(err){
                        error = true;
                        return;
                    }
                    return;
                })

                if(error){
                    res.status(400).send({message:"Total amounts today cannot be negative"});
                    return;
                }

                // currentuser.previousDays.push(currentuser.currentDay);
                currentuser.previousDays.push({date: currentuser.currentDay.date, id: currentuser.currentDay._id});
                
                // soGoal: req.user.soGoal, sodium: req.body.sodium,
                var todayModel = new day({wGoal: req.user.wGoal, suGoal: req.user.suGoal, 
                    water: req.body.water, sugar: req.body.sugar, date:date});
    
                await todayModel.save((err)=>{
                    if(err){
                        error = true;
                        return;
                    }
                    //res.status(200).send({message:"Tracked!"});
                    return;
                })

                if(error){
                    res.status(400).send({message:"Total amounts today cannot be negative"});
                    return;
                }

                currentuser.currentDay = todayModel;
                currentuser.trackedDate = date;

                // sodium: req.body.sodium,
                var updateModel = new update({water: req.body.water, sugar: req.body.sugar, time: time});
                await updateModel.save((err)=>{
                    if(err){
                        error = true;
                        return;
                    }
                    //res.status(200).send({message:"Tracked!"});
                    return;
                })

                if(error){
                    res.status(400).send({message:"Error updating info"});
                    return;
                }

                currentuser.currentDay.updates.push(updateModel);

                await currentuser.save((err)=>{
                    if(err){
                        error = true;
                        return;
                    }
                    res.status(200).send({message:"Tracked!"});
                    return;
                })
                if(error){
                    res.status(400).send({message:"Error updating info"});
                    return;
                }
            }

            //This part should be the part of this function that always runs
            else{
                // console.log("SAME DAY");
                //Calculates new values to track
                var newwater = (parseFloat(currentuser.currentDay.water) + parseFloat(req.body.water)).toFixed(2);
                // var newsodium = currentuser.currentDay.sodium + req.body.sodium;
                var newsugar = (parseFloat(currentuser.currentDay.sugar) + parseFloat(req.body.sugar)).toFixed(2);

                //Error if the values become negative
                // newsodium < 0 ||
                if(newwater < 0 || newsugar < 0){
                    error = true;
                    return;
                }

                if(error){
                    res.status(400).send({message:"Updated values cannot be negative"});
                    return;
                }

                //Creates new update model for the changes
                // sodium: req.body.sodium,
                var updateModel = new update({water: req.body.water, sugar: req.body.sugar, time: time});
                await updateModel.save((err)=>{
                    if(err){
                        error = true;
                        return;
                    }
                    //res.status(200).send({message:"Tracked!"});
                    return;
                })

                if(error){
                    res.status(400).send({message:"Error updating info"});
                    return;
                }

                //Saves the info
                currentuser.currentDay.updates.push(updateModel);
                currentuser.currentDay.water = newwater;
                // currentuser.currentDay.sodium = newsodium;
                currentuser.currentDay.sugar = newsugar;

                await currentuser.save((err)=>{
                    if(err){
                        error = true;
                        return;
                    }
                    res.status(200).send({message:"Tracked!"});
                    return;
                })
                if(error){
                    res.status(400).send({message:"Error updating info"});
                    return;
                }
            }
        }
    }catch(err){
        res.status(400).send({message:"An Error Occured"});
    }
};

// exports.addWater = function(req, res) {
//     res.send('NOT IMPLEMENTED: Adding water');
// };

// exports.addSodium = function(req, res) {
//     res.send('NOT IMPLEMENTED: Adding sodium');
// };

// exports.addSugar = function(req, res) {
//     res.send('NOT IMPLEMENTED: Adding sugar');
// };

// exports.changeGoals = function(req, res) {
//     res.send('NOT IMPLEMENTED: Changing goals');
// };