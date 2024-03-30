document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#all_posts').addEventListener('click', () => show_posts());

  // By default, load the inbox
  show_posts();
});

let post_counter = 0;
let comment_counter = 0;
const load_posts = 10;
const load_comments = 10;

window.onscroll = () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      show_posts();
  }
};


function show_posts() {
  main_view = document.querySelector('#main_view');
  // Show the mailbox and hide other views
  main_view.style.display = 'block';
  // Show the mailbox name 
  // Empty from old lists


  fetch(`http://127.0.0.1:8000/get_posts?start=${post_counter}&load=${load_posts}`)

  .then(response => response.json())
  .then(data => {
    if (data.length == ""){
      alert(1);
      console.log(data);
    }
    else {
      for (let i = 0; i < data.posts.length; i++) {
        main_view.append(add_post(data.posts[i], post_counter));
        post_counter++;
      }
    }
  })  
  
  .catch(error => {
    console.log("Error: ", error);
})
return false;
}


function add_post(post, post_num) {
  div = document.createElement('div');
  div.classList.add("post");
  div.id = post_num;

  title = document.createElement('h6');
  title.innerHTML = post.title;

  text = document.createElement('p');
  text.innerHTML = post.text;

  time = document.createElement('p');
  time.innerHTML = post.timestamp.full;

  like_svg = `<svg class="like_image" width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  `;

  like_body = document.createElement("div");
  like_body.classList.add("like_body");
  like_body.innerHTML = like_svg;
  like_body.addEventListener('click', change_like.bind(this, div.id), false);

  if (post.user_liked) {
    tmp = like_body.querySelector("svg");
    tmp.style.fill = "#e74c3c";
    tmp.classList.add("active");
  }

    like_counter = document.createElement('p');
    like_counter.classList.add("like_counter");
    like_counter.dataset.id = post.id;
    like_counter.innerHTML = post.likes.length;

    like_counter_div = document.createElement("div");
    like_counter_div.append(like_counter);

    like = document.createElement("div");
    like.append(like_body, like_counter_div);
    
    comments_body = document.createElement("div");
    comments_body.classList.add("comments_body");
    comments_body.dataset.amount = 0;

    comments_counter = document.createElement('p');
    comments_counter.innerHTML = `Comments (${post.comments.length})`;
    comments_counter.addEventListener('click', show_comments.bind(this, post.id, div.id), false);

    comments_hide = document.createElement("p");
    comments_hide.classList.add("comments_hide");
    comments_hide.innerHTML = "Hide";
    comments_hide.style.display = "none";
    comments_hide.addEventListener('click', hide_comments.bind(this, div.id), false);

    comments = document.createElement("div");
    comments.append(comments_counter, comments_body, comments_hide);

    div.append(title, text, time, like, comments);

    return div;
}


function change_like(div_id) {
  like_body = document.getElementById(`${div_id}`).querySelector('svg');
  like_counter = document.getElementById(`${div_id}`).querySelector('.like_counter');
  let change;

  if (like_body.classList.contains("active")) {
    like_body.style.fill = "white";
    like_body.classList.remove("active");
    new_value = parseInt(like_counter.innerHTML) - 1;
    change = "dislike";
  }
  else {
    like_body.style.fill = "#e74c3c";
    like_body.classList.add("active");
    new_value = parseInt(like_counter.innerHTML) + 1;
    change = "like";
  }

  fetch('/like_post', {
    method: 'POST',
    body: JSON.stringify({
      id: like_counter.dataset.id,
      change: change,
    })
  })
  .then(response => {
    like_counter.innerHTML = new_value;
  })
  .catch(error => {
    console.log("Error: ", error);
  })
  return false;
}


function add_comment(data) {
  div = document.createElement("div");

  user = document.createElement("h5");
  user.innerHTML = data["user"];

  text = document.createElement("p");
  text.innerHTML = data["text"];

  time = document.createElement("p");
  time.innerHTML = data["timestamp"]["full"];

  div.append(user, text, time);

  return div;
}


function show_comments(post_id, div_id) {
  comments_body = document.getElementById(`${div_id}`).querySelector('.comments_body');
  amount = comments_body.dataset.amount;

  fetch(`http://127.0.0.1:8000/get_comments?start=${amount}&load=${load_comments}&post_id=${post_id}`)

  .then(response => response.json())
  .then(data => {
    if (data.comments.length == ""){
      ;
    }
    else {
      for (let i = 0; i < data.comments.length; i++) {
        comment = add_comment(data.comments[i]);
        comments_body.append(comment);
        comment_counter++;
      }
      comments_hide = document.getElementById(`${div_id}`).querySelector('.comments_hide');
      comments_hide.style.display = "block";
    }
  })  
  
  .catch(error => {
    console.log("Error: ", error);
})
return false;
}

function hide_comments(div_id) {
  comments_body = document.getElementById(`${div_id}`).querySelector('.comments_body');
  comments_hide = document.getElementById(`${div_id}`).querySelector('.comments_hide');

  comments_body.innerHTML = "";
  comments_hide.style.display = "none";
}