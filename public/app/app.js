var coffeeMakers;
var cart = [];
var cartCounter = 0;
var current;
const options = {
  style: {
    main: {
      background: "#f3f3f3",
      color: "black",
    },
  },
};
function initFirebase() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("connected");
      $(".logged-in").css("display", "block");
      $(".logged-out").css("display", "none");
      current = user.displayName;
    } else {
      console.log("user is not there");
      $(".logged-in").css("display", "none");
      $(".logged-out").css("display", "block");
    }
  });
}

function login() {
  let password = $("#lPass").val();
  let email = $("#lEmail").val();

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // alert("signed in");
      iqwerty.toast.toast("signed in", options);

      $("#lEmai").val("");
      $("#lPass").val("");
      closeLoginModal();
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });
}

function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      iqwerty.toast.toast("signed out", options);
      closeAccModal();
    })
    .catch((error) => {
      console.log(error);
    });
}

function updateUser(fName) {
  firebase.auth().currentUser.updateProfile({
    displayName: fName,
  });
}

function createAcc() {
  let email = $("#cEmail").val();
  let password = $("#cPass").val();
  let fName = $("#fName").val();

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      iqwerty.toast.toast("account created", options);

      updateUser(fName);

      $("#fName").val("");
      $("#lName").val("");
      $("#cEmail").val("");
      $("#cPass").val("");
      current = user.displayName;
      closeLoginModal();
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });
}

function getCoffee() {
  $.getJSON("../data/data.json", function (data) {
    coffeeMakers = data;
  });
}

function displayCoffee() {
  $.each(coffeeMakers, function (index, coffee) {
    $(".coffee-makers").append(`
    <div class="coffee-maker">
      <div class="coffee-maker__flag"></div>
      <div class="coffee-maker__pic" style="background-image: url(${coffee.colors[0].url});"></div>
      <div class="coffee-maker__colors" id="colors${index}">
        
      </div>
      <div class="coffee-maker__text">
        <p class="coffee-maker__text__title">${coffee.name}</p>
        <p class="coffee-maker__text__price">$${coffee.price}</p>
      </div>
      <div class="coffee-maker__buy" onclick="addToCart(${index})">Buy Now</div>
    </div>
    `);
    let coffeeindex = index;
    $.each(coffee.colors, function (index, color) {
      if (color.color == "#fff") {
        $(`#colors${coffeeindex}`).append(`
        <div class="coffee-maker__colors__color coffee-maker__colors__color--white" style="background-color: ${color.color};">
        </div>
      `);
      } else {
        $(`#colors${coffeeindex}`).append(`
        <div class="coffee-maker__colors__color" style="background-color: ${color.color};">
        </div>
      `);
      }
    });
  });
}

function addToCart(index) {
  user = firebase.auth().currentUser;

  if (user) {
    $(".shopping-count").css("display", "flex");
    cart.push(coffeeMakers[index]);
    $(".shopping-count").html(`${cart.length}`);

    iqwerty.toast.toast("item added to cart", options);
  } else {
    iqwerty.toast.toast("you must be signed in to add to cart", options);
  }
}

function deleteItem(index) {
  cart.splice(index, 1);
  MODEL.getPageData("cart", displayCart);
  iqwerty.toast.toast("coffee maker removed from cart", options);

  if (cart.length == 0) {
    $(".shopping-count").css("display", "none");
  } else {
    $(".shopping-count").html(`${cart.length}`);
  }
}

function clearCart() {
  cart = [];
  $(".shopping-count").css("display", "none");
  // $(".shopping-count").html(`${cart.length}`);
  MODEL.getPageData("cart", displayCart);
  iqwerty.toast.toast("cart cleared", options);
}

