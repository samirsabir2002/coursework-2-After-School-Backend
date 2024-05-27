let app = new Vue({
  el: "#app",
  data: {
    sitename: "After School", // Name of the site
    Product: [], // Array to hold product data
    ShowProduct: true, // Boolean to toggle between product and checkout view
    Cart: [], // Array to hold items in the cart
    sortBy: "subject", // Default sort criteria
    sortOrder: "asc", // Default sort order
    search: "", // Search input value
    name: "", // Customer's name
    phone: "", // Customer's phone number
    items: [], // Array to hold items being processed for order
    Order: {
      // Order details
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
      // States for the address form
      AL: "Alabama",
      AR: "Arizona",
      CA: "California",
      NV: "Neveda"
    },
    searchText: "", // Search text
    searchResults: [] // Search results
  },
  created: function () {
    // Fetch product data from the server when the app is created
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
      // Add a product to the cart and decrement its availability
      console.log(product);
      this.Cart.push(product);
      this.items.push(product);
      product.availability--;
    },

    removeFromCart: function (item) {
      // Remove an item from the cart
      const index = this.Cart.findIndex((cartItem) => cartItem.id === item.id);
      if (index !== -1) {
        this.Cart.splice(index, 1);
      }
    },

    showCheckout: function () {
      // Toggle the view between the product list and the checkout page
      this.ShowProduct = !this.ShowProduct;
    },

    SubmitBtn: function () {
      // Prevent form submission
      event.preventDefault();
    },

    CanAddToCart: function (product) {
      // Check if a product can be added to the cart based on its availability
      return (
        product.availability != 0 &&
        this.CartCount(product.id) < product.availability
      );
    },

    CartCount: function (product) {
      // Count the number of occurrences of a product in the cart
      let count = 0;
      for (var i = 0; i < this.Cart.length; i++) {
        if (this.Cart[i] === product) {
          count++;
        }
      }
      return count;
    },

    ProcessOrder() {
      // Process the order and update product inventory
      let orderArray = [];
      let len = this.Cart.length;

      // Create an order array from the cart items
      for (let index = 0; index < len; index++) {
        orderArray.push({ LessonId: this.Cart[index].id, numberOfSpaces: 1 });
      }

      const newOrder = {
        name: "Sameer",
        phone: "03123113",
        orderitems: orderArray
      };

      // Send the new order to the server
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

      // Update the product inventory on the server
      for (let index = 0; index < len; index++) {
        this.UpdateProduct(this.items[index]._id, 1);
      }

      // Clear the cart and items arrays
      this.items = [];
      this.Cart = [];
      this.orderArray = [];

      // Refresh the product data from the server
      fetch("http://localhost:3000/collection/products").then((res) =>
        res.json().then((json) => {
          app.Product = json;
          console.log("🚀 ~ ProcessOrder ~ app.Product = json:", app.Product);
        })
      );
    },

    UpdateProduct(id, spaceValue) {
      // Update the product inventory on the server
      const attributeValue = "availableSpace";

      fetch(
        `http://localhost:3000/collection/products/${id}/reduce/${attributeValue}/${spaceValue}`,
        {
          method: "Put",
          headers: {
            "Content-Type": "application/json",
            mode: "no-cors"
          }
        }
      )
        .then((res) => res.json)
        .then((resjson) =>
          console.log("🚀 ~ UpdateProduct ~ resjson:", resjson)
        );
    },

    ServerImage(img) {
      // Construct the full URL for an image
      const NodeServerUrl = "http://localhost:3000";
      const Image = img.split("/").pop().trim();
      const FullPath = NodeServerUrl + "/" + Image;
      return FullPath;
    },

    Searching() {
      // Perform a search based on the search input
      let searchTerm = this.search.toLowerCase();
      fetch("http://localhost:3000/collection/products/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: searchTerm })
      }).then(function (response) {
        response.json().then(function (json) {
          app.Product = json;
        });
      });
    }
  },

  computed: {
    sortedLessons() {
      let lessonsCopy = this.Product;
      if (this.searchValue) {
        let searchTermLower = this.searchValue.trim().toLowerCase();
        fetch("http://localhost:3000/collection/products/search", {
          method: "Post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ searchvalue: searchTermLower })
        })
          .then((res) => res.json())
          .then((resjson) => {
            console.log("🚀 ~ ProcessOrder ~ resjson:", resjson);
            app.Product = resjson;
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
    },

    CartItemCount: function () {
      // Calculate the number of items in the cart
      return this.Cart.length || "0";
    },

    cartTotal() {
      // Calculate the total price of items in the cart
      return this.Cart.reduce(
        (sum, item) => sum + item.price * item.availability,
        0
      );
    }
  }
});
