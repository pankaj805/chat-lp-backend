import express from 'express';
import bodyParser from 'body-parser';
import EventEmitter from 'events';
import cors from "cors";

const PORT = process.env.PORT || 5000;

let ee = new EventEmitter();
ee.setMaxListeners(400);
let messages = [];

let app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/messages',(req,res,next)=>{
    res.status(200).send({
        status:true,
        response:messages
    });
});

app.get('/message',(req,res,next)=>{
    var addMessageListener = function(res){
        ee.once('message', function(data){
            res.status(200).send({
                status:true,
                response:data
            });
        })
    }
    addMessageListener(res)
});


app.post('/message', function(req, res){  
    console.log("req.body:",req.body);
    messages.push(req.body);
    ee.emit('message', req.body)
    res.status(200).send({
        status:true
    });
})


// app.delete('/messages',(req,res,next)=>{
//     messages = [];
//     res.status(200).send({
//         status:true
//     });
// });

app.listen(PORT,()=>{
    console.log(' ********** : running on ',PORT);
})

module.exports = app;