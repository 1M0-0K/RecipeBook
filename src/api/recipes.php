<?php
  if(strtoupper($_SERVER['REQUEST_METHOD']) === 'GET'){

    require __DIR__ . '/../bootstrap.php';
    db();

    $search = $_GET['search'];
    $favourite = $_GET['favourite'];
    $sort = $_GET['sort'];
    $categories = explode(',',$_GET['categories']);
    $recipes = get_recipes($search, $favourite, $sort, $categories);
    echo json_encode($recipes);
  }
