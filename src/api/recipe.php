<?php

  require __DIR__ . '/../bootstrap.php';
  db();

  if(strtoupper($_SERVER['REQUEST_METHOD']) === 'GET'){
    $id = $_GET['id'];

    $recipe = get_recipe($id);
    echo json_encode($recipe);
  }else if(strtoupper($_SERVER['REQUEST_METHOD']) === 'POST'){
    $type = $_GET['id'];

    $recipe = $_POST['recipe'];
    $image_name = json_decode($recipe, true)['img'];
    if($type == "update"){

      if(update_recipe($recipe)){
        if(isset($_FILES['image'])){
           update_image($_FILES['image'], $image_name); 
        }
      }else{
        echo "Something went wrong. Please try again later!";
      }
    }else{

      if(add_recipe($recipe)){
        if(isset($_FILES['image'])){
          update_image($_FILES['image'], $image_name); 
          //TODO: Add json format notification for more accuracy error handle
          // echo "Recipe added!";
        }else{
          echo "Please select an image!";
        }
      }else{
        echo "Something went wrong. Please try again later!";
      }
    }

  }else if(strtoupper($_SERVER['REQUEST_METHOD']) === 'DELETE'){
    $id = $_GET['id'];

    $result = remove_recipe($id);
  }

  function update_image($file, $file_name){
    $tmp_name = $file['tmp_name'];

    if(!move_uploaded_file($tmp_name, "../../resources/images/".$file_name)){
      echo "The Image could not be uploaded";
    }
  }
