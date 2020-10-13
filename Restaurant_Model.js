
class Restaurant{
    constructor(name){
        this.name = name
        this.menus = []
    }
    
    addMenu(...menu){
        this.menus.push(...menu)
    }
    removeMenu(menu){
        var ind = this.menus.findIndex(i => i == menu.name)
        this.menus.splice(ind,1)
    }


}

class Menu{
    constructor(name){
        this.name = name
        this.items = []
    }
    
    addItem(item){
        this.items.push(item)
    }

    removeItem(item){
        var ind = this.items.findIndex(i => i == item.name)
        this.items.splice(ind)
    }
}



class Item{
    constructor(name,price){
        this.name = name
        this.price = price
    }

}


module.exports = {Restaurant, Menu, Item}