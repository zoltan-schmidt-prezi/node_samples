function openPage(pageName,elmnt) {
    var bodyStyles = window.getComputedStyle(document.body);
    var highlight = bodyStyles.getPropertyValue('--highlight-color');
    var inactive = bodyStyles.getPropertyValue('--text-color-inactive');
    var active = bodyStyles.getPropertyValue('--text-color');

    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
        tablinks[i].style.color = inactive;
    }
    document.getElementById(pageName).style.display = "block";
    elmnt.style.backgroundColor = highlight;
    elmnt.style.color = active;
}
// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();
