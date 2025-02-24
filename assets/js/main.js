// ==============TEST
const data = [
  {
    srcImg: "./assets/images/slider-1.jpg",
    alt: "Slide 1",
  },
  {
    srcImg: "./assets/images/slider-2.jpg",
    alt: "Slide 2",
  },
  {
    srcImg: "./assets/images/slider-3.jpg",
    alt: "Slide 3",
  },
  {
    srcImg: "./assets/images/slider-4.jpg",
    alt: "Slide 4",
  },
  {
    srcImg: "./assets/images/slider-5.jpg",
    alt: "Slide 5",
  },
];

// ==============TEST
const data2 = [
  {
    srcImg: "./assets/images/slider-1.jpg",
    alt: "Slide 1",
    content: `<div class="box-slide">
    <h3 class="title-slide">Tiêu đề Slide</h3>
    <p class="desc-slide">Nội dung chi tiết của Slide 1</p>
    <a href = #! class="link-slide">Link nếu có</a>
    </div>`,
  },
  {
    type: "background",
    bgColor: "linear-gradient(45deg, #ff9a9e,rgb(249, 227, 222))",
    // srcImg: "./assets/images/slider-2.jpg",
    // alt: "Slide 2",
    content: "Nội dung của slider 2",
  },
  {
    srcImg: "./assets/images/slider-3.jpg",
    alt: "Slide 3",
    content: "Nội dung của slider 3",
  },
  {
    srcImg: "./assets/images/slider-4.jpg",
    alt: "Slide 4",
    content: "Nội dung của slider 4",
  },
  {
    srcImg: "./assets/images/slider-5.jpg",
    alt: "Slide 5",
    content: "Nội dung của slider 5",
  },
  {
    srcImg: "./assets/images/slider-6.jpg",
    alt: "Slide 5",
    content: "Nội dung của slider 6",
  },
];
document.addEventListener("DOMContentLoaded", function () {
  const element = document.querySelector("#my-sli2");

  const mySlider2 = new Lopza(element, data2, {
    pagination: "number",
    navigation: true,
    autoplay: true,
    autoplaySpeed: 2000,
    draggable: true,
    // loop: false,
    onSlideChange: (prev, next) => {
      console.log(`Chuyển từ slide ${prev} sang slide ${next}`);
    },
  });

  // mySlider2._init(element);
  mySlider2.init();

  // #2
  const customNav = document.createElement("div");
  customNav.innerHTML = `
    <button data-prev id="prevBtn">Prev</button>
    <button data-next id="nextBtn">Next</button>
  `;

  const slider = new Lopza("#my-sli3", data, {
    pagination: "dot",
    // navigation: true,
    direction: "vertical",
    customNavigation: customNav,
    autoplay: true,
    autoplaySpeed: 2000,
    // loop: false,
  });

  slider.init();
});
