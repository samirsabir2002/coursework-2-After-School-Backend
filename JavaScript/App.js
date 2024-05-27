let app = new Vue({
  el: "#app",
  data: {
    sitename: "After School",
    Product: [],
    ShowProduct: true,
    Cart: [],
    sortBy: "subject",
    sortOrder: "asc",
    searchValue: "",
    name: "",
    phone: "",
    items: [],
    Order: {
      FirstName: "",
      Lastname: "",
      Address: "",
      State: "",
      Zip: "",
      City: "",
      Gift: "Send as Gift",
      SendGift: "Send as Gift",
      dontSendGift: "Do not Send as a Gift",
      Method: "Home"
    },
    states: {
      AL: "Alabama",
      AR: "Arizona",
      CA: "California",
      NV: "Neveda"
    },
    searchText: "",
    searchResults: []
  },
  created: function () {
    try {
      fetch("http://localhost:3000/collection/products").then(function (res) {
        res.json().then(function (json) {
          app.Product = json;
          console.log(app.Product);
        });
      });
    } catch (ex) {
      console.error("🚀 ~ ex:", ex);
    }
  },

  methods: {
    AddToCartBtn: function (product) {
      console.log(product);
      this.Cart.push(product);
      this.item.push(product);
      product.availability--;
    },

    removeFromCart: function (item) {
      const index = this.Cart.findIndex((cartItem) => cartItem.id === item.id);
      if (index !== -1) {
        this.Cart.splice(index, 1);
      }
    },
    showCheckout: function () {
      this.ShowProduct = !this.ShowProduct;
    },
    SubmitBtn: function () {
      event.preventDefault();
    },
    CanAddToCart: function (product) {
      return product.availability != 0 > this.CartCount(product.id);
    },
    CartCount: function (product) {
      let count = 0;
      for (var i = 0; i < this.Cart.length; i++) {
        if (this.Cart[i] === product) {
          count++;
        }
      }
      return count;
    },
    ProcessOrder() {
      let orderArray = [];

      let len = this.Cart.length;

      for (let index = 0; index < len; index++) {
        orderArray.push({ LessonId: this.Cart[index], numberOfSpaces: 1 });
      }

      // const newOrder = {
      //   name: this.customerdetails.name,
      //   phone: this.customerdetails.name,
      //   orderitems: orderArray
      // };

      const newOrder = {
        name: "Sameer",
        phone: "03123113",
        orderitems: orderArray
      };
      fetch("http://localhost:3000/collection/orders", {
        method: "Post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newOrder)
      })
        .then((res) => res.json())
        .then((resjson) => {
          console.log("🚀 ~ ProcessOrder ~ resjson:", resjson);
        });

      for (let index = 0; index < len; index++) {
        this.UpdateProduct(this.item[index]._id, 1);
      }
      this.item = [];
      this.cart = [];
      this.orderArray = [];

      fetch("http://localhost:3000/collection/orders").then((res) =>
        res
          .json()
          .then(
            (json) => (
              (app.Product = json),
              console.log(
                "🚀 ~ ProcessOrder ~ app.Product = json:",
                (app.Product = json)
              )
            )
          )
      );
    }
  },
  computed: {
    CartItemCount: function () {
      return this.Cart.length || "0";
    },
    cartTotal() {
      return this.Cart.reduce(
        (sum, item) => sum + item.price * item.availability,
        0
      );
    },

    sortedLessons() {
      let lessonsCopy = this.Product;
      if (this.searchValue) {
        let searchTermLower = this.searchValue.trim().toLowerCase();
        lessonsCopy = lessonsCopy.filter((item) => {
          const subjectLower = item.subject.toLowerCase();
          const locationUpper = item.location.toUpperCase();
          return (
            subjectLower.includes(searchTermLower) ||
            locationUpper.includes(searchTermLower)
          );
        });
      }
      return lessonsCopy.sort((a, b) => {
        let comparison = 0;
        switch (this.sortBy) {
          case "subject":
            comparison = a.subject.localeCompare(b.subject);
            break;
          case "location":
            comparison = a.location.localeCompare(b.location);
            break;
          case "price":
            comparison = a.price - b.price;
            break;
          case "spaces":
            comparison = a.spaces - b.spaces;
            break;
        }
        return this.sortOrder === "asc" ? comparison : -comparison;
      });
    }
  }
});
