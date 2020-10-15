//NB: Because we are using .pop(), the ids will be the inverse of the order of how they appear in the original .JSON file.

const {Database} = require("sqlite3")
const restaurants = require("./restaurants.json")

const db = new Database(":memory:")

//---ITEMS---
function insertItem(items,restaurant_id,menu_id,menus,restaurants,callback){

    if (items.length===0) return insertMenu(menus,restaurant_id,restaurants,callback)
    const item = items.pop()
    db.run(`INSERT INTO items(name,price,menu_id,restaurant_id) VALUES ("${item.name}","${item.price}","${menu_id}","${restaurant_id}");`, (err)=>{
        
        insertItem(items,restaurant_id,menu_id,menus,restaurants,callback)
    })
}


//---MENUS---
function insertMenu(menus,restaurant_id,restaurants,callback){

    if (menus.length===0) return insertRestaurant(restaurants,callback)
    const menu = menus.pop()
    const items = menu.items
    // db.run - use function (err) rather than an arrow function, so you can use the 'this' keyword to access the lastID
    db.run(`INSERT INTO menus(title,restaurant_id) VALUES ("${menu.title}","${restaurant_id}");`, function (err){
        const menu_id = this.lastID

        insertItem(items,restaurant_id,menu_id,menus,restaurants,callback)
    })
}


//---RESTAURANTS---
function insertRestaurant(restaurants,callback){
    if (restaurants.length===0) return callback()
    const restaurant = restaurants.pop()
    const menus = restaurant.menus
    // db.run - use function (err) rather than an arrow function, so you can use the 'this' keyword to access the lastID
    db.run(`INSERT INTO restaurants(name) VALUES ("${restaurant.name}");`, function (err){
        const restaurant_id = this.lastID
 
        insertMenu(menus,restaurant_id,restaurants,callback)
    })
}


function loader(callback){
    insertRestaurant(restaurants,callback)
}


module.exports = {loader,db}