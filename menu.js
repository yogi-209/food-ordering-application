const API_URL =
"https://storage.googleapis.com/acciojob-open-file-collections/appsmith-uploads/bb3807e9b0bc49958d39563eb1759406.json";
let menuItems = [];
const foodContainer=document.getElementById("food-container");
const orderButton=document.getElementById("order-btn");
const orderStatus=document.getElementById("order-status");
async function getMenu() {
    try {
        const response=await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Unable to fetch food items");
        }
        menuItems=await response.json();
        foodContainer.innerHTML = "";
        menuItems.forEach((food)=>{
            const foodCard = document.createElement("div");
            foodCard.classList.add("food-card");
            foodCard.innerHTML = `
                <img src="${food.imgSrc}" alt="${food.name}">
                <div class="food-info">
                    <h3>${food.name}</h3>
                    <p>$${Number(food.price).toFixed(2)}</p>
                </div>
            `;
            foodContainer.appendChild(foodCard);
        });
        console.log("Menu loaded successfully!");
    } catch (error) {
        console.error("Menu Error:", error);
        foodContainer.innerHTML =
            "<p>Sorry! Unable to load the menu. Please try again.</p>";
    }
}
function TakeOrder() {
    return new Promise((resolve, reject) => {
        if (menuItems.length < 3) {
            reject(new Error("Not enough food items to place an order"));
            return;
        }
        setTimeout(() => {
            const burgers = menuItems.filter((food) =>
                food.name.toLowerCase().includes("burger")
            );
            const availableItems =
                burgers.length >= 3 ? burgers : menuItems;
            const shuffledItems = [...availableItems];

            for (let i = shuffledItems.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledItems[i], shuffledItems[j]] =
                [shuffledItems[j], shuffledItems[i]];
            }
            const selectedItems = shuffledItems.slice(0, 3);
            const order = {
                items: selectedItems
            };
            console.log("Order received:", order);
            resolve(order);
        }, 2500);
    });
}
function orderPrep() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                order_status: true,
                paid: false
            });
        }, 1500);
    });
}
function payOrder() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                order_status: true,
                paid: true
            });
        }, 1000);
    });
}
function thankyouFnc() {
    alert("Thank you for eating with us today!");
}
async function startOrdering() {
    try {
        orderButton.disabled = true;
        orderStatus.innerHTML = "<p>Taking your order...</p>";
        const order = await TakeOrder();
        console.log("Selected food:", order.items);
        orderStatus.innerHTML = `
            <p>✅ Order received successfully!</p>
            <p>Preparing your food...</p>
        `;
        const preparation = await orderPrep();
        if (!preparation.order_status) {
            throw new Error("Food preparation failed");
        }
        orderStatus.innerHTML = `
            <p>✅ Food is ready!</p>
            <p>Proceeding to payment...</p>
        `;
        const payment = await payOrder();
        if (payment.paid) {
            orderStatus.innerHTML = `
                <p>✅ Order prepared successfully!</p>
                <p>✅ Payment completed successfully!</p>
                <p>Thank you for choosing Foodie!</p>
            `;
            thankyouFnc();
        }
    } catch (error) {
        console.error("Order Error:", error);
        orderStatus.innerHTML =
            "<p>❌ Something went wrong. Please try again.</p>";
    } finally {
        orderButton.disabled = false;
    }
}
document.addEventListener("DOMContentLoaded", () => {
    getMenu();
    orderButton.addEventListener("click", startOrdering);
});