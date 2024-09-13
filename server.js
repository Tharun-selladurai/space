const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");

const app = express();
const port = 7777;

app.use(bodyParser.urlencoded({ extended: true }));

const mongoUrl = "mongodb://localhost:27017";
const dbName = "register";
let db;

MongoClient.connect(mongoUrl)
    .then((client) => {
        db = client.db(dbName);
        console.log(`Connected to MongoDB: ${dbName}`);
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });
app.get("/",(req,res)=>
{
    res.sendFile(__dirname+"/home.html");
})


app.get("/mdbcr", (req, res) => {
    res.sendFile(__dirname + "/mongodbcreate.html");
});
app.get("/mdbre", (req, res) => {
    res.sendFile(__dirname + "/mongodbread.html");
});
app.get("/mdbup", (req, res) => {
    res.sendFile(__dirname + "/mongodbupdate.html");
});
app.get("/mdbde", (req, res) => {
    res.sendFile(__dirname + "/mongodbdelete.html");
});
app.get("/tharun", (req, res) => {
    res.sendFile(__dirname + "/dashboard.html");
});
app.get('/login',(req,res)=>
{
    res.sendFile(__dirname + "/login.html");
    
})
app.get("/home",(req,res)=>
    {
        res.sendFile(__dirname+"/home.html");
    })
app.post("/create", async (req, res) => {
    const { name, rn, deptname } = req.body;
    if (!db) {
        res.send("Database not initialized");
        return;
    }
    try {
        await db.collection("student").insertOne({ name, rn, deptname });
        res.redirect("/");
    } catch (err) {
        console.error("Error inserting data:", err);
        res.status(500).send("Failed to insert data");
    }
});

app.post("/read", async (req, res) => {
    const { deptname } = req.body;
    if (!db) {
        res.send("Database not initialized");
        return;
    }
    try {
        const items = await db.collection("student").find({ deptname }).toArray();
        console.log(items);

        let tableContent = "<h1>Report</h1><table border='1'><tr><th>Name</th><th>Roll-number</th><th>Department</th></tr>";
        tableContent += items.map(item => `<tr><td>${item.name}</td><td>${item.rn}</td><td>${item.deptname}</td></tr>`).join("");
        tableContent += "</table><a href='/'>Back to form</a>";
        res.send(tableContent);
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).send("Failed to fetch data");
    }
});

app.post("/update", async (req, res) => {
    const { name,rn, deptname } = req.body;
    if (!db) {
        res.send("Database not initialized");
        return;
    }
    try {
        const result = await db.collection("student").updateMany({ name,rn }, { $set: { deptname } });
        res.send("Updated");
    } catch (err) {
        console.error("Error updating data:", err);
        res.status(500).send("Failed to update data");
    }
});

app.post("/delete", async (req, res) => {
    const { rn } = req.body;
    
    if (!db) {
        console.error("Database not initialized");
        res.status(500).send("Database not initialized");
        return;
    }

    try {
       
        

       
        const doc = await db.collection("student").findOne({ rn });
       
        
        const result = await db.collection("student").deleteMany({ rn });
        

        if (result.deletedCount > 0) {
            res.send("Deleted");
        } else {
            res.status(404).send("No documents found to delete");
        }
    } catch (err) {
        
        res.status(500).send("Failed to delete data");
    }
});




app.listen(port, () => {
    console.log(`Server running at ${port}`);
});
