
let post_counter = 0;
let comment_counter = 0;
let like_svg = `<svg class="like_image" width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  `;
const load_posts = 10;
const load_comments = 10;


window.onscroll = () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1 ) {
      setTimeout(show_posts, 1000);
  }
};

function show_posts() {
  document.querySelector('#main_view').style.display = "block";
  add_posts();
  return false;
}


function add_posts() {
  main_view = document.querySelector('#main_view');

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

        if (data.posts[i].user == document.getElementById("logged_username").innerHTML) {
          add_edit_button(post_counter);
        }
        else {
          add_follow_button(post_counter, data.posts[i].user_followed);
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


function add_post(post, post_counter) {
  body = document.createElement('div');
  body.classList.add("post");
  body.id = `post${post_counter}`;
  body.dataset.db_id = post.id;
  body.dataset.user = post.user;
  body.innerHTML = `
    <div class="post_title">
      <a class="post_user" href="http://127.0.0.1:8000/profile/${post.user}">${post.user}</a>
    </div>
    <p class="post_text">${post.text}</p>
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
  body.append(comments_hide);

  body.querySelector(".like_body").addEventListener('click', change_post_like.bind(this, body.id), false);
  body.querySelector(".comments_counter").addEventListener('click', show_comments.bind(this, body.id), {once: true});

  return body;
}


function add_follow_button(post_counter, user_followed) {
  post = document.getElementById(`post${post_counter}`);

  p = document.createElement("p");
  p.classList.add("post_follow");

  if (user_followed) {
    p.innerHTML = "Unfollow";
  }
  else {
    p.innerHTML = "Follow";
  }

  title = post.querySelector(".post_title");
  title.appendChild(p);
  body.querySelector(".post_follow").addEventListener('click', follow_user.bind(this, post.id), false);

  return false;
}


function add_edit_button(post_counter) {
  post = document.getElementById(`post${post_counter}`);

  p = document.createElement("p");
  p.classList.add("post_edit");
  p.innerHTML = "Edit";

  title = post.querySelector(".post_title")
  title.after(p);

  post.querySelector(".post_edit").addEventListener('click', show_post_edit.bind(this, post.id, post.dataset.db_id), false), {once: true};
  return false;
}


function change_post_like(div_id) {
  like_body = document.getElementById(`${div_id}`).querySelector('svg');
  like_counter = document.getElementById(`${div_id}`).querySelector('.like_counter');

  if (like_body.classList.contains("active")) {
    like_body.style.fill = "white";
    like_body.classList.remove("active");
    new_value = parseInt(like_counter.innerHTML) - 1;
  }
  else {
    like_body.style.fill = "#e74c3c";
    like_body.classList.add("active");
    new_value = parseInt(like_counter.innerHTML) + 1;
  }

  fetch('/like_post', {
    method: 'POST',
    body: JSON.stringify({
      id: like_counter.dataset.id,
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
  like_counter = document.getElementById(`${div_id}`).querySelector('.like_counter');

  if (like_body.classList.contains("active")) {
    like_body.style.fill = "white";
    like_body.classList.remove("active");
    new_value = parseInt(like_counter.innerHTML) - 1;
  }
  else {
    like_body.style.fill = "#e74c3c";
    like_body.classList.add("active");
    new_value = parseInt(like_counter.innerHTML) + 1;
  }

  fetch('/like_comment', {
    method: 'POST',
    body: JSON.stringify({
      id: like_counter.dataset.id,
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


function show_comments(post_id) {
  post = document.getElementById(`${post_id}`);
  comments_body = post.querySelector('.comments_body');
  comments_body.style.display = "block";
  comments_body.style.border = "1px solid rgb(125,125,201)";

  if (comments_body.dataset.amount == 0) {
    add_comments(post_id);
  }

  if (comments_body.dataset.amount > 0) {
    document.getElementById(`${post_id}`).querySelector('.comments_hide').style.display = "block";
  }

  post.querySelector(".comments_counter").addEventListener('click', hide_comments.bind(this, post_id), {once: true});
  post.querySelector(".comments_hide").addEventListener('click', hide_comments.bind(this, post_id), {once: true});


  return false;
}


function hide_comments(post_id) {
  post = document.getElementById(`${post_id}`);
  post.querySelector('.comments_body').style.display = "none";
  post.querySelector('.comments_hide').style.display = "none";
  post.querySelector(".comments_counter").addEventListener('click', show_comments.bind(this, post_id), {once: true});
  return false;
}


function add_comments(post_id) {
  post = document.getElementById(`${post_id}`);
  comments_body = post.querySelector('.comments_body');
  amount = comments_body.dataset.amount;

  fetch(`http://127.0.0.1:8000/get_comments?start=${amount}&load=${load_comments}&post_id=${post.dataset.db_id}`)

  .then(response => response.json())
  .then(data => {
    if (data.comments.length == ""){
      ;
    }
    else {
      for (let i = 0; i < data.comments.length; i++) {
        comment = add_comment(data.comments[i], post_id, i);
        if (i > 0) {
          comment.style.borderTop = "1px solid rgb(125,125,201)";
        }
        comments_body.append(comment);
        comment_counter++;
        comments_body.dataset.amount++;
      }
      comments_hide = post.querySelector('.comments_hide');
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

  div.innerHTML = 
    `
     <a href="http://127.0.0.1:8000/profile/${data.user}">${data.user}</a>
     <p>${data["text"]}</p>
     <p>${data["timestamp"]["full"]}</p>
     <div class="like_body">${like_svg}</div>
     <p class="like_counter" data-id=${data.id}>${data.likes.length}</p>
    `
    
  if (data.user_liked) {
    tmp = div.querySelector("svg");
    tmp.style.fill = "#e74c3c";
    tmp.classList.add("active");
  }
    div.querySelector(".like_body").addEventListener('click', change_comment_like.bind(this, div.id), false);
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


function edit_post(post_id) {
  post = document.getElementById(`${post_id}`);
  new_text = post.querySelector("textarea").value;

  if (new_text == "") {
    alert("You should type in post text!");
    return false;
  }

  fetch('/edit_post', {
    method: 'POST',
    body: JSON.stringify({
      post_id: post.dataset.db_id,
      text: new_text,
    })
  })

  .then(response => response.json())
  .then(result => {
      if (result["message"] != "Post edited succesfully") {
        console.log(result);
      }

    });
    return false;
}


function show_post_edit(post_id) {
  post = document.getElementById(`${post_id}`);
  post_text = post.querySelector(".post_text");
  
  div = document.createElement("div");
  div.innerHTML = 
    `
      <form class="post_edit_form">
        <textarea class="form-contol post_text_editable">${post_text.innerHTML}</textarea>
        <input type="submit" value="Edit" class="btn btn-primary"/>
      </form>
    `
  div.querySelector('.post_edit_form').addEventListener('submit', () => edit_post(post_id, post.dataset.db_id));

  post_edit = post.querySelector(".post_edit");
  post_edit.innerHTML = "Close Edit";
  post_edit.addEventListener('click', hide_post_edit.bind(this, post_id, post_text.innerHTML)), {once:true};

  post_text.replaceWith(div);
}


function hide_post_edit(post_id, post_text) {
  post = document.getElementById(`${post_id}`);
  text = document.createElement("p");
  text.classList.add("post_text");
  text.innerHTML = post_text;
  
  post_edit = post.querySelector(".post_edit");
  post_edit.innerHTML = "Edit";
  post_edit.addEventListener('click', show_post_edit.bind(this, post.id, post.dataset.db_id), false);

  post.querySelector(".post_edit_form").replaceWith(text);
}


function follow_user(post_id) {
  post = document.getElementById(post_id);
  user = post.querySelector(".post_user").innerHTML;

  fetch('/follow_user', {
    method: 'POST',
    body: JSON.stringify({
      user: user,
    })
  })
  .then(response => {
    console.log("successfull followed")
  })
  .catch(error => {
    console.log("Error: ", error);
  })

  user_flag = null;
  posts = document.querySelectorAll(".post");

  for (i = 0; i < posts.length; i++) {
    console.log(posts[i]);
    console.log(posts[i].dataset.user);
    if (posts[i].dataset.user == user) {
      post_follow = posts[i].querySelector(".post_follow");
      if (user_flag == null) {
        user_flag = post_follow.innerHTML;
      }
      if (user_flag == "Follow") {
        post_follow.innerHTML = "Unfollow";
      }
      else {
        post_follow.innerHTML = "Follow";
      }
    }
  }
  return false;
}
