// @codekit-prepend "/vendor/hammer-2.0.8.js";

$(document).ready(function () {
  // DOMMouseScroll included for Firefox support
  let canScroll = true;
  let scrollController = null;

  $(this).on("mousewheel DOMMouseScroll", function (e) {
    if (!$(".outer-nav").hasClass("is-vis")) {
      e.preventDefault();

      const delta = e.originalEvent.wheelDelta
        ? -e.originalEvent.wheelDelta
        : e.originalEvent.detail * 20;

      if (Math.abs(delta) > 50 && canScroll) {
        canScroll = false;
        clearTimeout(scrollController);
        scrollController = setTimeout(() => {
          canScroll = true;
        }, 800);
        updateHelper(delta > 0 ? 1 : -1);
      }
    }
  });

  $(".side-nav li, .outer-nav li").click(function () {
    if (!$(this).hasClass("is-active")) {
      const $this = $(this);
      const curActive = $this.parent().find(".is-active");
      const curPos = $this.parent().children().index(curActive);
      const nextPos = $this.parent().children().index($this);
      const lastItem = $(this).parent().children().length - 1;

      updateNavs(nextPos);
      updateContent(curPos, nextPos, lastItem);
    }
  });

  $(".cta").click(function () {
    const curActive = $(".side-nav").find(".is-active");
    const curPos = $(".side-nav").children().index(curActive);
    const lastItem = $(".side-nav").children().length - 1;

    updateNavs(lastItem);
    updateContent(curPos, lastItem, lastItem);
  });

  // Swipe support for touch devices
  const targetElement = document.getElementById("viewport");
  const mc = new Hammer(targetElement);

  mc.get("swipe").set({ direction: Hammer.DIRECTION_VERTICAL });
  mc.on("swipeup swipedown", function (e) {
    updateHelper(e.type === "swipeup" ? 1 : -1);
  });

  $(document).keyup(function (e) {
    if (!$(".outer-nav").hasClass("is-vis")) {
      e.preventDefault();
      if ([38, 40].includes(e.keyCode)) {
        updateHelper(e.keyCode === 40 ? 1 : -1);
      }
    }
  });

  // Helper Functions
  function updateHelper(param) {
    const curActive = $(".side-nav").find(".is-active");
    const curPos = $(".side-nav").children().index(curActive);
    const lastItem = $(".side-nav").children().length - 1;
    let nextPos = 0;

    if (param > 0) {
      nextPos = curPos === lastItem ? 0 : curPos + 1;
    } else if (param < 0) {
      nextPos = curPos === 0 ? lastItem : curPos - 1;
    }

    updateNavs(nextPos);
    updateContent(curPos, nextPos, lastItem);
  }

  function updateNavs(nextPos) {
    $(".side-nav, .outer-nav").children().removeClass("is-active");
    $(".side-nav").children().eq(nextPos).addClass("is-active");
    $(".outer-nav").children().eq(nextPos).addClass("is-active");
  }

  function updateContent(curPos, nextPos, lastItem) {
    $(".main-content").children().removeClass("section--is-active");
    $(".main-content").children().eq(nextPos).addClass("section--is-active");
    $(".main-content .section").children().removeClass(
      "section--next section--prev"
    );

    if (
      (curPos === lastItem && nextPos === 0) ||
      (curPos === 0 && nextPos === lastItem)
    ) {
      $(".main-content .section")
        .children()
        .removeClass("section--next section--prev");
    } else if (curPos < nextPos) {
      $(".main-content").children().eq(curPos).children().addClass("section--next");
    } else {
      $(".main-content").children().eq(curPos).children().addClass("section--prev");
    }

    if (nextPos !== 0 && nextPos !== lastItem) {
      $(".header--cta").addClass("is-active");
    } else {
      $(".header--cta").removeClass("is-active");
    }
  }

  // Initialize UI components
  outerNav();
  workSlider();
  transitionLabels();

  function outerNav() {
    $(".header--nav-toggle").click(function () {
      $(".perspective").addClass("perspective--modalview");
      setTimeout(() => {
        $(".perspective").addClass("effect-rotate-left--animate");
      }, 25);
      $(".outer-nav, .outer-nav li, .outer-nav--return").addClass("is-vis");
    });

    $(".outer-nav--return, .outer-nav li").click(function () {
      $(".perspective").removeClass("effect-rotate-left--animate");
      setTimeout(() => {
        $(".perspective").removeClass("perspective--modalview");
      }, 400);
      $(".outer-nav, .outer-nav li, .outer-nav--return").removeClass("is-vis");
    });
  }

  function workSlider() {
    const $items = $(".slider").children();
    const totalWorks = $items.length;
  
    $(".slider--prev, .slider--next").click(function () {
      const direction = $(this).hasClass("slider--next") ? "next" : "prev";
      shiftSlider(direction);
    });
  
    // Swipe functionality for mobile devices
    const targetElement = document.querySelector(".slider");
    const mc = new Hammer(targetElement);
  
    mc.get("swipe").set({ direction: Hammer.DIRECTION_HORIZONTAL });
  
    mc.on("swipeleft swiperight", function (e) {
      const direction = e.type === "swipeleft" ? "next" : "prev";
      shiftSlider(direction);
    });
  
    function shiftSlider(direction) {
      $(".slider").animate({ opacity: 0 }, 400);
  
      setTimeout(() => {
        $items.each(function (index, element) {
          const $item = $(element);
          $item
            .removeClass("slider--item-left slider--item-center slider--item-right");
  
          const newIndex =
            direction === "next"
              ? (index + 1) % totalWorks
              : (index - 1 + totalWorks) % totalWorks;
  
          assignSliderClass($item, newIndex, index, totalWorks);
        });
      }, 400);
  
      $(".slider").animate({ opacity: 1 }, 400);
    }
  
    function assignSliderClass(item, newIndex, index, totalWorks) {
      if (newIndex === 0) item.addClass("slider--item-left");
      else if (newIndex === totalWorks - 1) item.addClass("slider--item-right");
      else item.addClass("slider--item-center");
    }
  }
  
    function shiftSlider(direction, items, totalWorks) {
      items.each(function (index, element) {
        const $item = $(element);
        $item
          .removeClass("slider--item-left slider--item-center slider--item-right");

        if (direction === "next") {
          const newIndex = (index + 1) % totalWorks;
          assignSliderClass($item, index, newIndex, totalWorks);
        } else {
          const newIndex = (index - 1 + totalWorks) % totalWorks;
          assignSliderClass($item, index, newIndex, totalWorks);
        }
      });
    }

    function assignSliderClass(item, index, newIndex, totalWorks) {
      if (newIndex === 0) item.addClass("slider--item-left");
      else if (newIndex === totalWorks - 1) item.addClass("slider--item-right");
      else item.addClass("slider--item-center");
    }
  }

  function transitionLabels() {
    $(".work-request--information input").focusout(function () {
      $(this).toggleClass("has-value", !!$(this).val());
      window.scrollTo(0, 0); // correct mobile window position
    });
  }
});
