
var data;
var subjects_list = [];
document.addEventListener("DOMContentLoaded", event => {
    const { firebase } = require("googleapis/build/src/apis/firebase");
    const app = firebase.app();
    console.log(app);
});

function googleLogin() {
    const provider = firebase.initializeApp();
    firebase.auth().signInWithPopup(provider)
    .then(result => { 
        const user = result.user;
        console.log(user);
        
    })
    .catch(console.log);
}

// = require("C:/Users/giris/Repos/HackVH/assets/src/data.json");
fetch("https://raw.githubusercontent.com/mrblacklicorice/HackVH/main/assets/src/data.json")
    .then(response => response.json())
    .then(res_data => {
        data = res_data;
        console.log(res_data);
        data.forEach(subject => {
            subjects_list.push(subject.topic);
        });
        topic_loader(data, topics_name, topics_list, "Subjects");
    });

// topic_loader(data, topics_name, topics_list, "Subjects");

var path = [];

var topics_name = document.getElementById("topic_name");
var topics_list = document.getElementsByClassName("posts")[0];
var search_bar = document.getElementById("query");
var back_button = document.getElementById("back button");
var search_button = document.getElementById("search button");

search_button.onclick = (() => {
    generateResult(tagMatch(search_bar.value));
    search_bar.value = "";
})

back_button.onclick = (() => { go_back(path) });

search_bar.addEventListener("keypress", function (event) {
    if (event.key == "Enter" || event.code == 13) {
        generateResult(tagMatch(search_bar.value));
        search_bar.value = "";
    }
});

function create_topic(data_, topics_name_, topics_list_) {
    var isSource = false;
    if (data_.hasOwnProperty("id")) {
        isSource = true;
    }
    var article = document.createElement('article'); // HTML element
    var a = document.createElement('a'); // 
    var img = document.createElement('img'); // Image
    var h3 = document.createElement('h3'); // Name - Topic, Subtopic, Source
    var p = document.createElement('p'); //  Description
    var ul = document.createElement('ul'); // List object - Button(s)
    var li = document.createElement('li'); // One elemnt from ul 
    var li_view = document.createElement('a'); //  ???
    var li_save = document.createElement('a');
    var li_commend = document.createElement('a');

    a.setAttribute("class", "image");

    img.setAttribute("src", data_.media);
    img.setAttribute("alt", "");

    if (!isSource) {
        h3.innerText = data_.topic; // Title of source
    } else {
        h3.innerText = data_.title;
    }

    p.innerText = data_.description; // Description of Source

    ul.setAttribute("class", "actions");

    // view button
    li_view.setAttribute("class", "button");
    li_view.innerText = "View";
    if (!isSource) {
        li_view.onclick = (() => topic_loader(data_.objects, topics_name_, topics_list_, data_.topic));
    } else {
        li_view.href = data_.link;
        li_view.target = "_blank";
    }

    // view button
    li_save.setAttribute("class", "button");
    li_save.innerText = "Save";
    if (!isSource) {
        li_save.onclick = (() => topic_loader(data_.objects, topics_name_, topics_list_, data_.topic));
    } else {
        li_save.href = data_.link;
    }


    var index = data_.index;
    li_commend.setAttribute("class", "button");
    li_commend.innerText = "Commend";
    if (isSource) {

        li_commend.onclick = (() => updateStorage(index));
    }


    a.appendChild(img);

    ul.appendChild(li_view);
    ul.appendChild(document.createElement('br'));

    if (isSource) {
        ul.appendChild(li_save);
        ul.appendChild(li_commend);
    }
    article.appendChild(a);
    article.appendChild(h3);
    article.appendChild(p);
    article.appendChild(ul);

    topics_list_.appendChild(article);
}

function topic_loader(data_, topics_name_, topics_list_, input_topic_name_) {
    topics_list.innerHTML = "";
    path.push(input_topic_name_);
    topics_name_.innerText = input_topic_name_;
    for (let i = 0; i < data_.length; i++) {
        create_topic(data_[i], topics_name_, topics_list_);
    }
}

function sourceParser(data_) {
    var list = [];
    //Access Subjects
    for (let i = 0; i < data_.length; i++) {
        //Access Sub-Subjects... objects = sub topics
        for (let j = 0; j < data_[i].objects.length; j++) {
            list.push(...data_[i].objects[j].objects);
        }
    }
    // End result - A list of sources
    return list;
}

//List will be passed in from sourceParser
function tagParser(list_, index) {
    var tags = [];
    var formatted_tag = [];

    tags.push(...list_[index].tags);

    for (let i = 0; i < tags.length; i++) {
        formatted_tag.push(...tags[i].split(" "));
    }

    //  var uni_tag = [... new Set(formatted_tag)];
    //end result - An array of split, no duplicate tags
    //  return uni_tag;
    return formatted_tag;
}

function tagMatch(search_) {
    var sources = sourceParser(data); // Array of sources
    var values = (new Array(sources.length)).fill(0); // Empty result array
    search_ = ((search_.toLowerCase()).trim()).split(" ");
    search_.sort();
    for (let i = 0; i < sources.length; i++) { // Outer loop pulls each source one by one 
        var uni_tag_ = tagParser(sources, i).sort();// Access tags
        for (let j = 0; j < search_.length; j++) { // Inner loop searches for matches 
            if (uni_tag_.indexOf(search_[j]) > -1) {
                values[i] += 1;
            }
        }
    }
    console.log(values);
    var hash = {};
    for (let i = 0; i < values.length; i++) {
        if (!hash.hasOwnProperty(values[i])) {
            hash[values[i]] = [];
        }
        hash[values[i]].push(i);
    }
    var total_list = [];
    for (let i = 10; i > 0; i--) {
        if (hash.hasOwnProperty(i)) {
            total_list.push(...hash[i]);
        }
    }
    return total_list;
}

// TODO: Function that takes in the array of values, sorts it, creates the html objects in the order of most matches to least - Up to a threshhold
function generateResult(loi) {
    var sourceList = [];
    var sources = sourceParser(data);
    for (let i = 0; i < (loi.length / 3); i++) {
        sourceList.push(sources[loi[i]]);
    }
    topic_loader(sourceList, topics_name, topics_list, "Results");
}

function go_back(path_) {
    if (path_.length == 1) return;
    path_.pop();
    var name = path_.pop();
    if (name == "Subjects") {
        topic_loader(data, topics_name, topics_list, name);
    } else if (subjects_list.includes(name)) {
        topic_loader(data[subjects_list.indexOf(name)].objects, topics_name, topics_list, name);
    }
}



