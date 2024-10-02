import { cartItems } from "./cart-items.js";

async function getProducts() {
  // Данный токен никому не должен попасть на руки
  const apiUrl =
    "https://charming-bracelet-8b01a8e436.strapiapp.com/api/products?populate=*";

  const token = `2f70a61eb58b7217810e0b715ffbd20fbf9d5bc30bcaafff931c23c24d24511178fdc9cee9f365ea86ad40bf63777e52b2b5be3f2ebabbf866a6fffe3ab3d4a5c918d7d145d8491526ed538db40a7e1d4a85f7a238f83ecdb83f11e6249d8e5c638a751aa3260cee4d08ed10848cfd5c90acc835f1c4455348230c8efc2d40a6`;

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // В зависимости от API, этот заголовок может быть необязательным
    },
  });

  const data = await response.json(); // Десерелизация

  return data;
}

async function renderProducts() {
  const { data: products } = await getProducts(); // Получаем все товары из API (Бэкенда)
  const productsWrapper = document.getElementById("products-wrapper"); // Выбираем из HTML элемент внутри которого отрисуем товары

  if (productsWrapper) {
    // Проходимся циклом по всем
    products.forEach((product) => {
      const id = product.id;
      const { name, price, description, imageUrl } = product.attributes; // Создаём переменные из attributes
      const imageLink = imageUrl.data.attributes.url; // Вытаскиваем ссылку на картинку из объекта imageUrl
      const slicedDescription = description.slice(0, 72); // Берем описание и режем его до 72 символов

      // Вёрстка одного товара
      const productDiv = `<div class="product">
                            <div class="product__inner">
                                <a id="product-${id}" class="product__btn">Add to cart</a>

                                <ul class="product__list">
                                    <li class="product__item"> <img class="product__icon" src="../img/share-icon.svg"
                                            alt="share"><a class="product__link" href="#">Share</a></li>
                                    <li class="product__item"> <img class="product__icon" src="../img/arrows-icon.svg"
                                            alt="arrow"><a class="product__link" href="#">Compare</a></li>
                                    <li class="product__item"> <img class="product__icon" src="../img/heart-icon.svg"
                                            alt="heart"><a class="product__link" href="#">Like</a></li>
                                </ul>
                            </div>

                            <img class="product__img" src="${imageLink}" alt="dining">
                            <div class="product__teg">
                                <span class="product__teg-price">30%</span></div>
                                <p class="product__subtitle">${name}</p>
                                <p class="product__info">${slicedDescription} ...</p>
                            <div class="product__prices">
                                <p class="product__price">${price} сом</p>
                            </div>
                        </div>`;

      //Вставляем товар в HTML внутри бока productsWrapper
      productsWrapper.innerHTML += productDiv;
    });

    products.forEach((product) => {
      const id = product.id;
      const { name, price, imageUrl } = product.attributes; // Создаём переменные из attributes
      const imageLink = imageUrl.data.attributes.url; // Вытаскиваем ссылку на картинку из объекта imageUrl

      const addButton = document.getElementById(`product-${id}`); // Кнопка добавить товар

      addButton.addEventListener("click", () => {
        // При клике на кнопку
        const selectedProduct = cartItems.find((item) => item.id === id);

        if (selectedProduct) {
          // Если товар уже присутствует в корзине
          selectedProduct.count += 1; // То просто увеличь поле count но не добавляй новый товар
        } else {
          // Иначе же добавь новый товар в корзину
          const cartItem = {
            id,
            name,
            price: Number(price),
            imageUrl: imageLink,
            count: 1,
          };

          cartItems.push(cartItem);

          sessionStorage.setItem("cart-items", JSON.stringify(cartItems));
        }
      });
    });
  }
}

renderProducts();
