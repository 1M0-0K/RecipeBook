<?php
function table_create(){
  $recipe_table = "CREATE TABLE IF NOT EXISTS `recipes` (
        `id` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
        `date` date NOT NULL,
        `name` varchar(255) NOT NULL,
        `img` varchar(255) NOT NULL,
        `favourite` tinyint(1) DEFAULT 0,
        `category` varchar(50) NOT NULL,
        `servings` tinyint(1) NOT NULL,
        `time` time(6) NOT NULL,
        `difficulty` tinyint(1) NOT NULL,
        `ingredients` varchar(4000) NOT NULL,
        `steps` varchar(4000) NOT NULL,
        `notes` varchar(4000) DEFAULT NULL,
        PRIMARY KEY (`id`))";

  $statment = db()->prepare($recipe_table);
  return $statment->execute();
}

function db(){
    static $pdo;
    if(!$pdo){
      $pdo = new PDO(
        sprintf("mysql:host=%s;dbname=%s;charset=UTF8", DB_HOST, DB_NAME),
        DB_USER,
        DB_PASSWORD,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
      );
    }

    return $pdo;

}

if(!$install){
  table_create();
} 


function get_recipes($name='', $favourite = 0, $sort='name', $category_list=['']){
  $sql = "SELECT * FROM recipes WHERE name LIKE :name AND favourite >= :favourite";

  $categories = array_filter($category_list);
  if(count($categories)){
    $sql .= " AND";

    $keynames = array_keys($categories);

    foreach($categories as $key => $category){
      $sql .= " category = :c".$key;
      if(count($categories) > 1 && (count($categories) - 1 > $key)){
        $sql .= " OR";
      }
    }

  }

  if(str_starts_with($sort, 'd.')){
    $sql .= " order by :sort desc;";
    $sort = substr($sort, 2);
  }else{
    $sql .= " order by :sort;";
  }

  $stmt = db()->prepare($sql);
  $stmt->bindValue(':name', '%'.$name.'%', PDO::PARAM_STR);
  $stmt->bindValue(':favourite', $favourite, PDO::PARAM_INT);
  $stmt->bindValue(':sort', $sort, PDO::PARAM_STR);

  if(count($categories)){

    $keynames = array_keys($categories);

    foreach($categories as $key => $category){
      $stmt->bindValue(':c' . $key, $category, PDO::PARAM_STR);
    }

  }

  $stmt->execute();

  return $stmt->fetchAll(PDO::FETCH_ASSOC);

}

function get_recipe($id = '0'){
  $sql = "SELECT * FROM recipes WHERE id = :id";

  $stmt = db()->prepare($sql);
  $stmt->bindValue(':id', $id, PDO::PARAM_INT);

  $stmt->execute();

  return $stmt->fetch(PDO::FETCH_ASSOC);

}

function get_categories(){
  $sql = "SELECT DISTINCT category FROM recipes;";

  $stmt = db()->prepare($sql);

  $stmt->execute();

  return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function update_recipe($recipe){
  if($recipe){
    $recipe_parsed = json_decode($recipe, true);
    $sql = "UPDATE recipes SET name = :name, img = :img, favourite = :favourite, category = :category, servings = :servings, time = :time, difficulty = :difficulty, ingredients = :ingredients, steps= :steps, notes = :notes  WHERE id = :id";

    $stmt = db()->prepare($sql);
    $stmt->bindValue(':name', $recipe_parsed['name'], PDO::PARAM_STR);
    $stmt->bindValue(':img', $recipe_parsed['img'], PDO::PARAM_STR);
    $stmt->bindValue(':favourite', $recipe_parsed['favourite'], PDO::PARAM_INT);
    $stmt->bindValue(':category', $recipe_parsed['category'], PDO::PARAM_STR);
    $stmt->bindValue(':servings', $recipe_parsed['servings'], PDO::PARAM_STR);
    $stmt->bindValue(':time', $recipe_parsed['time'], PDO::PARAM_STR);
    $stmt->bindValue(':difficulty', $recipe_parsed['difficulty'], PDO::PARAM_INT);
    $stmt->bindValue(':ingredients', json_encode($recipe_parsed['ingredients']), PDO::PARAM_STR);
    $stmt->bindValue(':steps', json_encode($recipe_parsed['steps']), PDO::PARAM_STR);
    $stmt->bindValue(':notes', json_encode($recipe_parsed['notes']), PDO::PARAM_STR);
    $stmt->bindValue(':id', $recipe_parsed['id'], PDO::PARAM_STR);

    if($stmt->execute()){
      return true;
    }else{
      return false;
    }

  }
}

function add_recipe($recipe){
  if($recipe){
    $recipe_parsed = json_decode($recipe, true);
    $sql = "INSERT INTO recipes (name, img, favourite, category, servings, time, difficulty, ingredients, steps, notes) VALUES (:name, :img, :favourite, :category, :servings, :time, :difficulty, :ingredients, :steps, :notes)";

    $stmt = db()->prepare($sql);
    $stmt->bindValue(':name', $recipe_parsed['name'], PDO::PARAM_STR);
    $stmt->bindValue(':img', $recipe_parsed['img'], PDO::PARAM_STR);
    $stmt->bindValue(':favourite', $recipe_parsed['favourite'], PDO::PARAM_INT);
    $stmt->bindValue(':category', $recipe_parsed['category'], PDO::PARAM_STR);
    $stmt->bindValue(':servings', $recipe_parsed['servings'], PDO::PARAM_STR);
    $stmt->bindValue(':time', $recipe_parsed['time'], PDO::PARAM_STR);
    $stmt->bindValue(':difficulty', $recipe_parsed['difficulty'], PDO::PARAM_INT);
    $stmt->bindValue(':ingredients', json_encode($recipe_parsed['ingredients']), PDO::PARAM_STR);
    $stmt->bindValue(':steps', json_encode($recipe_parsed['steps']), PDO::PARAM_STR);
    $stmt->bindValue(':notes', json_encode($recipe_parsed['notes']), PDO::PARAM_STR);

    if($stmt->execute()){
      return true;
    }else{
      return false;
    }

  }
}

function toggle_favourite($id){
  if($id>=0){
    $sql = "UPDATE recipes SET favourite = 1 - favourite WHERE id = :id";

    $stmt = db()->prepare($sql);
    $stmt->bindValue(':id', $id, PDO::PARAM_STR);

    if($stmt->execute()){
      return true;
    }else{
      return false;
    }

  }
}

function remove_recipe($id){
  $sql = "DELETE FROM recipes WHERE id = :id";

  $stmt = db()->prepare($sql);
  $stmt->bindValue(':id', $id, PDO::PARAM_STR);

  if($stmt->execute()){
    return true;
  }else{
    return false;
  }

}

