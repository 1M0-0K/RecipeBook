<?php

  if(strtoupper($_SERVER['REQUEST_METHOD']) === 'GET'){

    require __DIR__ . '/../bootstrap.php';
    db();

    $categories = get_categories();
    echo json_encode($categories);
  }
