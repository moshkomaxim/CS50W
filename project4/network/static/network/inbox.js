document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#all_posts').addEventListener('click', () => show_posts());
  document.querySelector('#compose-form').addEventListener('submit', () => send_post());

  // By default, load the inbox
  show_posts();
});

let post_counter = 0;
let comment_counter = 0;
let like_svg = `<svg class="like_image" width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  `;
const load_posts = 10;
const load_comments = 10;


window.onscroll = () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      show_posts();
  }
};

function show_posts() {
  document.querySelector('#main_view').style.display = "block";
  add_posts();
  return false;
}

function add_posts() {
  main_view = document.querySelector('#main_view');
  // Show the mailbox and hide other views
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
  body = document.createElement('div');
  body.classList.add("post");
  body.id = post_num
  body.innerHTML = `
    <a href="index">${post.user}</a> 
    <p class="post_edit">Edit</p>
    <p>${post.text}</p>
    <p>${post.timestamp.full}</p>
    <div class="like_body">${like_svg}</div>
    <p class="like_counter" data-id=${post.id}>${post.likes.length}</p>
    <p class="comments_counter">Comments (${post.comments.length})</p>
    <div class="comments_body" data-amount=0>
  `;

  if (post.user_liked) {
    tmp = body.querySelector("svg");
    tmp.style.fill = "#e74c3c";
    tmp.classList.add("active");
  }

  comments_hide = document.createElement("p");
  comments_hide.classList.add("comments_hide");
  comments_hide.innerHTML = "Hide";
  comments_hide.style.display = "none";
  comments_hide.addEventListener('click', hide_comments.bind(this, body.id), false);
  body.append(comments_hide);

  body.querySelector(".like_body").addEventListener('click', change_post_like.bind(this, body.id), false);
  body.querySelector(".comments_counter").addEventListener('click', show_comments.bind(this, post.id, body.id), false);

  return body;
}


function change_post_like(div_id) {
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


function change_comment_like(div_id) {
  like_body = document.getElementById(`${div_id}`).querySelector('svg');
  console.log(document.getElementById(`${div_id}`));
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

  fetch('/like_comment', {
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


function show_comments(post_id, div_id) {
  comments_body = document.getElementById(`${div_id}`).querySelector('.comments_body');
  comments_body.style.display = "block";

  console.log(comments_body.dataset.amount);
  console.log(comments_body.dataset.amount == 0);
  if (comments_body.dataset.amount == 0) {
    add_comments(post_id, div_id);
  }

  if (comments_body.dataset.amount > 0) {
    document.getElementById(`${div_id}`).querySelector('.comments_hide').style.display = "block";
  }
  return false;
}


function hide_comments(div_id) {
  document.getElementById(`${div_id}`).querySelector('.comments_body').style.display = "none";
  document.getElementById(`${div_id}`).querySelector('.comments_hide').style.display = "none";
  return false;
}


function add_comments(post_id, div_id) {
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
        comment = add_comment(data.comments[i], div_id, i);
        comments_body.append(comment);
        comment_counter++;
        document.getElementById(`${div_id}`).querySelector('.comments_body').dataset.amount++;
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


function add_comment(data, div_id, i) {
  div = document.createElement("div");
  div.classList.add("comment");
  div.id = `${div_id} ${i}`;

  user = document.createElement("h5");
  user.innerHTML = data["user"];

  text = document.createElement("p");
  text.innerHTML = data["text"];

  time = document.createElement("p");
  time.innerHTML = data["timestamp"]["full"];

  like_body = document.createElement("div");
  like_body.classList.add("like_body");
  like_body.innerHTML = like_svg;

  if (data.user_liked) {
    tmp = like_body.querySelector("svg");
    tmp.style.fill = "#e74c3c";
    tmp.classList.add("active");
  }
    like_counter = document.createElement('p');
    like_counter.classList.add("like_counter");
    like_counter.dataset.id = data.id;
    like_counter.innerHTML = data.likes.length;

    like_counter_div = document.createElement("div");
    like_counter_div.append(like_counter);

    like = document.createElement("div");
    like.append(like_body, like_counter_div);
    like.addEventListener('click', change_comment_like.bind(this, div.id), false);

  div.append(user, text, time, like);

  return div;
}


function send_post() {
  post_text = document.querySelector('#post_text').value;

  if (post_text == "") {
    alert("You should type in post text!");
    return false;
  }

  fetch('/leave_post', {
    method: 'POST',
    body: JSON.stringify({
      body: post_text
    })
  })

  .then(response => response.json())
  .then(result => {
      if (result["message"] != "Post submitted succesfully") {
        console.log(result);
      }

    });
    return false;
};
