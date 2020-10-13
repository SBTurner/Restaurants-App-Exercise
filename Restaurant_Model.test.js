const {Restaurant, Menu, Item} = require("./Restaurant_Model.js")

describe("Restaurants model", ()=>{
    test("Restaurant has a name", ()=>{
        const restaurant = new Restaurant("Pizza Hut")
        expect(restaurant.name).toBe("Pizza Hut")
    })
    test("Menu has a name", ()=>{
        const starters = new Menu("Starters")
        expect(starters.name).toBe("Starters")
    })
    test("Restaurant can have a menu", ()=>{
        const starters = new Menu("Starters")
        const restaurant = new Restaurant("Pizza Hut")
        restaurant.addMenu(starters)
        expect(restaurant.menus[0].name).toBe("Starters")
    })
    test("Restaurant can remove a menu", ()=>{
        const starters = new Menu("Starters")
        const restaurant = new Restaurant("Pizza Hut")
        restaurant.addMenu(starters)
        restaurant.removeMenu(starters)
        expect(restaurant.menus).toStrictEqual([])
    })
    test("Menu contains Items", ()=>{
        const starters = new Menu("Starters")
        const prawns = new Item("Prawns", 3.50)
        starters.addItem(prawns)
        expect(starters.items[0].price).toBe(3.50)
    })
    test("Menu can remove an item", ()=>{
        const starters = new Menu("Starters")
        const prawns = new Item("Prawns", 3.50)
        starters.addItem(prawns)
        starters.removeItem(prawns)
        expect(starters.items).toStrictEqual([])
    })
    test("Access an items price, via the menu, from within a restaurant", ()=>{
        const restaurant = new Restaurant("Pizza Hut")
        const starters = new Menu("Starters")
        const prawns = new Item("Prawns", 3.50)
        restaurant.addMenu(starters)
        starters.addItem(prawns)
        expect(restaurant.menus[0].items[0].price).toBe(3.50)
    })



})