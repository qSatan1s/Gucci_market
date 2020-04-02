document.addEventListener("DOMContentLoaded", () => {
    const search = document.querySelector(".search"),
        goodsWrapper = document.querySelector(".goods-wrapper"),
        cartBtn = document.getElementById("cart"),
        wishlistBtn = document.getElementById("wishlist"),
        title_ovner = document.querySelector(".title-ovner"),
        cart = document.querySelector(".cart"),
        category = document.querySelector(".category"),
        cardCounter = cartBtn.querySelector(".counter"),
        wishlistCounter = wishlistBtn.querySelector(".counter"),
        cartWrapper = document.querySelector(".cart-wrapper");
    var x = 1;

    const wishlist = [];

    const goodsBasket = {};


    const createGardsGoods = (id, title, price, img) => {
        const card = document.createElement("div");
        card.className = " card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3  ";
        card.draggable = "true";
        card.id = x++;
        card.innerHTML = `
     <div class="row"  >
     <div class="col-md-3 col-sm-6">
     <div class="product-grid" >
        <div class="card" id="qwe"  >
            <div class="card-img-wrapper" >
                <img class="card-img-top" src="${img}" alt="">
                <button class="card-add-wishlist ${
                  wishlist.includes(id) ? "active" : ""
                } "
                data-goods-id="${id}"></button>
            </div>
            <div class="card-body justify-content-between">
                <a href="#" class="card-title">${title}</a>
                <div class="card-price">${price} ₽</div>
                <div>
                    <button class="card-add-cart" data-goods-id="${id}">Добавить в корзину</button>
                </div>
            </div>
        </div>
             </div>
            </div>
            </div>
        `;
        return card;
    };

    const renderBasket = items => {
        cartWrapper.innerHTML = "";
        if (items.length) {
            items.forEach(({ id, title, price, imgMin }) => {
                cartWrapper.append(createGardGoodsBasket(id, title, price, imgMin));
            });
        } else {
            cartWrapper.innerHTML =
                '<div id="cart-empty">Ваша корзина пока пуста</div >';
        }
    };

    const createGardGoodsBasket = (id, title, price, img) => {
        const card = document.createElement("div");
        card.className = "goods";
        card.innerHTML = `

            <div class="goods-img-wrapper">
                <img class="goods-img" src="${img}" alt="">
            </div>
            <div class="goods-description">
                <h2 class="goods-title">${title}</h2>
                <p class="goods-price">${price} ₽</p>
            </div>
            <div class="goods-price-count">
                <div class="goods-trigger">
                    <button class="goods-add-wishlist ${
                      wishlist.includes(id) ? "active" : ""
                    }" data-goods-id="${id} "></button>
                    <button class="goods-delete" data-goods-id="${id}"></button>
                </div>
                <div class="goods-count">${goodsBasket[id]}</div>
            </div>
        `;
        return card;
    };

    const renderCard = items => {
        goodsWrapper.textContent = "";
        if (items.length) {
            items.forEach(({ id, title, price, imgMin }) => {
                goodsWrapper.append(createGardsGoods(id, title, price, imgMin));
            });
        } else {
            goodsWrapper.textContent =
                "❌ Извините, мы не нашли товаров по вашему запросу!";
        }
    };

    const calcTotalPrice = goods => {

        let sum = goods.reduce((accum, item) => {
            return accum + item.price * goodsBasket[item.id];
        }, 0);
        cart.querySelector(".cart-total>span").textContent = sum.toFixed(2);
    };


    const showCardBasket = goods => {
        const basketGoods = goods.filter(item =>
            goodsBasket.hasOwnProperty(item.id),
        );
        calcTotalPrice(basketGoods);
        return basketGoods;
    };
    const openCart = event => {
        event.preventDefault();
        cart.style.display = "flex";
        document.addEventListener("keyup", closeCart);
        getGoods(renderBasket, showCardBasket);
        goodsWrapper.innerHTML = "";
    };

    const closeCart = event => {
        const target = event.target;

        if (
            target === cart ||
            target.classList.contains("cart-close") ||
            event.keyCode === 27
        ) {
            cart.style.display = "";
            document.addEventListener("keyup", closeCart);
            getGoods(renderCard, randomSort);
        }
    };

    const getGoods = (handler, filter) => {
        fetch("db/db.json")
            .then(response => response.json())
            .then(filter)
            .then(handler);
    };


    const randomSort = item => item.sort(() => Math.random() - 0.5);


    const wrapperCategoryFilter = category => goods =>
        goods.filter(item => item.category.includes(category));


    const chooseCategory = event => {
        event.preventDefault();
        const target = event.target;

        if (target.classList.contains("category-item")) {
            const category = target.dataset.category;

            const categoryFilter = wrapperCategoryFilter(category);
            getGoods(renderCard, categoryFilter);
        }
    };


    const getCookie = name => {
        let matches = document.cookie.match(
            new RegExp(
                "(?:^|; )" +
                name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
                "=([^;]*)",
            ),
        );
        return matches ? decodeURIComponent(matches[1]) : undefined;
    };

    const cookieQuery = get => {
        if (get) {
            if (getCookie("goodsBasket")) {
                Object.assign(goodsBasket, JSON.parse(getCookie("goodsBasket")));
            }
            checkCount();
        } else {
            document.cookie = `goodsBasket=${JSON.stringify(
        goodsBasket,
      )};max-age=86400e3`;
        }
    };


    const checkCount = () => {
        wishlistCounter.textContent = wishlist.length;
        cardCounter.textContent = Object.keys(goodsBasket).length;
    };


    const storageQuery = get => {

        if (get) {
            if (localStorage.getItem("wishlist")) {
                const wishlistStorage = JSON.parse(localStorage.getItem("wishlist"));
                wishlist.push(...wishlistStorage);
            }
            checkCount();
        } else {
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
        }
    };

    const toggleWhishlist = (id, elem) => {
        if (wishlist.includes(id)) {
            wishlist.splice(wishlist.indexOf(id), 1);
            elem.classList.remove("active");
        } else {
            wishlist.push(id);
            elem.classList.add("active");
        }
        checkCount();
        storageQuery();
    };


    const addBasket = id => {
        if (goodsBasket[id]) {
            goodsBasket[id] += 1;
        } else {
            goodsBasket[id] = 1;
        }
        checkCount();
        cookieQuery();
    };

    const handlerGoods = event => {
        const target = event.target;

        if (target.classList.contains("card-add-wishlist")) {
            toggleWhishlist(target.dataset.goodsId, target);
        }

        if (target.classList.contains("card-add-cart")) {
            addBasket(target.dataset.goodsId);
        }
    };

    const showWishList = () => {
        getGoods(renderCard, goods =>
            goods.filter(item => wishlist.includes(item.id)),
        );
    };

    const removeGoods = id => {
        delete goodsBasket[id];
        checkCount();
        cookieQuery();
        getGoods(renderBasket, showCardBasket);
    };

    const handlerBasket = () => {
        const target = event.target;
        if (target.classList.contains("goods-add-wishlist")) {
            toggleWhishlist(target.dataset.goodsId, target);
        }
        if (target.classList.contains("goods-delete")) {
            removeGoods(target.dataset.goodsId);
        }
    };

    document.addEventListener(
        "dragover",
        function(event) {
            event.preventDefault();
        },
        false,
    );

    document.addEventListener(
        "dragstart",
        function(event) {
            window.element_1 = null;
            window.element_2 = null;
            element_1 = event.target;
            id_1 = element_1.id;
            sp1 = document.getElementById(id_1);
        },
        false,
    );

    document.addEventListener(
        "drop",
        function(event) {
            element_2 = event.target;
            id_2 = element_2.id;
            sp2 = document.getElementById(id_2);
            parentDiv = sp2.parentNode;
            if (id_1 < id_2) {
                parentDiv.insertBefore(sp1, sp2.nextSibling);
            } else {
                parentDiv.insertBefore(sp1, sp2);
            }
        },
        false,
    );

    onclick = function(even) {
        title = event.target
        div__title = title.className
        if (div__title == "card-title") {
            event.preventDefault();
            title_ovner.style.display = "flex";
            document.addEventListener("keyup", titleСlose);

        }
    }




    const titleСlose = event => {
        const target = event.target;

        if (
            target === title_ovner ||
            target.classList.contains("title-close") ||
            event.keyCode === 27
        ) {
            title_ovner.style.display = "";
            document.addEventListener("keyup", titleСlose);
        }
    };





    category.addEventListener("click", chooseCategory);
    goodsWrapper.addEventListener("click", handlerGoods);
    wishlistBtn.addEventListener("click", showWishList);
    cartBtn.addEventListener("click", openCart);
    cart.addEventListener("click", closeCart);
    title_ovner.addEventListener("click", titleСlose);
    cartWrapper.addEventListener("click", handlerBasket);

    getGoods(renderCard, randomSort);
    storageQuery(true);
    cookieQuery(true);
});