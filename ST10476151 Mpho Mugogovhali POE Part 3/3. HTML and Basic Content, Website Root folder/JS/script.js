
// ==========================================
// CAFÉ LOGO PAGE TRANSITION
// ==========================================

window.addEventListener("DOMContentLoaded", function () {

    const loadingScreen = document.createElement("div");
    loadingScreen.classList.add("loading-screen");

    const logo = document.createElement("img");
    logo.src = "images/logo.png";
    logo.alt = "The Daily Grind Café Logo";

    loadingScreen.appendChild(logo);
    document.body.appendChild(loadingScreen);

    setTimeout(function () {
        loadingScreen.remove();
    }, 5000);

});


// ==========================================
// MENU SEARCH FUNCTIONALITY
// ==========================================

const menuSearch = document.getElementById("menuSearch");

if (menuSearch) {

    menuSearch.addEventListener("input", function () {

        const searchText = menuSearch.value.toLowerCase();
        const menuItems = document.querySelectorAll("main li");

        menuItems.forEach(function (item) {

            const itemName = item.textContent.toLowerCase();

            if (itemName.includes(searchText)) {
                item.style.display = "";
            } else {
                item.style.display = "none";
            }

        });

    });

}


// ==========================================
// SHOPPING CART AND CHECKOUT
// ==========================================

const cartModal = document.getElementById("cartModal");

if (cartModal) {

    let cart = [];

    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");
    const cartItems = document.getElementById("cartItems");
    const cartGrandTotal = document.getElementById("cartGrandTotal");
    const checkoutButton = document.getElementById("checkoutButton");

    // Add items to cart
    document.querySelectorAll(".add-to-cart").forEach(function(button) {

        button.addEventListener("click", function() {

            const name = button.dataset.name;
            const price = Number(button.dataset.price);

            const existingItem = cart.find(function(item) {
                return item.name === name;
            });

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }

            updateCart();

            button.textContent = "Added!";

            setTimeout(function() {
                button.textContent = "Add to Cart";
            }, 1000);

        });

    });


    // Update cart totals
    function updateCart() {

        let totalItems = 0;
        let totalPrice = 0;

        cart.forEach(function(item) {
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;
        });

        cartCount.textContent = totalItems +
            (totalItems === 1 ? " item" : " items");

        cartTotal.textContent = "Total: R" + totalPrice.toFixed(2);
        cartGrandTotal.textContent = "Total: R" + totalPrice.toFixed(2);

        displayCartItems();
    }


    // Display cart products
    function displayCartItems() {

        cartItems.innerHTML = "";

        if (cart.length === 0) {
            cartItems.innerHTML = "<p>Your cart is currently empty.</p>";
            return;
        }

        cart.forEach(function(item, index) {

            const itemDiv = document.createElement("div");
            itemDiv.classList.add("cart-item");

            const heading = document.createElement("h3");
            heading.textContent = item.name;

            const price = document.createElement("p");
            price.textContent = "R" + item.price.toFixed(2) + " each";

            const decreaseButton = document.createElement("button");
            decreaseButton.textContent = "−";

            decreaseButton.addEventListener("click", function() {
                changeQuantity(index, -1);
            });

            const quantity = document.createElement("span");
            quantity.textContent = " " + item.quantity + " ";

            const increaseButton = document.createElement("button");
            increaseButton.textContent = "+";

            increaseButton.addEventListener("click", function() {
                changeQuantity(index, 1);
            });

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";

            removeButton.addEventListener("click", function() {
                removeItem(index);
            });

            itemDiv.append(
                heading,
                price,
                decreaseButton,
                quantity,
                increaseButton,
                removeButton
            );

            cartItems.appendChild(itemDiv);

        });

    }


    // Change product quantity
    function changeQuantity(index, amount) {

        cart[index].quantity += amount;

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }

        updateCart();
    }


    // Remove product
    function removeItem(index) {

        cart.splice(index, 1);
        updateCart();

    }


    // Open cart
    document.getElementById("goToCart").addEventListener("click", function() {
        cartModal.style.display = "flex";
    });


    // Close cart
    document.getElementById("closeCart").addEventListener("click", function() {
        cartModal.style.display = "none";
    });


    // Close cart when clicking outside
    cartModal.addEventListener("click", function(event) {

        if (event.target === cartModal) {
            cartModal.style.display = "none";
        }

    });


    // Checkout
    checkoutButton.addEventListener("click", function() {

        if (cart.length === 0) {
            alert("Your shopping cart is empty. Please add items first.");
            return;
        }

        let orderDetails = "Hello The Daily Grind Café,\n\n";
        orderDetails += "I would like to place the following order:\n\n";

        let total = 0;

        cart.forEach(function(item) {

            const itemTotal = item.price * item.quantity;

            orderDetails += item.name + " x " + item.quantity +
                " = R" + itemTotal.toFixed(2) + "\n";

            total += itemTotal;

        });

        orderDetails += "\nTotal: R" + total.toFixed(2);
        orderDetails += "\n\nPlease confirm the availability of my order.";

        const emailLink =
            "mailto:hello@thedailygrind.co.za" +
            "?subject=" + encodeURIComponent("Café Order") +
            "&body=" + encodeURIComponent(orderDetails);

        window.location.href = emailLink;

    });

}


