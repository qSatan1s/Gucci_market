document.addEventListener("DOMContentLoaded", () => {
  // Элементы DOM
  const search = document.querySelector(".search"),
    goodsWrapper = document.querySelector(".goods-wrapper"),
    cartBtn = document.getElementById("cart"),
    wishlistBtn = document.getElementById("wishlist"),
    cart = document.querySelector(".cart"),
    category = document.querySelector(".category"),
    cardCounter = cartBtn.querySelector(".counter"),
    wishlistCounter = wishlistBtn.querySelector(".counter"),
    cartWrapper = document.querySelector(".cart-wrapper");

  // Создаем массив с id товаров попавших в wishlist
  const wishlist = [];

  // Создаем объект корзины с id товаров и их количеством
  const goodsBasket = {};

  //  функция, показывающая спинер в каталоге и в корзине
  const loading = () => {
    const spinner = `
            <div id="spinner" ><div class="spinner-loading">
            <div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div></div></div></div>
        `;
    goodsWrapper.innerHTML = spinner; // каталог
    cartWrapper.innerHTML = spinner; // корзина
  };

  // Создаем карточку товара для каталога
  const createGardsGoods = (id, title, price, img) => {
    const card = document.createElement("div");
    card.className = "card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3";
    card.innerHTML = `
        <div class="card">
            <div class="card-img-wrapper">
                <img class="card-img-top" src="${img}" alt="">
                <button class="card-add-wishlist ${wishlist.includes(id) ? "active" : ""} "
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
        `;
    return card;
  };

  // Рендеринг всех карточек товаров для корзины
  const renderBasket = (items) => {
    cartWrapper.innerHTML = "";
    if (items.length) {
      items.forEach(({ id, title, price, imgMin }) => {
        cartWrapper.append(createGardGoodsBasket(id, title, price, imgMin));
      });
    } else {
      cartWrapper.innerHTML = '<div id="cart-empty">Ваша корзина пока пуста</div >';
    }
  };

  // Рендеринг одной карточки товара для корзины
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

  // Рендеринг карточек товаров
  const renderCard = (items) => {
    goodsWrapper.textContent = "";
    if (items.length) {
      items.forEach(({ id, title, price, imgMin }) => {
        goodsWrapper.append(createGardsGoods(id, title, price, imgMin));
      });
    } else {
      goodsWrapper.textContent = "❌ Извините, мы не нашли товаров по вашему запросу!";
    }
  };

  const calcTotalPrice = (goods) => {
    // традиционный способ суммирования
    // let sum = 0
    // for (const item of goods) {
    //     sum += item.price * goodsBasket[item.id]
    //     console.log('item: ', item);
    // }
    //  продвинутый метод суммирования
    let sum = goods.reduce((accum, item) => {
      return accum + item.price * goodsBasket[item.id];
    }, 0);
    cart.querySelector(".cart-total>span").textContent = sum.toFixed(2);
  };

  // Открываем корзину
  //  - фильтр товаров для корзины
  const showCardBasket = (goods) => {
    const basketGoods = goods.filter((item) => goodsBasket.hasOwnProperty(item.id));
    calcTotalPrice(basketGoods);
    return basketGoods;
  };
  //  - рендеринг корзины
  const openCart = (event) => {
    event.preventDefault();
    cart.style.display = "flex";
    document.addEventListener("keyup", closeCart);
    getGoods(renderBasket, showCardBasket);
    goodsWrapper.innerHTML = "";
  };

  // Закрываем корзину
  const closeCart = (event) => {
    const target = event.target;

    if (target === cart || target.classList.contains("cart-close") || event.keyCode === 27) {
      cart.style.display = "";
      document.addEventListener("keyup", closeCart);
      getGoods(renderCard, randomSort);
    }
  };

  // Извлечение карточек из БД с их последующей фильтрацией и рендиренгом
  const getGoods = (handler, filter) => {
    loading(); // спиннер
    setTimeout(() => {
      // для демонстрации спинера
      fetch("https://raw.githubusercontent.com/qSatan1s/Gucci_market/master/db/db.json") // извлечение товаров из БД
        .then((response) => response.json())
        .then(filter) // фильтрация
        .then(handler); // рендеринг
    }, 1000);
  };

  // Сортировка карточек в случайном порядке
  const randomSort = (item) => item.sort(() => Math.random() - 0.5);

  //  Используем замыкание и создаем функцию для фильтрации товаров по категории.
  const wrapperCategoryFilter = (category) => (goods) =>
    goods.filter((item) => item.category.includes(category));

  // Выбор карточек из определенной категории
  const chooseCategory = (event) => {
    event.preventDefault();
    const target = event.target;

    if (target.classList.contains("category-item")) {
      const category = target.dataset.category;
      // Создаем альтернативный фильтр с помощью метода bind()
      // const categoryFilter = goods => goods.filter(item => item.category.includes(category))
      // categoryFilter.bind(this, category)
      const categoryFilter = wrapperCategoryFilter(category);
      getGoods(renderCard, categoryFilter);
    }
  };

  // Поиск товаров
  const searchGoods = (event) => {
    event.preventDefault();
    const input = event.target.elements.searchGoods;
    const inputValue = input.value.trim();
    if (inputValue !== "") {
      const searchString = new RegExp(inputValue, "i");
      getGoods(renderCard, (goods) => goods.filter((item) => searchString.test(item.title)));
    } else {
      search.classList.add("error");
      setTimeout(() => {
        search.classList.remove("error");
      }, 2000);
    }
    input.value = "";
  };

  // Работа с куками в которых храним id товаров из корзины
  const getCookie = (name) => {
    let matches = document.cookie.match(
      new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"),
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
  };

  const cookieQuery = (get) => {
    if (get) {
      if (getCookie("goodsBasket")) {
        Object.assign(goodsBasket, JSON.parse(getCookie("goodsBasket")));
      }
      checkCount();
    } else {
      document.cookie = `goodsBasket=${JSON.stringify(goodsBasket)};max-age=86400e3`;
    }
  };

  // Количество товаров в корзине и в списке понравившихся
  const checkCount = () => {
    wishlistCounter.textContent = wishlist.length;
    cardCounter.textContent = Object.keys(goodsBasket).length;
  };

  // Работа с localStorage в котором храним понравившиеся товары
  const storageQuery = (get) => {
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

  // id товара записывается в объект массив WISHLIST (понравившиеся товары)
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

  // id товара записывается в объект КОРЗИНА
  const addBasket = (id) => {
    if (goodsBasket[id]) {
      goodsBasket[id] += 1;
    } else {
      goodsBasket[id] = 1;
    }
    checkCount();
    cookieQuery();
  };

  // Обработчик клика внутри карточки товара
  const handlerGoods = (event) => {
    const target = event.target;
    //  если товар  добавляем в список желаний
    if (target.classList.contains("card-add-wishlist")) {
      toggleWhishlist(target.dataset.goodsId, target);
    }
    //  если товар  добавляем в корзину
    if (target.classList.contains("card-add-cart")) {
      addBasket(target.dataset.goodsId);
    }
  };

  const showWishList = () => {
    getGoods(renderCard, (goods) => goods.filter((item) => wishlist.includes(item.id)));
  };

  const removeGoods = (id) => {
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

  // Навешиваем обработчики событий
  category.addEventListener("click", chooseCategory); // товары из выбранной категории
  search.addEventListener("submit", searchGoods);
  goodsWrapper.addEventListener("click", handlerGoods); // все товары
  wishlistBtn.addEventListener("click", showWishList); // товары из списка желаний
  cartBtn.addEventListener("click", openCart);
  cart.addEventListener("click", closeCart);
  cartWrapper.addEventListener("click", handlerBasket);

  // Загрузка карточек при инициализации магазина
  getGoods(renderCard, randomSort);
  // Извлечение id товаров помешенных в список желаний
  storageQuery(true);
  // Извлечение id товаров помешенных в корзину
  cookieQuery(true);
});
