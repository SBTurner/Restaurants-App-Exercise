const {loader, db} = require("./Loader")
const { Restaurant, Menu, Item } = require("./models")

// Set up an asynchronous function that creates the tables within the database before carrying out the tests.
beforeAll(done => {
    db.exec(`
        CREATE TABLE restaurants(id INTEGER PRIMARY KEY, name TEXT, image TEXT);
        CREATE TABLE menus(id INTEGER PRIMARY KEY, title TEXT, restaurant_id INTEGER);
        CREATE TABLE items(id INTEGER PRIMARY KEY, name TEXT, price FLOAT, menu_id INTEGER, restaurant_id INTEGER);
    `, loader.bind(null, done))
})


describe.skip("Loading JSON data - Restaurants", ()=>{
    test("Restaurants have loaded into table", (done)=>{
        loader(()=>{
            db.get(`SELECT COUNT(id) AS total FROM restaurants;`, function(err,row){
                expect(row.total).toBe(8)
                done()
            }) 
        })
    })
    test("Menus have loaded into table", (done)=>{
        loader(()=>{
            db.get(`SELECT COUNT(id) AS total FROM menus;`, function(err,row){
                expect(row.total).toBe(18)
                done()
            }) 
        })
    })
    test("Items have loaded into table", (done)=>{
        loader(()=>{
            db.get(`SELECT COUNT(id) AS total FROM items;`, function(err,row){
                expect(row.total).toBe(84)
                done()
            }) 
        })
    })
})

describe.skip("Tests on using classes to push into the database", ()=>{
    test("Create new Restaurant appears in the database", async ()=>{
        const bettys = await new Restaurant({name: "Bettys", image: "image.url"})
        // expect database last row to be Bettys
        expect(bettys.id).toBe(9)
        db.get(`SELECT restaurants.name AS name, restaurants.image AS image, restaurants.id AS id FROM restaurants where id=9;`,function(err,row){
            expect(row.name).toBe("Bettys")
        })
    })

    test("Create new Restaurant which already has an id specified", async ()=>{
        const mcdonalds = await new Restaurant({id: 11, name: "McDonalds", image: "image3.url"})
        expect(mcdonalds.id).toBe(11)
    })

    test("Display all restaurants", async ()=>{
        const allRests = await Restaurant.findAll()
        await console.log(allRests)
        expect(allRests.length).toBe(9)
    })
    test("Create new Menu appears in the database", async ()=>{
        const yummy_appetisers = await new Menu({title: "Yummy appetisers", restaurant_id: 1})
        // expect database menu last row to be yummy appetisers
        expect(yummy_appetisers.id).toBe(19)
        db.get(`SELECT menus.title AS name, menus.id AS id FROM menus where id=19;`,function(err,row){
            expect(row.name).toBe("Yummy appetisers")
        })
    })
    test("Create new Menu which already has an id specified", async ()=>{
        const light_bites = await new Menu({id: 20, title: "Light bites", restaurant_id: 1})
        expect(light_bites.id).toBe(20)
    })
    test("Display all menus", async ()=>{
        const allMenus = await Menu.findAll()
        await console.log(allMenus)
        expect(allMenus.length).toBe(19)
    })
    test("Create new Item appears in the database", async ()=>{
        const eggs = await new Item({name: "Eggs", price: 3.5, menu_id: 4,restaurant_id: 1})
        // expect database item last row to be eggs
        expect(eggs.id).toBe(85)
        db.get(`SELECT items.name AS name, items.price AS price, items.id AS id FROM items where id=85;`,function(err,row){
            expect(row.name).toBe("Eggs")
        })
    })
    test("Create new Item with existing id appears in the database", async ()=>{
        const bacon = await new Item({id: 86, name: "Bacon", price: 3.5, menu_id: 4,restaurant_id: 1})
        // expect database item last row to be eggs
        expect(bacon.id).toBe(86)
    })
    test("Display all items", async ()=>{
        const allItems = await Item.findAll()
        expect(allItems.length).toBe(85)
    })
})


describe("Relational mapping between the three classes", ()=>{
    test("Can add a menu to a restaurant object", async ()=>{
        const rest = await new Restaurant({name: "Sophies Cafe"})
        await rest.addMenu({title: "Lunch Menu"})
        //await console.log(rest)
        expect(rest.menus[0].title).toBe("Lunch Menu")
    })
    test("Display all restaurants", async ()=>{
        const rest = await new Restaurant({name: "Tillys Cafe"})
        await rest.addMenu({title: "Nibbles"})
        const allRests = await Restaurant.findAll()
        //await console.log(allRests)
        //await console.log(rest)
        //await console.log(rest.menus[0])
        expect(allRests.length).toBe(10)
    })
    test("Can add an item to a menu object", async ()=>{
        const yummy_appetisers = await new Menu({title: "Yummy appetisers"})
        await yummy_appetisers.addItem({name: "Bacon", price: 3})
        //await console.log(yummy_appetisers)
        expect(yummy_appetisers.items[0].price).toBe(3)
    })
    test("Add an item to a menu then the menu to a restaurant", async ()=>{
        const rest = await new Restaurant({name: "Sarahs Cafe"})
        await rest.addMenu({title: "Puddings"})
        const menu = await rest.menus[0]
        await menu.addItem({name: "Cake", price: 3, restaurant_id: menu.restaurant_id})
        //await console.log(JSON.stringify(rest,null,2)) //Use JSON.stringify() to console log all of the arrays within arrays. Set spacing to be 2.
        expect(rest.menus[0].items[0].name).toBe("Cake")
        expect(rest.menus[0].items[0].restaurant_id).toEqual(rest.id)
        expect(rest.menus[0].restaurant_id).toEqual(rest.id)
        expect(rest.menus[0].items[0].menu_id).toEqual(menu.id)

    })
    test("Display all restaurants", async ()=>{
        const allRests = await Restaurant.findAll()
        //await console.log(allRests)
        expect(allRests.length).toBe(11)
    })

})

