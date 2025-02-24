function Lopza(s, data = [], o = {}) {
  const dO = {
    pagination: "dot",
    navigation: true,
    customNavigation: null,
    direction: "horizontal",
    autoplay: false,
    autoplaySpeed: null,
    pauseOnHover: true,
    draggable: true,
    loop: true,
    onSlideChange: () => {},
  };
  this.opt = Object.assign({}, dO, o);
  this.data = data;
  if (!s) {
    console.error(`Lopza Error: The "selector" parameter is required`);
    return;
  }
  this._s = s;
}
Lopza.prototype._init = function (s) {
  if (!this._checkError(s)) return;
  this._sL.classList.add(this.clS);
  const sG = document.createElement("div");
  sG.classList.add(this.clS, "lz__gallery");
  this.sVs = document.createElement("div");
  this.sVs.classList.add(this.clS, "lz__views");
  sG.append(this.sVs);
  this._sL.append(sG);
  this._setDirection();
  this._createSlides();
  if (this.opt.autoplay) this._startAutoplay();
  if (this.opt.customNavigation) {
    this._customNavigation();
  } else if (this.opt.navigation) {
    this._createNavigation();
  }
  if (this.opt.pagination) {
    this._createPagination();
  }
};
Lopza.prototype._createSlides = function () {
  if (!this.data.length) return;
  this.cI = 1;
  this.countS = this.data.length;
  this.loopS = this.opt.loop ? this.data.length + 2 : this.countS;
  this.data.forEach(
    ({ type = "image", bgColor, srcImg, alt = "slide-view", content }) => {
      const sView = document.createElement("div");
      sView.classList.add(this.clS, "lz__view");
      if (type === "image" && srcImg) {
        const sIg = document.createElement("img");
        sIg.classList.add(this.clS, "lz__view--img");
        sIg.src = srcImg;
        sIg.alt = alt;
        sView.append(sIg);
      } else if (type === "background" && bgColor) {
        sView.style.background = bgColor;
      }
      if (content) {
        const boxCS = document.createElement("div");
        boxCS.classList.add(this.clS, "lz__content");
        boxCS.innerHTML = content;
        sView.append(boxCS);
      }
      this.sVs.append(sView);
    }
  );
  if (this.opt.loop) {
    const firstS = this._createSlideElement(this.data[0], true);
    const lastS = this._createSlideElement(
      this.data[this.data.length - 1],
      true
    );
    this.sVs.insertBefore(lastS, this.sVs.firstChild);
    this.sVs.appendChild(firstS);
    this.countS = this.loopS;
    const axis = this.opt.direction === "vertical" ? "Y" : "X";
    this.sVs.style.transition = "none";
    this.sVs.style.transform = `translate${axis}(-100%)`;
  }
};
Lopza.prototype._createSlideElement = function (sData) {
  const {
    type = "image",
    bgColor,
    srcImg,
    alt = "slide-view",
    content,
  } = sData;

  const sl = document.createElement("div");
  sl.classList.add(this.clS, "lz__view");

  if (type === "image" && srcImg) {
    const sIg = document.createElement("img");
    sIg.classList.add(this.clS, "lz__view--img");
    sIg.src = srcImg;
    sIg.alt = alt;
    sl.append(sIg);
  } else if (type === "background" && bgColor) {
    sl.style.background = bgColor;
  }
  if (content) {
    const boxCS = document.createElement("div");
    boxCS.classList.add(this.clS, "lz__content");
    boxCS.innerHTML = content;
    sl.append(boxCS);
  }
  return sl;
};
Lopza.prototype._setDirection = function () {
  const isVertical = this.opt.direction === "vertical";
  this.sVs.style.height = isVertical ? "100%" : "";
  this.sVs.style.flexDirection = isVertical ? "column" : "row";
};
Lopza.prototype._startAutoplay = function () {
  if (this._auI) return;
  const t = Number(this.opt.autoplaySpeed) || 3000;
  this._auI = setInterval(() => {
    this.changeSlide(this.getCurrentSlideIndex() + 1);
  }, t);
  if (this.opt.pauseOnHover) {
    this._sL.onmouseenter = () => {
      this.stopAutoplay();
    };
    this._sL.onmouseleave = () => {
      this._auI = setInterval(() => {
        this.changeSlide(this.getCurrentSlideIndex() + 1);
      }, t);
    };
  }
};
Lopza.prototype.stopAutoplay = function () {
  clearInterval(this._auI);
};
Lopza.prototype._checkError = function (s) {
  if (typeof s === "string") {
    this._sL = document.querySelector(s);
    this.clS = s.slice(1);
  } else if (s instanceof HTMLElement) {
    this._sL = s;
    this.clS = s.id;
  }
  if (!this._sL) {
    console.error(
      `Lopza Error: Need to create a div tag in the DOM with "${s}."`
    );
    return;
  }
  if (this.data.length === 0) {
    console.error("Lopza Error: Slide data array is empty.");
    return;
  }
  return true;
};
Lopza.prototype._createPagination = function () {
  const sDots = document.createElement("div");
  sDots.classList.add(this.clS, "lz__dots");
  if (!["dot", "number"].includes(this.opt.pagination)) {
    console.warn('Invalid pagination type! Defaulting to "dot".');
    this.opt.pagination = "dot";
  }
  const dotClass = this.opt.pagination === "number" ? "lz__number" : "lz__dot";
  this.data.forEach((_, index) => {
    const sliderDot = document.createElement("button");
    sliderDot.classList.add(this.clS, dotClass);
    if (this.opt.pagination === "number") sliderDot.innerHTML = index + 1;
    if (index === 0) sliderDot.classList.add("active");
    sDots.append(sliderDot);
  });
  sDots.addEventListener("click", (e) => {
    const dotItem = e.target;
    if (
      dotItem.classList.contains("lz__dot") ||
      dotItem.classList.contains("lz__number")
    ) {
      const index = [...sDots.children].indexOf(dotItem);
      if (this.opt.loop) {
        this.changeSlide(index + 1);
      } else {
        this.changeSlide(index);
      }
    }
  });
  this._sL.append(sDots);
};
Lopza.prototype._createNavigation = function () {
  const sCtr = document.createElement("div");
  sCtr.classList.add(this.clS, "lz__ctrl");
  const buttons = [
    { btnClass: "lz__btn-prev", html: "&larr;", change: -1 },
    { btnClass: "lz__btn-next", html: "&rarr;", change: 1 },
  ];
  buttons.forEach(({ btnClass, html, change }) => {
    const btn = document.createElement("button");
    btn.classList.add(this.clS, "lz__btn", btnClass);
    btn.innerHTML = html;
    btn.onclick = () => this.changeSlide(this.getCurrentSlideIndex() + change);
    sCtr.appendChild(btn);
  });
  this._sL.appendChild(sCtr);
};
Lopza.prototype._customNavigation = function () {
  this._sL.append(this.opt.customNavigation);
  this.opt.customNavigation
    .querySelectorAll("[data-prev], [data-next]")
    .forEach((btn) => {
      btn.onclick = () => {
        const crI = this.getCurrentSlideIndex();
        this.changeSlide(btn.dataset.prev !== undefined ? crI - 1 : crI + 1);
      };
    });
};
Lopza.prototype.changeSlide = function (index) {
  if (this.isAnimating) return;
  this.isAnimating = true;
  const prevI = this.cI;
  let rPI = prevI !== null ? prevI : 0;
  this.sVs.style.transition = "transform 0.5s ease";
  this.cI = index;
  const isVertical = this.opt.direction === "vertical";
  if (this.opt.loop) {
    const translateValue = isVertical
      ? `translateY(${-(this.cI * 100)}%)`
      : `translateX(${-(this.cI * 100)}%)`;
    this.sVs.style.transform = translateValue;
    setTimeout(() => {
      if (this.cI === this.loopS - 1) {
        this.sVs.style.transition = "none";
        this.cI = 1;
        this.sVs.style.transform = isVertical
          ? `translateY(-100%)`
          : `translateX(-100%)`;
      } else if (this.cI === 0) {
        this.sVs.style.transition = "none";
        this.cI = this.countS - 2;
        this.sVs.style.transform = isVertical
          ? `translateY(${-(this.countS - 2) * 100}%)`
          : `translateX(${-(this.countS - 2) * 100}%)`;
      }
      this.isAnimating = false;
    }, 500);
  } else {
    if (this.cI < 0) {
      this.cI = this.countS - 1;
    } else if (this.cI >= this.countS) {
      this.cI = 0;
    }
    const translateValue = isVertical
      ? `translateY(${-(this.cI * 100)}%)`
      : `translateX(${-(this.cI * 100)}%)`;
    this.sVs.style.transform = translateValue;
    this.isAnimating = false;
  }
  const dotList = this._sL.querySelector(`.${this._sL.classList[0]} .lz__dots`);
  if (!dotList) return;
  const arrayDot = [...dotList.children];
  let paI;
  if (this.opt.loop) {
    paI = this.cI - 1;
    if (paI < 0) paI = this.countS - 3;
    if (paI >= this.countS - 2) paI = 0;
  } else {
    paI = this.cI;
  }
  arrayDot.forEach((dot, i) => {
    dot.classList.toggle("active", i === paI);
  });
  setTimeout(() => {
    this.isAnimating = false;
  }, 500);
  if (typeof this.opt.onSlideChange === "function") {
    let rNI = this.cI;
    if (this.opt.loop) {
      if (rNI === this.countS - 1) {
        rNI = 1;
      } else if (rNI === 0) {
        rNI = this.countS - 2;
      }
      this.opt.onSlideChange(rPI, rNI);
    } else {
      this.opt.onSlideChange(rPI + 1, rNI + 1);
    }
  }
};
Lopza.prototype.getCurrentSlideIndex = function () {
  const views = this._sL.querySelector(".lz__views");
  const trV = views.style.transform;
  if (!views || !trV) return 0;
  const match =
    this.opt.direction === "vertical"
      ? trV.match(/translateY\(-(\d+)%\)/)
      : trV.match(/translateX\(-(\d+)%\)/);
  return match ? parseInt(match[1]) / 100 : 0;
};
Lopza.prototype._draggable = function () {
  let isDr = false;
  let startPos = 0;
  let mD = 0;
  if (!this._sL) return;
  this._onDragStart = (e) => {
    if (e.target.tagName === "BUTTON") return;
    e.preventDefault();
    isDr = true;
    mD = 0;
    if (this.opt.direction === "vertical") {
      startPos = e.clientY;
    } else {
      startPos = e.clientX;
    }
    this.stopAutoplay();
  };
  this._onDragMove = (e) => {
    if (!isDr) return;
    if (this.opt.direction === "vertical") {
      mD = e.clientY - startPos;
    } else {
      mD = e.clientX - startPos;
    }
  };
  this._onDragUp = () => {
    if (!isDr) return;
    isDr = false;
    if (mD < -10) {
      this.changeSlide(this.getCurrentSlideIndex() + 1);
    } else if (mD > 10) {
      this.changeSlide(this.getCurrentSlideIndex() - 1);
    }
    mD = 0;
    if (this.opt.autoplay) this._startAutoplay();
  };
  this._onDragLeave = () => {
    if (!isDr && this.opt.autoplay) {
      this._startAutoplay();
    }
  };
  this._onDragEnd = () => {
    if (isDr) {
      isDr = false;
      mD = 0;
      if (this.opt.autoplay) this._startAutoplay();
    }
  };
  this._sL.addEventListener("mousedown", this._onDragStart);
  this._sL.addEventListener("mousemove", this._onDragMove);
  this._sL.addEventListener("mouseup", this._onDragUp);
  this._sL.addEventListener("mouseleave", this._onDragLeave);
  document.addEventListener("mouseup", this._onDragEnd);
};
Lopza.prototype.init = function () {
  if (!this._s) {
    console.error(`Lopza Error: Selector không hợp lệ`);
    return;
  }
  this._init(this._s);
  if (this.opt.autoplay) {
    this._startAutoplay();
  }
  if (this.opt.draggable) {
    this._draggable();
  }
};
Lopza.prototype.destroy = function () {
  if (this._auI) {
    clearInterval(this._auI);
    this._auI = null;
  }
  if (this._sL) {
    this._sL.onmouseenter = null;
    this._sL.onmouseleave = null;
  }
  const sDots = this._sL.querySelector(".lz__dots");
  if (sDots) {
    sDots.remove();
  }
  const sCtr = this._sL.querySelector(".lz__ctrl");
  if (sCtr) {
    sCtr.remove();
  }
  const sViews = this._sL.querySelector(".lz__views");
  if (sViews) {
    sViews.innerHTML = "";
  }
  if (this.opt.draggable) {
    this._sL.removeEventListener("mousedown", this._onDragStart);
    this._sL.removeEventListener("mousemove", this._onDragMove);
    this._sL.removeEventListener("mouseup", this._onDragUp);
    this._sL.removeEventListener("mouseleave", this._onDragLeave);
    document.removeEventListener("mouseup", this._onDragEnd);
  }
  this._sL = null;
  this.sVs = null;
  this._s = null;
  this.data = [];
};
