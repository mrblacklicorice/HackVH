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
    var li = document.createElement('li'); // One eleemnt from ul 
    var li_a = document.createElement('a'); //  ???

    a.setAttribute("href", "#");
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

    li_a.setAttribute("class", "button");
    li_a.innerText = "View";
    if (!isSource) {
        li_a.onclick = (() => topic_loader(data_.objects, topics_name_, topics_list_, data_.topic));
    } else {
        li_a.href = data_.link;

    }
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
    topics_list.innerHTML = "";
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
            list.push(...data_[i].objects[j]);
        }
    }
    // End result - A list of sources
    return list;
}

//List will be passed in from sourceParser
function tagParser(list_) {
    var tags = [];
    var formatted_tag = [];

    for (let i = 0; i < list_.length; i++) {
        tags.push(...list_[i].tags);
    }

    for (let i = 0; i < tags.length; i++) {
        formatted_tag.push(...tags[i].split(" "));
    }

    var uni_tag = [... new Set(formatted_tag)];
    //end result - An array of split, no duplicate tags
    return uni_tag;
}

function tagMatch(search_) {
    var sources = sourceParser(data) // Array of sources
    var values = (new Array(sources.length)).fill(0); // Empty result array
    search_.toLowerCase().split(" ");
    search_.sort();
    for (let i = 0; i < sources.length; i++) { // Outer loop pulls each source one by one 
        var uni_tag_ = sources[i].tags;  // Access tags 
        uni_tag_.sort();
        for (let j = 0; j < search_.length; j++) { // Inner loop searches for matches 
            if (uni_tag_.indexOf(search_[j]) > -1) {
                values[i] += 1;
            }
        }
    }
    return values;
}
//TODO: Function that takes in HTML search input



// TODO: Function that takes in the array of values, sorts it, creates the html objects in the order of most matches to least - Up to a threshhold
function generateResult(values_) {
    var sorted = values_.sort(function (a, b) {
        return a - b  // Sorts the array
    });

    for (let i = 0; i < sorted.length; i++) {
        if (sorted[i] > 2) {
            // Genereate HTML object - Call topic_loader
        }
    }

}

// function userSubmission()