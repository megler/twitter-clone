document.addEventListener("DOMContentLoaded", function () {
  // BEGIN TRANSITION TOGGLE
  // Credit for CSS/JS Animation Toggle: https://jsfiddle.net/gebpjo1L/18/

  let container = document.querySelector(".toggleBox");
  let button = document.querySelector(".toggle");

  button.addEventListener("click", () => {
    /** Slide down. */
    if (!container.classList.contains("active")) {
      /** Show the container. */
      container.classList.add("active");
      container.style.height = "auto";

      /** Get the computed height of the container. */
      let height = container.clientHeight + "px";

      /** Set the height of the content as 0px, */
      /** so we can trigger the slide down animation. */
      container.style.height = "0px";

      /** Do this after the 0px has applied. */
      /** It's like a delay or something. MAGIC! */
      setTimeout(() => {
        container.style.height = height;
      }, 0);
      button.innerHTML = "Close Tweet Box";
      /** Slide up. */
    } else {
      /** Set the height as 0px to trigger the slide up animation. */
      container.style.height = "0px";
      /** Remove the `active` class when the animation ends. */
      container.addEventListener("transitionend", () => {
        container.classList.remove("active");
      }, {once: true});
      button.innerHTML = "Write Tweet";
    }
  });

  // END ANIMATION TOGGLE

  // BEGIN FOLLOW/UNFOLLOW TOGGLE
  const followBtn = document.querySelector(".follow-toggle");

  followBtn.addEventListener("click", () => {
    if (followBtn.innerHTML === "Follow") {
      console.log(followBtn.innerHTML);
      followBtn.innerHTML = "Unfollow";
    } else {
      followBtn.innerHTML = "Follow";
    }
  });

  // END FOLLOW/UNFOLLOW TOGGLE
});
