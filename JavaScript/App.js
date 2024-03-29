import myArray from "./Products.js";

let app = new Vue({
  el: "#app",
  data: {
    sitename: "After School",
    Product: myArray,
    // Product: [
    //   {
    //     id: 14,
    //     subject: "Cooking",
    //     // location: "Home Economics Room",
    //     price: 15,
    //     picture: "[Image of tempera paint set]",
    //     availability: 12,
    //     rating: 2,
    //     description:
    //       "Cooking Club: Learn basic cooking skills and create delicious dishes. Fee covers ingredients."
    //   }
    // ],
    ShowProduct: true,
    Cart: [
      // {
      //   id: 10,
      //   title: "Tommy",
      //   description:
      //     " Some quick example text to build on the card title and make upthe bulk of the card's content.",
      //   price: 500,
      //   image: "Images/lucas-ludwig-CMnikGdcIjo-unsplash.jpg",
      //   availableInventory: 5
      // }
    ],
    sortBy: "subject",
    sortOrder: "asc",
    searchValue: "",
    name: "",
    phone: "",
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
  }, // Removed the watch property as a computed property

  methods: {
    AddToCartBtn: function(product) {
      console.log(product);
      this.Cart.push(product);
      product.availability--;
    },
    removeFromCart: function (item) {
      const index = this.Cart.findIndex(cartItem => cartItem.id === item.id);
      if (index !== -1) {
        this.Cart.splice(index, 1);
      }
    },
    showCheckout: function() {
      // SumOfTotalProduct();
      this.ShowProduct = !this.ShowProduct;
    },
    SubmitBtn: function() {
      event.preventDefault();
      // alert("Order Placed !");
    },
    CanAddToCart: function(product) {
      return product.availability != 0 > this.CartCount(product.id);
    },
    CartCount: function(product) {
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
    CartItemCount: function() {
      return this.Cart.length || "0";
    },
    cartTotal() {
      return this.Cart.reduce((sum, item) => sum + (item.price * item.availability), 0);
    },
  
   
    sortedLessons() {
      let lessonsCopy = this.Product;
      if (this.searchValue) {
        let searchTermLower = this.searchValue.trim().toLowerCase(); // Ensure trimmed search term
        lessonsCopy = lessonsCopy.filter(item => {
          const subjectLower = item.subject?.toLowerCase();
          const locationUpper = item.location?.toUpperCase(); // Consistent case conversion for location

          // Search for case-insensitive matches in subject and location
          return (
            subjectLower?.includes(searchTermLower) ||
            locationUpper?.includes(searchTermLower)
          );
        });
      } // Avoid mutating original data
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
