// open and close dropdown

function openDown() {
    document.getElementById("controls").classList.toggle("show");
}

window.addEventListener("click", function(event) {
  if (!event.target.matches(".click")) 
  {
    var dropdowns = document.getElementsByClassName("dropdown");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
});
