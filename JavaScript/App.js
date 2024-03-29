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
    }
  },
  methods: {
    AddToCartBtn: function(product) {
      console.log(product);
      this.Cart.push(product);
      product.availability--;
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

    SumOfTotalProduct: function() {
      this.Cart.forEach(element => {
        const total = element.price * this.CartItemCount;
        this.Cart[element.title || element.id] = this.Cart[
          element.subject || element.Id
        ]
          ? this.Cart[element.subject || element.id] + total
          : total;
      });
      console.log(this.Cart);
      return this.Cart;
    },
    sortedLessons() {
      const lessonsCopy = this.Product; // Avoid mutating original data
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
