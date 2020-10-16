const {Restaurant,Menu,Item, db} = require('./models')
const data = require("../SQLite3_Databases/restaurants.json")


// This ensures that the database is created. sync() adds the columns specified into the database connection.
// beforeAll(async ()=>{
//     await db.sync()
// })

// Create tables, then load in seed data (restaurants.json)
beforeAll(async () => {
    await db.sync().then(async () => {
        const taskQueue = data.map(async (json_restaurant) => {
                const restaurant = await Restaurant.create({name: json_restaurant.name, image: json_restaurant.image})
                const menus = await Promise.all(json_restaurant.menus.map(async (_menu) => {
                    const items = await Promise.all(_menu.items.map(({name, price}) => Item.create({name, price})))
                    const menu = await Menu.create({title: _menu.title})
                    return await menu.setItems(items) //setItems is built in to sequelize... set followed by the Class name.
                }))
                return await restaurant.setMenus(menus)
            })
        return Promise.all(taskQueue)
    })
})


// Sequelize is built on promises, therefore best to use async-await
describe("Working with Sequelize databases", ()=>{
    // Push each restaurant into the database from the restaurants.json file.
    test("Insert JSON data", async ()=>{
        const rest = await Restaurant.findOne({where: {name: "Cafe Monico"}, include: [{all: true, nested: true}]})
        expect(rest.menus.length).toBe(3)
        expect(rest.menus[0].items[0].name).toBe("Chicken Liver Parfait")
        //console.log(await Restaurant.findAll())

    })
    test("create new restaurant, menu and item and link together and ensure persist in the database", async ()=>{
        const bojangles = await Restaurant.create({name: "Bojangles", image: "image.url"})
        expect(bojangles.id).toBe(9)
        const starters = await Menu.create({title: "Starters"})
        expect(starters.title).toBe("Starters")
        const eggs = await Item.create({name: "Eggs", price: 3})
        expect(eggs.price).toBe(3)
        await starters.setItems(eggs).then(bojangles.setMenus(starters))
        const query = await Restaurant.findOne({where: {name: "Bojangles"}, include: [{all: true, nested: true}]})
        expect(await query.menus[0].items[0].name).toBe("Eggs")
    })

    
})