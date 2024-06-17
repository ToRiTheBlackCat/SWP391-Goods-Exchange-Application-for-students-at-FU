document.addEventListener("DOMContentLoaded", function() {
    const productList = document.getElementById("product-list");
    const productImage = document.getElementById("product-image");
    const productName = document.getElementById("product-name");
    const productPrice = document.getElementById("product-price");
    const productDescription = document.getElementById("product-description");
  
    function displayProductDetails(item) {
      productImage.src = item.getAttribute("data-image");
      productName.value = item.getAttribute("data-name");
      productPrice.value = item.getAttribute("data-price");
      productDescription.value = item.getAttribute("data-description");
    }
  
    // Display details of the first product on page load
    const firstProduct = productList.querySelector("li");
    if (firstProduct) {
      displayProductDetails(firstProduct);
    }
  
    productList.addEventListener("click", function(event) {
      if (event.target && event.target.nodeName === "LI") {
        displayProductDetails(event.target);
      }
    });
  });
  