// ==========================================
// ENQUIRY FORM VALIDATION
// ==========================================

const enquiryForm = document.getElementById("enquiryForm");

if (enquiryForm) {

    enquiryForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const fullName = document.getElementById("full-name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const enquiryType = document.getElementById("enquiry-type").value;
        const message = document.getElementById("message").value.trim();

        // Validate name
        if (fullName.length < 2) {
            alert("Please enter your full name.");
            return;
        }

        // Validate email
        if (!document.getElementById("email").checkValidity()) {
            alert("Please enter a valid email address.");
            return;
        }

        // Validate phone number if provided
        if (phone !== "" && !/^0[0-9]{9}$/.test(phone)) {
            alert("Please enter a valid 10-digit South African phone number.");
            return;
        }

        // Validate enquiry type
        if (enquiryType === "") {
            alert("Please select a type of enquiry.");
            return;
        }

        // Validate message
        if (message.length < 10 || message.length > 500) {
            alert("Your message must contain between 10 and 500 characters.");
            return;
        }

        // Prepare enquiry email
        const subject = "Café Enquiry - " + enquiryType;

        const enquiryDetails =
            "New enquiry for The Daily Grind Café\n\n" +
            "Name: " + fullName + "\n" +
            "Email: " + email + "\n" +
            "Phone: " + (phone || "Not provided") + "\n" +
            "Enquiry Type: " + enquiryType + "\n\n" +
            "Message:\n" + message;

        const emailLink =
            "mailto:hello@thedailygrind.co.za" +
            "?subject=" + encodeURIComponent(subject) +
            "&body=" + encodeURIComponent(enquiryDetails);

        alert("Your enquiry has been validated. Your email application will now open.");

        window.location.href = emailLink;

    });

}


// ==========================================
// CONTACT FORM VALIDATION
// ==========================================

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("contact-name").value.trim();
        const email = document.getElementById("contact-email").value.trim();
        const messageType = document.getElementById("message-type").value;
        const message = document.getElementById("contact-message").value.trim();

        // Validate name
        if (name.length < 2) {
            alert("Please enter your full name.");
            return;
        }

        // Validate email
        if (!document.getElementById("contact-email").checkValidity()) {
            alert("Please enter a valid email address.");
            return;
        }

        // Validate message type
        if (messageType === "") {
            alert("Please select a message type.");
            return;
        }

        // Validate message
        if (message.length < 10 || message.length > 500) {
            alert("Your message must contain between 10 and 500 characters.");
            return;
        }

        // Prepare contact email
        const subject = "Contact Message - " + messageType;

        const emailBody =
            "Contact message for The Daily Grind Café\n\n" +
            "Name: " + name + "\n" +
            "Email: " + email + "\n" +
            "Message Type: " + messageType + "\n\n" +
            "Message:\n" + message;

        const emailLink =
            "mailto:hello@thedailygrind.co.za?subject=" +
            encodeURIComponent(subject) +
            "&body=" + encodeURIComponent(emailBody);

        alert("Your message has been validated. Your email application will now open.");

        window.location.href = emailLink;

    });

}
