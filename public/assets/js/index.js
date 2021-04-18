var data;
var ratings_database;
var subjects_list = [];

var app;
var db;
var ratings;


// load when webpage starts, firebase thing
document.addEventListener("DOMContentLoaded", event => {
    app = firebase.app();
    console.log(app);
    db = firebase.firestore();
    ratings = db.collection('ratings').doc('source-ratings');
    ratings.get()
           .then(doc => {
               var parsed_data = doc.data();
               ratings_database = parsed_data.sourcearray;
                console.log(ratings_database);
                start();
           //     ratings.update( { sourcearray: values })
    })
});

// fethces the data after database loads in and start the whole webpage
function start() {
     fetch("https://raw.githubusercontent.com/mrblacklicorice/HackVH/main/public/src/data.json")
     .then(response => response.json())
     .then(res_data => {
         data = res_data;
         console.log(res_data);
         data.forEach(subject => {
             subjects_list.push(subject.topic);
         });
         readRating(ratings_database);
         topic_loader(data, topics_name, topics_list, "Subjects");
     });  
}



//Takes in the ID of the object that is being upvoted
function updateRating(upvote) {
    const db = firebase.firestore();
    const ratings = db.collection('ratings').doc('source-ratings');
    ratings.get()
        .then(doc => {
            var parsed_data = doc.data();
            var array = parsed_data.sourcearray;
            array[upvote] +=1;
            console.log(array);
            ratings.update({ sourcearray: array });
            ratings_database = array;
            readRating(ratings_database);
        })
    
}

// syncs the database rating values to runtime object "data"
function readRating(ratings_database_) {
    var sources = sourceParser(data);
   for (let i = 0; i < ratings_database_.length; i++) {
       sources[i].rating = ratings_database_[i];
    }

    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].objects.length; j++) {
            for (let k = 0; k < data[i].objects[j].objects.length; k++) {
                data[i].objects[j].objects[k].rating = sources[data[i].objects[j].objects[k].id].rating;
                console.log(data[i].objects[j].objects[k].rating);
            }
        }
    }
}



// -----------------------------------------------------------------------------------------------------------------

// logins in using google
function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
    .then(result => {
        const user = result.user;
        console.log(user);
    })
}
// ------------------------------------------------------------------------------------------------------------------
  
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

// creates individual tabs that showcase the data
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

    li_commend.setAttribute("id", "co"+String(data_.id));
    li_commend.setAttribute("class", "button");
    li_commend.innerText = "Commend " + data_.rating;
    li_commend.onclick = (() => {
        updateRating(data_.id);
        var ele = document.getElementById("co" + String(data_.id));
        ele.innerText = "Commend " + data_.rating;
    });


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

// calls in a bunch of create topics and uses the data that is in arrays

function topic_loader(data_, topics_name_, topics_list_, input_topic_name_) {
    topics_list.innerHTML = "";
    path.push(input_topic_name_);
    topics_name_.innerText = input_topic_name_;
    for (let i = 0; i < data_.length; i++) {
        create_topic(data_[i], topics_name_, topics_list_);
    }
}

// ----------------------------------------------------------------------------------------------------------------------
// takes in data struct and gives out array of sources
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

// gives how many times the tags were triggered
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

// function that manipulates the path array to navigate in the webpages
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



