document.addEventListener('DOMContentLoaded', function() {

  show_posts();
});

function add_posts() {
  main_view = document.querySelector('#main_view');


  fetch(`http://127.0.0.1:8000/get_followees_posts`, {
    method: 'POST'
  })

  .then(response => response.json())
  .then(data => {
    if (data.length == ""){
      alert(1);
      console.log(data);
    }
    else {
      for (let i = 0; i < data.posts.length; i++) {
        main_view.append(add_post(data.posts[i], post_counter));

        if (data.posts[i].user == document.getElementById("logged_username").innerHTML) {
          add_edit_button(post_counter);
        }
        post_counter++;
      }
    }
  })  
  
  .catch(error => {
    console.log("Error: ", error);
})
return false;
}

