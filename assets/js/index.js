var data;
fetch("./assets/src/data.json")
    .then(response => response.json())
    .then(res_data => {
        data = res_data;
        console.log(res_data);
    });

var topics_name = document.getElementById("topic_name");
var topics_list = document.getElementsByClassName("posts");

//     < article >
//     <a href="#" class="image"><img src="images/pic01.jpg" alt="" /></a>
//     <h3>Interdum aenean</h3>
//     <p>Aenean ornare velit lacus, ac varius enim lorem ullamcorper dolore. Proin aliquam
// 								facilisis ante interdum. Sed nulla amet lorem feugiat tempus aliquam.</p>
//     <ul class="actions">
//         <li><a href="#" class="button">More</a></li>
//     </ul>
// </article >

function create_topic(data, topics_list) {
    var article = document.createElement('article');
    var a = document.createElement('a');
    var img = document.createElement('img');
    var h3 = document.createElement('h3');
    var p = document.createElement('p');
    var ul = document.createElement('ul');
    var li = document.createElement('li');
    var li_a = document.createElement('a');


}

function topic_loader(data, topics_name, topics_list) {

}