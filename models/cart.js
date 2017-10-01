module.exports = function Cart (oldCart) {
  this.items = oldCart.items || {}
  this.totalQty = oldCart.totalQty || 0
  this.totalPrice = oldCart.totalPrice || 0
  
  this.add = function (item, id) {
    let storedItems = this.items[id]
    if(!storedItems){
      storedItems = this.items[id] = {item: item, qty: 0, price: 0}
    }
    storedItems.qty++
    storedItems.price = storedItems.item.price * storedItems.qty
    this.totalQty++
    this.totalPrice += storedItems.item.price
  }

  this.generateArray = function () {
    let arr = []
    for(let id in this.items){
      arr.push(this.items[id])
    }
    return arr
  }
}
