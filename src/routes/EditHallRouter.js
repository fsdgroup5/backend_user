const express=require('express');
const EditHallRouter=new express();
const HallData=require('../model/Hall')

EditHallRouter.get('/:id',  (req, res) => {
  
    const id = req.params.id;
      HallData.findOne({"_id":id})
      .then((hall)=>{
          res.send(hall);
      });
  })


EditHallRouter.put('',(req,res)=>{
    id=req.body._id,
    HallName= req.body.HallName,
    Seats = req.body.Seats,
    Location = req.body.Location,
    Image = req.body.Image,
  
   HallData.findByIdAndUpdate({"_id":id},
                                {$set:{
                                "HallName":HallName,
                                "Seats":Seats,
                                "Location":Location,
                                "Image":Image,
                              }})
   .then(function(){
       res.send();
   })
  })

  module.exports=EditHallRouter