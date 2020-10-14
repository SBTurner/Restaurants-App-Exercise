const {loader, db} = require("./Loader")

// Set up an asynchronous function that creates the tables within the database before carrying out the tests.
beforeAll(done => {
    db.exec(`
        CREATE TABLE restaurants(id INTEGER PRIMARY KEY, name TEXT);
        CREATE TABLE menus(id INTEGER PRIMARY KEY, title TEXT, restaurant_id INTEGER);
        CREATE TABLE items(id INTEGER PRIMARY KEY, name TEXT, price FLOAT, menu_id INTEGER, restaurant_id INTEGER);
    `, loader.bind(null, done))
})


describe("Loading JSON data - Restaurants", ()=>{
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