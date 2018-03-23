// JavaScript för att implementera kraven A-E.
let products;
let target =$("#hereBeProducts");
let targetShoppingCart =$("#hereBeShoppingCart");
let buttonForCart = $("#spawnCart");
let totalCost = 0;
let thingsThatGoToJson = [];
// $.getJSON("orders.json", function(json) {
//     console.log(json); // this will show the info it in firebug console
// });

$.get("http://demo.edument.se/api/products", (response) => {
    let actuallResponse = response.slice(0,8); //någon la till 2000 object i den så liten fix
for(let key of Object.keys(actuallResponse)) {
    actuallResponse[key].Amount = Math.floor(Math.random() * 10 + 1);
    actuallResponse[key].AmountInCart = 0;
}

products = actuallResponse;
console.log(products);  //testing
products.forEach(printOut);
});

let printOut = function (product) {
    let thisProduct = $("<article></article>");
    let name = $("<h2></h2>");
    name.text(product.Name);
    let description = $("<p></p>");
    description.text(product.Description);
    let price = $("<footer></footer>");
    price.text(`${product.Price} $$$`);
    let image = $("<img>");
    image.attr("src", product.Image);
    let button = $("<button></button>");
    button.text("Add to Cart " + product.Amount + " left in storage!");
    button.click(() => {
        if(product.Amount >= 1)
        {
            product.Amount--;
            button.text("Add to Cart " + product.Amount + " left in storage!");
            product.AmountInCart++;
            console.log(product.Name + " " + product.AmountInCart);  //testing
            console.log(products);  //testing
            if (product.Amount === 0)
            {
                button.text("Sold Out");

            }
        }

    });
    thisProduct.append(name, image, description, price, button);
    target.append(thisProduct);
};
buttonForCart.click(() =>
{
    targetShoppingCart.empty();
    totalCost = 0;
    thingsThatGoToJson = [];
    products.forEach(printOutShoppingCart);
    if (totalCost > 0)
    {
        let checkOutButton = $("<button></button>");
        checkOutButton.text("Buy this for  " + totalCost + " $$$");

        checkOutButton.click(() => {
            // $.post( "http://localhost:3000/orders",{ productId: "John", time: "2pm" })
            //     .done(function( data ) {
            //         alert( "Order placed! Total cost: " + totalCost + " $$$");
            //     });
            console.log(thingsThatGoToJson);
            $.ajax({
                type: "POST",
                url: "http://localhost:3000/orders",
                // The key needs to match your method's input parameter (case-sensitive).
                data: JSON.stringify({ Order: thingsThatGoToJson }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){alert("We got your money now AHAHAHAHAHA!");},
                failure: function(errMsg) {
                    alert("Try again, i want your money!");
                }
            });
        });
        targetShoppingCart.append(checkOutButton);
    }

    console.log(totalCost);


});
let printOutShoppingCart = function (product)
{
if(product.AmountInCart > 0)
{
    let thisProduct = $("<article></article>");
    let name = $("<h2></h2>");
    name.text(product.Name);
    let amount = $("<p></p>");
    amount.text(`${product.AmountInCart} in cart`);
    let cost = +product.Price * +product.AmountInCart;
    let sumOfItem = $("<p></p>");
    sumOfItem.text(`${cost} $$$ Total`);
    let price = $("<p></p>");
    price.text(`${product.Price} $$$`);
    let image = $("<img>");
    image.attr("src", product.Image);
    thisProduct.append(image, name, price, amount, sumOfItem);
    targetShoppingCart.append(thisProduct);
    totalCost = totalCost + cost;
    thingsThatGoToJson.push("Product id:" + product.Id + " Amount:" + product.AmountInCart);
}
};