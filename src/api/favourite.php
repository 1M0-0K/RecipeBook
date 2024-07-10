<?php

  if(strtoupper($_SERVER['REQUEST_METHOD']) === 'GET'){

    require __DIR__ . '/../bootstrap.php';
    db();

    $id = $_GET['id'];

    $favourite = toggle_favourite($id);
    echo $favourite;
  }
