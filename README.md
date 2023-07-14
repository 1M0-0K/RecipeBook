# Recipe book
A simple webiste to store recipes. It uses a simple API to store, modify and remove recipes data.

![Website Preview](/screenshots/recipe_book_list.png)

## Key Feature
- Live search
- Categories
- Favourite recipes

## Technologies
- FrontEnd: 
  - HTML
  - CSS
  - ReactJS
- BackEnd:
  - NodeJS
  - Express

## Setup
1. ReactJS:
   * `npm install`
   * `npm run build`
2. NodeJS:
   * `cd server`
   * `node index.js`
 
Use server_dev for development and server for deployment. Move the server/server_dev folder to build directory before you start it.

##Preview
The website is a Single Page Website with the possibility of searching, sorting and filtering the recipes in the left side of the page while in the right side of the page the recipes are displayed.

![Website Welcome Screen](/screenshots/recipe_book_list.png)

We can choose what category of recipes we want:

![Website Category](/screenshots/recipe_book_category.png)

or

![Website favourite](/screenshots/recipe_book_favourite.png)

We can also search the recipe we want:

![Website search](/screenshots/recipe_book_search.png)

To view the full recipe click on the specific card and the recipe will be shown:

![Website recipe](/screenshots/recipe_book_recipe.png)

To add a new recipe click the button "New Recipe":

![Website add recipe](/screenshots/recipe_book_add.png)
