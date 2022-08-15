var express = require('express');
const cors = require('cors');
var bodyparser = require('body-parser');
const {verifyToken, verifyUserToken} = require('./src/controller/Token');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

var app = new express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());


// app.use(cors());
// app.use(express.static(path.join(__dirname, 'public')));

const AddHallRouter=require('./src/routes/AddHallRouter');
const EditHallRouter=require('./src/routes/EditHallRouter');
const DeleteHallRouter=require('./src/routes/DeleteHallRouter');
const AdminLoginRouter=require('./src/routes/AdminLoginRouter');
const UserLoginRouter=require('./src/routes/UserLoginRouter');
const NewBookingRouter=require('./src/routes/NewBookingRouter');
const employeeRoute = require('./src/routes/employee.route');

function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    let isAdmin = req.headers.authorization.split(' ')[2]
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }
    let payload = jwt.verify(token, 'secretKey')
    let payload1=jwt.verify(isAdmin, 'adminKey')
    if(!payload1) {
      return res.status(401).send('Unauthorized request')    
    }
    req.userId = payload.subject
    next()
  }

  function verifyUserToken(req, res, next) {
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }
    let payload = jwt.verify(token, 'secretKey')

    if(!payload) {
      return res.status(401).send('Unauthorized request')    
    }
    req.userId = payload.subject
    next()
  }


// app.use(cors());
// app.use(express.static(path.join(__dirname, 'public')));
app.use("/api/insert",verifyToken, AddHallRouter);
app.use('/api/update',verifyToken,EditHallRouter);
app.use('/api/remove',verifyToken,DeleteHallRouter);
app.use('/api/adminLogin',AdminLoginRouter);
app.use('/api/userLogin',UserLoginRouter);
app.use('/api/newBooking',verifyUserToken,NewBookingRouter);
app.use('/api/employee',employeeRoute)

app.get('/api/Halls',verifyUserToken,(req,res)=>{
    HallData.find().then(function(Halls){
        res.send(Halls);
    })
})

app.get('/api/bookingdtls',verifyToken,function(req,res){
  BookingData.find().then(function(dtls){
    // console.log(dtls);
        res.send(dtls);

  });
})

app.get('/api/:username',  (req, res) => {
  const username = req.params.username;
  console.log(username);
  const date = new Date();
  // console.log("current Time", date);
  var ISToffSet = 330; //IST is 5:30; i.e. 60*5+30 = 330 in minutes 
  offset= ISToffSet*60*1000;
  var ISTTime = new Date(date.getTime()+offset);
  console.log(ISTTime)

  let dates=ISTTime.toISOString();
  let next=new Date();
   next.setDate(date.getDate() + 7)
  var today =dates.slice(0, 10);
  var nextDate =next.toISOString().slice(0, 10);
  // BookingData.find({"UserName":username,"DateOfBooking":{$gte:date,$lt:next}})

   BookingData.find({"UserName":username})
    .then((data)=>{
        res.send(data);
       
    });
})

app.delete('/api/remove_booking/:id',(req,res)=>{
   id = req.params.id;
   BookingData.findByIdAndDelete({"_id":id})
  .then(()=>{
      console.log('success')
      res.send();
  })
})


const HallRouter = require('./src/routes/hallRouter');
const AdminLoginRouter = require('./src/routes/AdminLoginRouter');
const UserLoginRouter = require('./src/routes/UserLoginRouter');
const BookingRouter = require('./src/routes/bookinRouter');

app.use('/api/halls/', HallRouter);
app.use('/api/booking' , BookingRouter);
app.use('/api/adminLogin', AdminLoginRouter);
app.use('/api/userLogin', UserLoginRouter);


const PORT = (process.env.PORT || 3000);
app.listen(PORT, function () {
  console.log('listening to port ' + PORT);
});
