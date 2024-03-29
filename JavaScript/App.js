import myArray from "./Products.js";

let app = new Vue({
  el: "#app",
  data: {
    sitename: "After School",
    Product:myArray,
    ShowProduct: true,
    Cart: [
    
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
  }, 

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
      
      this.ShowProduct = !this.ShowProduct;
    },
    SubmitBtn: function() {
      event.preventDefault();
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
        let searchTermLower = this.searchValue.trim().toLowerCase(); 
        lessonsCopy = lessonsCopy.filter(item => {
          const subjectLower = item.subject?.toLowerCase();
          const locationUpper = item.location?.toUpperCase(); n

      
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
    }
  }
});
