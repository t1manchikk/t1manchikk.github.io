var app = new Vue({
    el: "#app",
    data: {
        products: [
            { id: 1, title: "TAG 1000 (TAG 853)", short_text: "White Garlic", image: "/assets/img/content/1.jpg", desc: "Full description" },
            { id: 2, title: "TAG 1000 (TAG 854)", short_text: "White Garlic", image: "/assets/img/content/2.jpg", desc: "Full description" },
            { id: 3, title: "TAG 1000 (TAG 855)", short_text: "White Garlic", image: "/assets/img/content/3.jpg", desc: "Full description" },
            { id: 4, title: "TAG 1000 (TAG 856)", short_text: "White Garlic", image: "/assets/img/content/4.jpg", desc: "Full description" },
            { id: 5, title: "TAG 1000 (TAG 857)", short_text: "White Garlic", image: "/assets/img/content/5.jpg", desc: "Full description" }
        ],
        product: [],
        cart: [], 
        btnVisible: 0,
        contactFields: {
            name: '',
            companyName: '',
            position: '',
            city: '',
            country: '',
            telephone: '',
            email: '',
            userType: 'seed producer',
            otherSpecify: '',
            interested: '',
            captcha: ''
        },
        orderSubmitted: false 
    },
    methods: {
        getProduct() {
            let id = window.location.hash.replace('#', '');
            if (id) {
                let found = this.products.find(item => item.id == id);
                if (found) {
                    this.product = [found];
                }
            }
        },
        addToCart(id) {
            let cart = [];
            if (window.localStorage.getItem('cart')) {
                cart = window.localStorage.getItem('cart').split(',');
            }

            if (!cart.includes(String(id))) {
                cart.push(id);
                window.localStorage.setItem('cart', cart.join(','));
                this.btnVisible = 1; 
                alert("Товар додано в кошик!");
                this.getCart();
            } else {
                alert("Цей товар вже в кошику!");
            }
        },
        checkInCart() {
            let cart = window.localStorage.getItem('cart');
            if (this.product.length > 0 && cart) {
                let cartItems = cart.split(',');
                if (cartItems.includes(String(this.product[0].id))) {
                    this.btnVisible = 1;
                }
            }
        },
        getCart() {
            this.cart = []; 
            let cartItems = window.localStorage.getItem('cart');

            if (cartItems) {
                let ids = cartItems.split(',');
                this.cart = this.products.filter(product => ids.includes(String(product.id)));
            }

            this.updateCartTable();
        },
        updateCartTable() {

            const tableBody = document.getElementById('cart-table-body');
            if (!tableBody) return;

            tableBody.innerHTML = '';

            if (this.cart.length === 0) {
                const emptyRow = document.createElement('tr');
                emptyRow.innerHTML = `<td colspan="4" class="empty-cart-message">Your cart is empty</td>`;
                tableBody.appendChild(emptyRow);
                return;
            }

            this.cart.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px;">
                    </td>
                    <td>${item.title}</td>
                    <td>${item.short_text}</td>
                    <td>
                        <button class="remove-btn" onclick="app.removeFromCart(${item.id})">✕</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        },
        removeFromCart(id) {
            this.cart = this.cart.filter(item => item.id !== id);

            let cartItems = [];
            if (this.cart.length > 0) {
                cartItems = this.cart.map(item => item.id);
                window.localStorage.setItem('cart', cartItems.join(','));
            } else {
                window.localStorage.removeItem('cart');
            }

            this.btnVisible = 0;
            this.checkInCart();

            this.updateCartTable();
            
            alert("Товар видалено з кошика!");
        },
        makeOrder() {
            this.orderSubmitted = true;

            this.cart = [];
            window.localStorage.removeItem('cart');

            console.log("Order submitted with the following information:", this.contactFields);
        },
        resetOrder() {
            this.orderSubmitted = false;
            this.contactFields = {
                name: '',
                companyName: '',
                position: '',
                city: '',
                country: '',
                telephone: '',
                email: '',
                userType: 'seed producer',
                otherSpecify: '',
                interested: '',
                captcha: ''
            };
        }
    },
    mounted() {
        this.getProduct();
        this.checkInCart(); 
        this.getCart(); 
    }
});