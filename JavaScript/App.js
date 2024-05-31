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
      NV: "Nevada"
    },
    searchText: "", // Search text
    searchResults: [] // Search results
  },
  created: function () {
    // Fetch product data from the server when the app is created
    try {
      fetch(
        "https://coursework-2-after-school.onrender.com/collection/products"
      ).then(function (res) {
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
      event.preventDefault();
      // Check if the product already exists in the cart
      let cartProduct = this.Cart.find((item) => item.id === product.id);

      if (cartProduct) {
        // If it exists, increment its quantity
        cartProduct.quantity++;
      } else {
        // If it's a new product, add it to the cart with quantity 1
        this.Cart.push({ ...product, quantity: 1 });
      }

      // Decrement product availability
      product.availability--;
    },

    removeFromCart: function (item) {
      // Find the item in the cart
      const index = this.Cart.findIndex((cartItem) => cartItem.id === item.id);

      if (index !== -1) {
        // If the item's quantity is greater than 1, decrement its quantity
        if (this.Cart[index].quantity > 1) {
          this.Cart[index].quantity--;
        } else {
          // If the quantity is 1, remove the item from the cart
          this.Cart.splice(index, 1);
        }

        // Increment product availability
        item.availability++;
      }
    },

    showCheckout: function () {
      // Toggle the view between the product list and the checkout page
      this.ShowProduct = !this.ShowProduct;
    },

    SubmitBtn: function (event) {
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
      let cartProduct = this.Cart.find((item) => item.id === product.id);
      return cartProduct ? cartProduct.quantity : 0;
    },

    ProcessOrder() {
      // Process the order and update product inventory
      let orderArray = [];

      // Create an order array from the cart items
      this.Cart.forEach((item) => {
        orderArray.push({ LessonId: item._id, numberOfSpaces: item.quantity });
      });

      const newOrder = {
        name: this.name,
        phone: this.phone,
        orderitems: orderArray
      };

      // Send the new order to the server
      fetch(
        "https://coursework-2-after-school.onrender.com/collection/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newOrder)
        }
      )
        .then((res) => res.json())
        .then((resjson) => {
          console.log("🚀 ~ ProcessOrder ~ resjson:", resjson);
        });

      // Update the product inventory on the server
      this.Cart.forEach((item) => {
        this.UpdateProduct(item._id, item.quantity);
      });

      // Clear the cart
      this.Cart = [];

      // Refresh the product data from the server
      fetch(
        "https://coursework-2-after-school.onrender.com/collection/products"
      ).then((res) =>
        res.json().then((json) => {
          app.Product = json;
          console.log("🚀 ~ ProcessOrder ~ app.Product = json:", app.Product);
        })
      );
    },

    UpdateProduct(id, spaceValue) {
      // Update the product inventory on the server
      fetch(
        `https://coursework-2-after-school.onrender.com/collection/products/${id}/reduce/availableSpace/${spaceValue}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            mode: "no-cors"
          }
        }
      )
        .then((res) => res.json())
        .then((resjson) =>
          console.log("🚀 ~ UpdateProduct ~ resjson:", resjson)
        );
    },

    ServerImage(img) {
      // Construct the full URL for an image
      const NodeServerUrl = "https://coursework-2-after-school.onrender.com";
      const Image = img.split("/").pop().trim();
      const FullPath = NodeServerUrl + "/" + Image;
      return FullPath;
    },

    Searching() {
      // Perform a search based on the search input
      let searchTerm = this.search.toLowerCase();
      fetch(
        "https://coursework-2-after-school.onrender.com/collection/products/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ query: searchTerm })
        }
      ).then(function (response) {
        response.json().then(function (json) {
          app.Product = json;
        });
      });
    },
    itemTotalPrice(item) {
      return (item.price * item.quantity).toFixed(2);
    },

    ShowHomePageBtn: function () {
      // Toggle the view between the product list and the checkout page
      try {
        fetch(
          "https://coursework-2-after-school.onrender.com/collection/products"
        ).then(function (res) {
          res.json().then(function (json) {
            app.Product = json;
            console.log(app.Product);
          });
        });
        this.ShowProduct = !this.ShowProduct;
      } catch (ex) {
        console.error("🚀 ~ ex:", ex);
      }
    }
  },

  computed: {
    sortedLessons() {
      // Sort lessons based on selected criteria
      let lessonsCopy = [...this.Product];
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
      return this.Cart.reduce((count, item) => count + item.quantity, 0);
    },

    cartTotal() {
      // Calculate the total price of items in the cart
      return this.Cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ).toFixed(2);
    },

    totalProductsAdded() {
      // Calculate the total number of distinct products in the cart
      return this.Cart.length;
    }
  }
});
