const mediaQueryList = window.matchMedia("(max-width: 550px)");

// Define a callback function for the event listener.
function handleOrientationChange(evt) {
  if (evt.matches) {
    initSliders();
    console.log("ok");
  }
}

handleOrientationChange(mediaQueryList);
mediaQueryList.addEventListener("change", handleOrientationChange);

function initSliders() {
  const slider = document.querySelectorAll(".slider");
  slider.forEach((sliderEl) => {
    const sliderList = sliderEl.querySelector(".slider__list"),
      sliderTrack = sliderEl.querySelector(".slider__track"),
      slides = sliderEl.querySelectorAll(".slider__slide"),
      arrows = sliderEl.querySelector(".slider__arrows"),
      prev = sliderEl.querySelector(".slider__arrow-prev"),
      next = sliderEl.querySelector(".slider__arrow-next"),
      slideWidth = slides[0].offsetWidth + 10;
    let slideIndex = 0,
      posInit = 0,
      posX1 = 0,
      posX2 = 0,
      posY1 = 0,
      posY2 = 0,
      posFinal = 0,
      isSwipe = false,
      isScroll = false,
      allowSwipe = true,
      transition = true,
      nextTrf = 0;
    let prevTrf = 0,
      lastTrf = --slides.length * slideWidth,
      posThreshold = slides[0].offsetWidth * 0.35;
    const trfRegExp = /([-0-9.]+(?=px))/,
      getEvent = function () {
        return event.type.search("touch") !== -1 ? event.touches[0] : event;
      },
      slide = function () {
        if (transition) {
          sliderTrack.style.transition = "transform .5s";
        }
        sliderTrack.style.transform = `translate3d(-${
          slideIndex * slideWidth
        }px, 0px, 0px)`;

        next.classList.toggle("slider__arrow_disabled", slideIndex === 0);
        prev.classList.toggle(
          "slider__arrow_disabled",
          slideIndex === --slides.length
        );
      },
      swipeStart = function () {
        let evt = getEvent();
        if (allowSwipe) {
          transition = true;

          nextTrf = (slideIndex + 1) * -slideWidth;
          prevTrf = (slideIndex - 1) * -slideWidth;

          posInit = posX1 = evt.clientX;
          posY1 = evt.clientY;

          sliderTrack.style.transition = "";

          sliderEl.addEventListener("touchmove", swipeAction);
          sliderEl.addEventListener("mousemove", swipeAction);
          sliderEl.addEventListener("touchend", swipeEnd);
          sliderEl.addEventListener("mouseup", swipeEnd);

          sliderList.classList.remove("slider__list_type_grab");
          sliderList.classList.add("slider__list_type_grabbing");
        }
      },
      swipeAction = function () {
        let evt = getEvent(),
          style = sliderTrack.style.transform,
          transform = +style.match(trfRegExp)[0];

        posX2 = posX1 - evt.clientX;
        posX1 = evt.clientX;

        posY2 = posY1 - evt.clientY;
        posY1 = evt.clientY;

        // определение действия свайп или скролл
        if (!isSwipe && !isScroll) {
          let posY = Math.abs(posY2);
          if (posY > 7 || posX2 === 0) {
            isScroll = true;
            allowSwipe = false;
          } else if (posY < 7) {
            isSwipe = true;
          }
        }

        if (isSwipe) {
          // запрет ухода влево на первом слайде
          if (slideIndex === 0) {
            if (posInit < posX1) {
              setTransform(transform, 0);
              return;
            } else {
              allowSwipe = true;
            }
          }

          // запрет ухода вправо на последнем слайде
          if (slideIndex === --slides.length) {
            if (posInit > posX1) {
              setTransform(transform, lastTrf);
              return;
            } else {
              allowSwipe = true;
            }
          }

          // запрет протаскивания дальше одного слайда
          if (
            (posInit > posX1 && transform < nextTrf) ||
            (posInit < posX1 && transform > prevTrf)
          ) {
            reachEdge();
            return;
          }

          // двигаем слайд
          sliderTrack.style.transform = `translate3d(${
            transform - posX2
          }px, 0px, 0px)`;
        }
      },
      swipeEnd = function () {
        posFinal = posInit - posX1;

        isScroll = false;
        isSwipe = false;

        sliderEl.removeEventListener("touchmove", swipeAction);
        sliderEl.removeEventListener("mousemove", swipeAction);
        sliderEl.removeEventListener("touchend", swipeEnd);
        sliderEl.removeEventListener("mouseup", swipeEnd);

        sliderList.classList.add("slider__list_type_grab");
        sliderList.classList.remove("slider__list_type_grabbing");

        if (allowSwipe) {
          if (Math.abs(posFinal) > posThreshold) {
            if (posInit < posX1) {
              slideIndex--;
            } else if (posInit > posX1) {
              slideIndex++;
            }
          }

          if (posInit !== posX1) {
            allowSwipe = false;
            slide();
          } else {
            allowSwipe = true;
          }
        } else {
          allowSwipe = true;
        }
      },
      setTransform = function (transform, comapreTransform) {
        if (transform >= comapreTransform) {
          if (transform > comapreTransform) {
            sliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
          }
        }
        allowSwipe = false;
      },
      reachEdge = function () {
        transition = false;
        swipeEnd();
        allowSwipe = true;
      };
    sliderTrack.style.transform = "translate3d(0px, 0px, 0px)";
    sliderList.classList.add("slider__list_type_grab");

    sliderTrack.addEventListener("transitionend", () => (allowSwipe = true));
    sliderEl.addEventListener("touchstart", swipeStart);
    sliderEl.addEventListener("mousedown", swipeStart);
    arrows.addEventListener("click", function () {
      let target = event.target;

      if (target.classList.contains("slider__arrow-next")) {
        slideIndex++;
      } else if (target.classList.contains("slider__arrow-prev")) {
        slideIndex--;
      } else {
        return;
      }
      slide();
    });
  });
}
