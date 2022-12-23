const express = require('express')
const app = express()

const port = process.env.PORT || 4000

app.use(function (req, res, next) {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});

app.get('/',(req,res) => {
    res.sendFile(__dirname + "/index.html")
})

app.listen(port,() => {
    console.log("App is listening on port" + port)
})

