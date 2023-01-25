const express = require('express')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
 
const fileUpload = require("express-fileupload");
 const fs = require("fs")
const app = express();
var path = require('path');
 
const bodyParser = require('body-parser');

const port = process.env.PORT || 4000

app.use(function (req, res, next) {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());
 
app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
);
app.get('/',(req,res) => {
    res.sendFile(__dirname + "/index.html");
    
})

app.post("/convert/",(req,res) =>{

    const file = req.files.file;
    // console.log(file)
    // console.log(req.body)
    const inputText = req.body.VALUE


     file.mv("tmp/" + file.name, function (err) {
      if (err) return res.sendStatus(500).send(err);
      console.log("File Uploaded successfully");
    });

    ffmpeg('tmp/' + file.name)
    .audioCodec('libmp3lame') // Audio Codec
    .videoCodec('libx264')
    .videoFilters(`drawtext=text='${inputText}':x=(w-text_w)/2:y=(h-text_h)/2:fontsize=48:fontcolor=white`)
    .on('end', function (stdout, stderr) {
      console.log("Finished");
        res.download(__dirname + file.name, function (err) {
          // if (err) throw err;
  
          // fs.unlink(__dirname + file.name, function (err) {
          //   if (err) throw err;
          //   console.log("File deleted");
          // });
        })

        fs.unlink("tmp/" + file.name, function (err) {
            if (err) throw err;
            console.log("File deleted");
          });
    }).on("error", function (err) {
      console.log("an error happened: " + err.message);
      fs.unlink("tmp/" + file.name, function (err) {
        if (err) throw err;
        console.log("File deleted");
      });
      }).save(__dirname,`${Math.random().toString(36).substring(2,7)}-${file.name}`);

})

//Requisicao POST PARA REMOVER AUDIO

app.post("/remove",(req,res) =>{

  const file = req.files.file;
  // console.log(file)



   file.mv("tmp/" + file.name, function (err) {
    if (err) return res.sendStatus(500).send(err);
    console.log("File Uploaded successfully");
  });

  ffmpeg('tmp/' + file.name)
  .noAudio()
  .videoCodec('libx264')
  .on('end', function (stdout, stderr) {
    console.log("Finished");
      res.download(__dirname + file.name, function (err) {

        // fs.unlink(__dirname + file.name, function (err) {
        //   if (err) throw err;
        //   console.log("File deleted");
        // });
      })

      fs.unlink("tmp/" + file.name, function (err) {
          if (err) throw err;
          console.log("File deleted");
      });
  }).on("error", function (err) {
      console.log("an error happened: " + err.message);
      fs.unlink("tmp/" + file.name, function (err) {
        if (err) throw err;
        console.log("File deleted");
      });
    }).save(path.join(__dirname,`Sem-audio-${Math.random().toString(36).substring(2,7)}-${file.name}`));

})


app.listen(port,() => {
    console.log("App is listening on port " + port )
})