function logOrSign(id) {
  if ($(id).hasClass("log")) {
    $(".log").addClass("login__buts__but--selected");
    $(".sign").removeClass("login__buts__but--selected");
    $(".inputs").html(`
    <div class="login-form">
      <input id="lEmail" type="email" placeholder="Email*">
      <input id="lPass" class="password" type="password" placeholder="Password*">
      <div class="login-form__but" onclick="login()">sign in</div>
    </div>
    `);
  } else if ($(id).hasClass("sign")) {
    $(".sign").addClass("login__buts__but--selected");
    $(".log").removeClass("login__buts__but--selected");
    $(".inputs").html(`
    <div class="login-form"">
      <input id="fName" type="text" placeholder="First Name*">
      <input id="lName" type="text" placeholder="Last Name*">
      <input id="cEmail" type="email" placeholder="Email*">
      <input id="cPass" class="password" type="password" placeholder="Password*">
      <div class="login-form__but" onclick="createAcc()">create an account</div>
    </div>
    `);
  }
}

function loginModal() {
  $(".login").css("display", "block");
  $(".login__buts__but").click(function () {
    logOrSign(this);
  });
  logOrSign($(".log"));
}

function closeLoginModal() {
  $(".login").css("display", "none");
}

function closeAccModal() {
  $(".account").css("display", "none");
}

function accountModal() {
  $(".account").css("display", "block");
  current = firebase.auth().currentUser;
  $("#username").html(`${current.displayName}`);
}

function mobileNav() {
  console.log("hi");
  $(".mobile-nav").css("display", "block");
}

function displayCart() {
  let total = 0;
  $.each(cart, function (index, item) {
    $(".items__container").append(`
    <div class="item">
      <div class="item__top">
        <p class="item__top__text">Save for later</p>
        <i class="fas fa-times" onclick="deleteItem(${index})"></i>
      </div>
      <div class="item__coffee">
        <div class="item__coffee__left">
            <div class="item__coffee__left__pic" style="background-image: url(${item.colors[0].url});">
                
            </div>
            <div class="item__coffee__left__name">
                ${item.name}
            </div>
        </div>
        <div class="item__coffee__price">$${item.price}</div>
      </div>
    </div>
    `);
    total = (Number(total) + Number(item.price)).toFixed(2);
  });
  $(".price-total").html(total);
  $(".array-count").html(`Subtotal(${cart.length} items)`);
}

function route(id) {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#/", "");

  if (!hashTag) {
    pageID = id;
  }

  MODEL.getPageData(pageID, loadPage);
}

function loadPage(pageID) {
  if (pageID == "coffee") {
    MODEL.getPageData(pageID, displayCoffee);
    $(".mobile-nav").addClass("mobile-nav--clicked");
    $(".hamburger").addClass("fa-bars");
    $(".hamburger").removeClass("fa-times");
    if ($(".hamburger").hasClass("fa-bars")) {
      $("body").css("overflow", "visible");
    } else {
      $("body").css("overflow", "hidden");
    }
  } else if (pageID == "cart") {
    MODEL.getPageData(pageID, displayCart);
    $(".mobile-nav").addClass("mobile-nav--clicked");
    $(".hamburger").addClass("fa-bars");
    $(".hamburger").removeClass("fa-times");
    if ($(".hamburger").hasClass("fa-bars")) {
      $("body").css("overflow", "visible");
    } else {
      $("body").css("overflow", "hidden");
    }
  }
}

function initListeners() {
  $(window).on("hashchange", route);
  route();

  $(".nav-bot .nav-links").hover(function () {
    $(this).toggleClass("hovered");
  });

  $(".footer-mid .link").hover(function () {
    $(this).toggleClass("selected");
  });

  $(".account__links__link").hover(function () {
    $(this).toggleClass("hovered");
  });

  $(".profile .logged-out").click(function () {
    loginModal();
  });

  $(".profile .logged-in").click(function () {
    accountModal();
  });

  $(".hamburger").click(function () {
    $(".mobile-nav").toggleClass("mobile-nav--clicked");
    $(".hamburger").toggleClass("fa-bars");
    $(".hamburger").toggleClass("fa-times");
    $("body").css("overflow", "hidden");
    if ($(this).hasClass("fa-bars")) {
      $("body").css("overflow", "visible");
    } else {
      $("body").css("overflow", "hidden");
    }
  });
}

$(document).ready(function () {
  try {
    let app = firebase.app();
    initFirebase();
    initListeners();
    route("coffee");
    getCoffee();
  } catch {
    console.error("yes");
  }
});
