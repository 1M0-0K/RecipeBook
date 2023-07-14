const express = require('express');
const cors = require('cors');    
const multer = require('multer');

const fs = require('fs');


const app = express();
app.use(cors());

//Write function for the images
const writeImage = (data, path) => new Promise((res, rej) => {

    fs.writeFile(`${__dirname}/../uploads/${path}`, data, (err) => {
        if(err){
            rej("image_save_fail");
         }else{
            res(true);
        }
      })

})

//Write function for the recipes file
const write = (data) => new Promise((res, rej) => {
    if(Object.keys(data).length > 0){ 
        fs.writeFile(`${__dirname}/../data/recipes.json`, data, (err) => {
            if(err){
                rej("recipe_remove_fail");
             }else{
                res(true);
            }
          })
    }else{
        rej("recipe_remove_fail");
    }

})

//Remove function for image removing
const remove = (path) => new Promise((res, rej) => {

    fs.access(`${__dirname}/../uploads/${path}`, err => {
        if(!err){
            fs.unlinkSync(`${__dirname}/../uploads/${path}`)
            res(true);
        }else{
            rej("recipe_remove_file_fail");
        }
    })

})

//Handle the get request 
app.get('/', (req, res) => {
    
    fs.readFile(`${__dirname}/../data/recipes.json`,(err, data) => {
        if(!err){
            try{ 

                return res.json(JSON.parse(data));

            }catch (e){
                return res.json({msg:"file_empty"});
            }
        }else{
            return res.json({msg:"no_file"});
        }
    })
    
})

//Handle the post request for adding new recipes
app.post('/',  multer().any(), async(req, res) => {

    try{
        if(await writeImage(req.files[0].buffer,req.body.path)){
            if(await write(req.body.recipes)){
                res.json(req.body.recipes);
            }
        }
    }catch (err){
        res.json({msg: err});
    }

})

//Handle the put request for updating the recipes 
app.put('/', multer().any(), async(req, res) => {

    try{
        if(req.files[0]){
            await writeImage(req.files[0].buffer,req.body.path);
        }

        if(await write(req.body.recipes)){
            res.json(req.body.recipes);
        }
        
    }catch (err){
        res.json({msg: "recipe_update_fail"});
    }

})

//Handle the delete request
app.delete('/', multer().none(), async(req, res) => {
   
    try{
        if(await remove(req.body.path)){
            if(await write(req.body.recipes)){
                res.json(req.body.recipes);
            }
        }
    }catch (err){
        res.json({msg: err});
    }

})


const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Server listening on port ${port} ...`);
})

