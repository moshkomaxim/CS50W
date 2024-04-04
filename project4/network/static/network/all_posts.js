document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#create_post').addEventListener('click', () => show_create(), {once: true});
  document.querySelector('#compose_form').addEventListener('submit', () => send_post());
  document.querySelector('#compose_view').style.display = "none";

  // By default, load the inbox
  show_posts();
});

function show_create() {
  document.querySelector("#compose_view").style.display = "block";
  document.querySelector('#create_post').addEventListener('click', () => hide_create(), {once: true});
  return false;
}


function hide_create() {
  document.querySelector("#compose_view").style.display = "none";
  document.querySelector('#create_post').addEventListener('click', () => show_create(), {once: true});
  return false;
}