document.addEventListener('DOMContentLoaded', function() {
  add_posts();
});


function add_posts() {
  posts_view = document.querySelector('#posts');
  posts_view.innerHTML = "";
  username = document.querySelector('#profile').dataset.user;

  fetch(`http://127.0.0.1:8000/get_posts?page=${posts_view.dataset.page}&user=${username}`)

  .then(response => response.json())
  .then(data => {
    if (data.length == ""){
      alert(1);
      console.log(data);
    }
    else {
      posts_view.dataset.pages = parseInt(data.pages);

      for (let i = 0; i < data.posts.length; i++) {
        posts_view.append(add_post(data.posts[i], post_counter));

        if (data.posts[i].user == document.getElementById("logged_username").innerHTML) {
          add_edit_button(post_counter);
        }
        else {
          add_follow_button(post_counter, data.posts[i].user_followed);
        }
        post_counter++;
      }
      add_pages();
      document.getElementById(`page${posts_view.dataset.page}`).classList.add("active");

    }
  })  
  
  .catch(error => {
    console.log("Error: ", error);
})
return false;
}