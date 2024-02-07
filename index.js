const express = require('express');
const cors = require('cors');    
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
let db;

const PORT = process.env.PORT || 3001;
let options = {root: __dirname + '/app/build'};


const fs = require('fs');
const dbDir = 'data';
const imgDir = 'uploads';

const app = express();
app.use(express.json())
app.use(cors());

const initDB = () => {
	if(!fs.existsSync('./'+dbDir)){
		fs.mkdirSync('./'+dbDir)
	}
    db = new sqlite3.Database('./data/recipes.db', err => errorCheck(err,"Connected  to the database"));
    db.run(`CREATE TABLE IF NOT EXISTS recipes(
        id timestamp(0) ,
        date DATE(20) NOT NULL,
        name VARCHAR(255) NOT NULL,
        img VARCHAR(255) NOT NULL,
        favourite BOOLEAN(1) NOT NULL DEFAULT '0',
        category VARCHAR(50) NOT NULL,
        servings TINYINT(1) NOT NULL,
        time INT(11) NOT NULL,
        difficulty TINYINT(1) NOT NULL DEFAULT '0',
        ingredients VARCHAR(4000) NOT NULL,
        steps VARCHAR(4000) NOT NULL,
        notes VARCHAR(4000),
        PRIMARY KEY (id)
    )`);
}

const errorCheck = (err, msg) => {
    if(err){
        console.error(err.message);
    }
    console.log(msg);
}

//Write function for the images
const writeImage = (data, img) => new Promise((res, rej) => {

	if(!fs.existsSync('./'+imgDir)){
		fs.mkdirSync('./'+imgDir)
	}
    fs.writeFile(`${__dirname}/uploads/${img}`, data, (err) => {
        if(err){
            rej("image_save_fail");
         }else{
            res(true);
        }
      })

})

//Remove function for image removing
const remove = (img) => new Promise((res, rej) => {

    fs.access(`${__dirname}/uploads/${img}`, err => {
        if(!err){
            fs.unlinkSync(`${__dirname}/uploads/${img}`)
            res(true);
        }else{
            rej("recipe_remove_file_fail");
        }
    })

})

//Handle the get requests

app.get('/recipes', (req, res) => {
    db.all('SELECT * FROM recipes', (err, rows) => {
        if(err){
            return res.json({error: "database_error"});
        }
        return res.json({data:rows});
    }) 
});

//Request images
app.get('/images/:image', (req, res) => {

    fs.readFile(`${__dirname}/uploads/${req.params.image}`, (err, data) => {
        if(!err){
            try{
                return res.sendFile(`${__dirname}/uploads/${req.params.image}`);
            }catch(e){
                return res.sendFile(`${__dirname}/assets/default_recipe.jpg`);
            }
        }else{
            return res.sendFile(`${__dirname}/assets/default_recipe.jpg`);
        }
    })

});


//Handle the post request for adding new recipes
app.post('/add/:id',  multer().any(), async(req, res) => {
    db.get(`SELECT * FROM recipes where id=${req.params.id}`, async(err, row) => {
        const recipe = JSON.parse(req.body.recipe);
        if(!row){
            try{
                if(await writeImage(req.files[0].buffer, recipe.img)){
                    const query = `INSERT INTO recipes VALUES('${recipe.id}', '${recipe.date}', '${recipe.name}', '${recipe.img}', '${recipe.favourite}', '${recipe.category}', '${recipe.servings}', '${recipe.time}', '${recipe.difficulty}', '${JSON.stringify(recipe.ingredients)}', '${JSON.stringify(recipe.steps)}', '${JSON.stringify(recipe.notes)}')`;
                    db.run(query, err => {
                        if(err){
                            res.json({error:"add_error"});
                        }else{
                            res.json({data:"add_success"});
                        }
                    });
                }
            }catch(err){
                res.json({error:"add_error"});
            }
        }else{
            res.json({error:"add_error"});
        }
    });

})

//Handle the put request for updating the recipes 
app.put('/update/:id', multer().any(), async(req, res) => {

    db.get(`SELECT * FROM recipes where id=${req.params.id}`, async(err, row) => {

        const recipe = JSON.parse(req.body.recipe);
        if(row){

            try{
                if(req.files[0]){
                    writeImage(req.files[0].buffer,recipe.img);
                }

                const query = `UPDATE recipes set name = '${recipe.name}', img = '${recipe.img}', favourite = '${recipe.favourite}', category = '${recipe.category}', servings = '${recipe.servings}', time = '${recipe.time}',  difficulty = '${recipe.difficulty}', ingredients = '${JSON.stringify(recipe.ingredients)}', steps = '${JSON.stringify(recipe.steps)}', notes = '${JSON.stringify(recipe.notes)}' WHERE id=${req.params.id}`;
                db.run(query, err => {
                    if(err){
                        res.json({error: "update_error"});
                    }else{
                        res.json({data:"update_success"});
                    }
                });
                
            }catch (err){
                res.json({error: "update_error"});
            }
        }else{
            res.json({error: "update_error"});
        }
    })

})

app.put('/favourite/:id', multer().any(), async(req, res) => {

    db.get(`SELECT favourite FROM recipes where id=${req.params.id}`, async(err, row) => {

        db.run(`UPDATE recipes SET favourite= ${1 - row.favourite} WHERE id=${req.params.id}`, err => {
            if(err){
                res.json({error: "favourite_error"});
            }else{
                res.json({data:"favourite_success"});
            }
        });
                
    })

})

//handle the delete request
app.delete('/delete/:id', multer().none(), async(req, res) => {
   
    db.get(`select img from recipes where id=${req.params.id}`, async(err, row) => {
        
        try{
            if(await remove(row.img)){
                db.run(`delete from recipes where id=${req.params.id}`, (err) => {
                    if(err){
                        res.json({error:"remove_error"});
                    }else{
                        res.json({data: "remove_success"});
                    }
                });
            }
        }catch (err){
            res.json({data: "remove_error"});
        }

    });

})

app.use('/',express.static("app/build"));


app.listen(PORT, () => {
    initDB();
    console.log(`server listening on port ${PORT} ...`);
})

