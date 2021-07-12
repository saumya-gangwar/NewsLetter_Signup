const express= require ("express");
const bodyParser=require("body-parser");
const https = require("https");
const request = require ("request");


const app = express();
app.use(express.static("public"));// for static local files like local custom css and images

app.use(bodyParser.urlencoded ({extended:true}));


app.get("/",function(request,response)
{
  response.sendFile(__dirname + "/signup.html");
})

app.post("/",function(request,response)
{
  const firstName=request.body.fName; // tap into name attribute of input using bodyparser
  const lastName=request.body.lName;
  const email=request.body.email;

  const data =     //js object
  {
    members:[
      {
        email_address :email,
        status:"subscribed",
        merge_fields:
        {
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ]
  }

    const jsonData = JSON.stringify(data);
    const url="https://us7.api.mailchimp.com/3.0/lists/{listid}"
    const options=
    {
      method:"POST",
      auth:"Saumya:authid.."
    }
  //the data is sent in json string format as a part of body of post request
  //posting data to mailchimp server.
  //here we are writing the request/post request and storing in a constant
  //using https nodejs module.
  const req=  https.request(url,options,function(res)
  {
    if (res.statusCode===200)
    {
      response.sendFile(__dirname + "/success.html");
    }
    else
    {
      response.sendFile(__dirname + "/failure.html");
    }
  res.on("data",function(data)
    {
   console.log(JSON.parse(data));

     })
  })
//sending the jsondata with req constant
 req.write(jsonData);
 req.end();

})



app.post("/failure",function(request,response)
{
  response.redirect("/");
}
)


app.listen(3000, function()
{
  console.log("server is running")
})
