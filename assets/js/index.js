var data;
fetch("https://raw.githubusercontent.com/mrblacklicorice/HackVH/main/assets/src/data.json")
    .then(response => response.json())
    .then(res_data => {
        data = res_data;
        console.log(res_data);
        topic_loader(data, topics_name, topics_list, "Subjects");
    });

var topics_name = document.getElementById("topic_name");
var topics_list = document.getElementsByClassName("posts")[0];

function create_topic(data_, topics_name_, topics_list_) {
    var article = document.createElement('article');
    var a = document.createElement('a');
    var img = document.createElement('img');
    var h3 = document.createElement('h3');
    var p = document.createElement('p');
    var ul = document.createElement('ul');
    var li = document.createElement('li');
    var li_a = document.createElement('a');

    a.setAttribute("href", "#");
    a.setAttribute("class", "image");

    img.setAttribute("src", "images/pic01.jpg");
    img.setAttribute("alt", "");

    h3.innerText = data_.topic;

    p.innerText = data_.description;

    ul.setAttribute("class", "actions");

    li_a.setAttribute("href", "#");
    li_a.setAttribute("class", "button");
    li_a.innerText = "View";
    li_a.onclick = (() => topic_loader(data_.objects, topics_name_, topics_list_, data_.topic));

    li.appendChild(li_a);

    a.appendChild(img);

    ul.appendChild(li);

    article.appendChild(a);
    article.appendChild(h3);
    article.appendChild(p);
    article.appendChild(ul);

    topics_list_.appendChild(article);
}

function topic_loader(data_, topics_name_, topics_list_, input_topic_name_) {
    topics_list.empty();
    topics_name_.innerText = input_topic_name_;
    for (let i = 0; i < data_.length; i++) {
        create_topic(data_[i], topics_name_, topics_list_);
    }
}
