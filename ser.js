var http = require('http')
var fs = require('fs')
var urlp = require('url')
 var qs =  require('querystring')
var mysql = require('mysql')



  var conn= mysql.createConnection({
      host:"localhost",
      user:"root",
      password:"",
      database:"stack"
  })
  conn.connect((err)=>{
      if(err){
          console.log("NOT connect")
      }
      else{
        console.log("CONNECT")
      }
  })


http.createServer((req,res)=>{
    var path=urlp.parse(req.url, true).pathname        
    if(path=="/" || path=="/home")
     {
         var x = urlp.parse(req.url, true)
         
         var filer = fs.readFileSync('index.html')

         res.write(filer)
         res.end()
     }
     else if(path=="/mydata"){
         var data =""
         req.on('data', (d)=>{
             data+=d
         })
         req.on('end', ()=>{
             var fdata=qs.parse(data)
             var sqlq = "INSERT INTO ureg (fname, lname, dob, email, shoes, skill) VALUES ('"+fdata.fname+"','"+fdata.lname+"','"+fdata.dob+"','"+fdata.email+"',"+fdata.shoes+","+fdata.skill+")";
              
                conn.query(sqlq, function (err, result) {
                    if (err) {
                        console.log("err")
                    }
                   else{
                    console.log("record inserted");
                }
                  });
              
            
         })
         res.write('<a href="/view">VIEW ALL</a>')
     }
     else if(path=="/view"){
         var viw = "select *from  ureg"
         conn.query(viw, (err, reslt)=>{
             //console.log(reslt)
             if(err){
                 console.log("view error")
             }
             var table = "<table border='2'><tr><th>SN</th><th>NAME</th><th>LAST NAME</th><th>EMAIL</th><th>SHOES</th><th>SKILL</th><th>TIME</th><th>DELETE</th><th>UPDATE</th></tr>"
             for( key in reslt){
                 table+=("<tr>")
                 table+=("<td>"+reslt[key].SN+"</td>")
                 table+=("<td>"+reslt[key].fname+"</td>")
                 table+=("<td>"+reslt[key].lname+"</td>")
                 table+=("<td>"+reslt[key].email+"</td>")
                 table+=("<td>"+reslt[key].shoes+"</td>")
                 table+=("<td>"+reslt[key].skill+"</td>")
                 table+=("<td>"+reslt[key].time+"</td>")
                 table+=("<td>"+"<a href='/delete?id="+reslt[key].SN+"'>Delete</a>"+"</td>")
                 table+=("<td>"+"<a href='/update?id="+reslt[key].SN+"'>Update</a>"+"</td>")
                 table+=("</tr>")
             }
             table+="</table>"
             res.write(table)
             res.end()
         })  
     }
     else if(path=="/delete"){
         var urlps=urlp.parse(req.url,true).query
         var del = "delete from ureg where SN='"+urlps.id+"'"
         conn.query(del, (err, resld)=>{
             res.write("delete")
             res.end()
         })
     }
     else if(path=="/update"){
        var urlps=urlp.parse(req.url,true).query
        var up = "select * from ureg where SN='"+urlps.id+"'"
        conn.query(up,(err,resu)=>{
            const xname=""
             for(key  in resu)
             {
                
             }
            
              res.end(`<!DOCTYPE html>
              <!-- saved from url=(0054)https://html5doctor.com/demos/forms/forms-example.html -->
              <html lang="en-US"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                  
                  <title>Forms Complete Example</title>
                  <style type="text/css">
              body {
                  margin: 2em 5em;
                  font-family:Georgia, "Times New Roman", Times, serif;
              }
              h1, legend {
                  font-family:Arial, Helvetica, sans-serif;
              }
              label, input, select {
                  display:block;
              }
              input, select {
                  margin-bottom: 1em;
              }
              fieldset {
                  margin-bottom: 2em;
                  padding: 1em;
              }
              fieldset fieldset {
                  margin-top: 1em;
                  margin-bottom: 1em;
              }
              input[type="checkbox"] {
                  display:inline;
              }
              .range {
                  margin-bottom:1em;
              }	
              .card-type input, .card-type label {
                  display:inline-block;
              }
                  </style>	
              </head>
              <body>
              <form id="register" action="/updata?id=${resu[key].SN}" method="POST">
                <fieldset> 
                  <legend>Personal details</legend> 
                  <div> 
                      <label>First Name
                      <input id="given-name" value="${resu[key].fname}" name="fname" type="text" > 
                      </label>
                  </div>
                  <div> 
                      <label>Last Name
                      <input id="family-name" value="${resu[key].lname}" name="lname" type="text" > 
                      </label>
                  </div>
                  <div> 
                      <label>Date of Birth
                      <input id="dob" value="${resu[key].dob}" name="dob" type="date" >
                      </label>
                  </div> 
                  <div> 
                      <label>Email 
                      <input id="email" value="${resu[key].email}"  name="email" type="email">
                      </label> 
                  </div>     
                  
                  <div>
                      <label>Shoesize
                      <input id="shoes" name="shoes" type="number" min="5" max="18" step="0.5" value="${resu[key].shoes}">
                      </label>
                  </div>
                  <div>
                      <label>Flying Skill level (1 low - 100 high)
                      <input id="skill" value="${resu[key].skill}" name="skill" type="range" min="1" max="100" value="0">
                      <output name="output" onforminput="value=a.value">0</output>
                      </label>
                  </div>
                </fieldset>
                <fieldset> 
                    <div> 
                      <button type="submit">Place Order</button> 
                  </div> 
                </fieldset> 
              </form> 
              </body>
              </html>`)
            
            
        })
        
     }
     else if(path=="/updata"){
        var urlps=urlp.parse(req.url,true).query
        

        var data =""
        req.on('data', (d)=>{
            data+=d
        })
        req.on('end', ()=>{
            var data1= qs.parse(data)
            var updateq = "update ureg SET fname='"+data1.fname+"',lname='"+data1.lname+"', dob='"+data1.dob+"',email='"+data1.email+"',shoes='"+data1.shoes+"', skill='"+data1.skill+"' where SN='"+urlps.id+"' "
            conn.query(updateq,(err, reslte)=>{
                if(err){
                    res.write("error")
                    res.end()
                }
                else{
                    res.write("update data")
                    res.end()
                }
            })
        })
         
     }
     else{
        res.write("<h1>Eorro 404</h1>")
        res.end()
     }
    
}).listen(8081)
console.log('http://localhost:8081')