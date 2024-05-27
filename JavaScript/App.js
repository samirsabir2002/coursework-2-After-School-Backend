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
          const subjectLower = item.subject?.toLowerCase();
          const locationUpper = item.location?.toUpperCase();
          n;

          return (
            subjectLower?.includes(searchTermLower) ||
            locationUpper?.includes(searchTermLower)
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
