const { db } = require("./Loader")

class Restaurant{

    static findAll(){
        return new Promise((resolve,reject)=>{
            db.all(`SELECT * FROM restaurants`, function(err,row){
                // we want to map all of the existing rows from the database into new Restaurant objects
                const allRestaurants = Promise.all(row.map(r => new Restaurant(r)))
                resolve(allRestaurants)
            })
        })
    }

    constructor(data){
        const thisRestaurant = this //change the 'this' keyword to be 'thisRestaurant' to distinguish between different meanings 
        thisRestaurant.id = data.id //if creating a new instance, this will be 'undefined'
        thisRestaurant.name = data.name
        thisRestaurant.image = data.image
        thisRestaurant.menus = []

        //If creating a new restaurant, insert it into the database
        if (thisRestaurant.id){
            Promise.resolve(thisRestaurant)
        } else {
            //inserting class into row
            return new Promise((resolve,reject)=>{
                db.run(`INSERT INTO restaurants(name,image) VALUES (?,?);`,[thisRestaurant.name, thisRestaurant.image], function(err){
                thisRestaurant.id = this.lastID
                resolve(thisRestaurant)
                }) 
            })
        }
    }

    //Add function here to push menus to the restaurant
    async addMenu(data){
        const title = data.title
        const restaurant_id = this.id
        const menu = await new Menu({title: title, restaurant_id: restaurant_id})
        this.menus.push(menu) 
    }
}



class Menu{

    static findAll(){
        return new Promise ((resolve,reject)=>{
            db.all(`SELECT * FROM menus;`, function(err,row){
                const allMenus = Promise.all(row.map(r => new Menu(r)))
                resolve(allMenus)
            })
        })
    }

    constructor(data){
        const thisMenu = this
        thisMenu.id = data.id
        thisMenu.title = data.title
        thisMenu.restaurant_id = data.restaurant_id
        thisMenu.items = []
        
        if(thisMenu.id){
            return Promise.resolve(thisMenu)
        } else {
            //inserting new class into row
            return new Promise((resolve,reject)=>{
                db.run(`INSERT INTO menus(title, restaurant_id) VALUES (?,?);`, [thisMenu.title, thisMenu.restaurant_id], function(error){
                    thisMenu.id = this.lastID
                    resolve(thisMenu)
                })
            })
        }
    }

    async addItem(data){
        const name = data.name
        const price = data.price
        const menu_id = this.id
        const restaurant_id = data.restaurant_id
        const item = await new Item({name: name, price: price, restaurant_id:restaurant_id, menu_id: menu_id})
        this.items.push(item) 
    }
}



class Item{

    static findAll(){
        return new Promise((resolve,reject)=>{
            db.all(`SELECT * FROM items;`, function(err,row){
                const allItems = Promise.all(row.map(r => new Item(r)))
                resolve(allItems)
            })
        })
    }

    constructor(data){
        const thisItem = this
        thisItem.id = data.id
        thisItem.name = data.name
        thisItem.price = data.price
        thisItem.menu_id = data.menu_id
        thisItem.restaurant_id = data.restaurant_id  

        if (thisItem.id){
            return Promise.resolve(thisItem)

        } else {
            //inserting new class into row
            return new Promise((resolve,reject)=>{
                db.run(`INSERT INTO items(name,price,menu_id,restaurant_id) VALUES (?,?,?,?)`,[thisItem.name,thisItem.price,thisItem.menu_id,thisItem.restaurant_id], function(error){
                    thisItem.id = this.lastID
                    resolve(thisItem)
                })
            })
        }
    }
}


module.exports = {Restaurant, Menu, Item}