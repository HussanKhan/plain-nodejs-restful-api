const flash_text = document.getElementsByClassName('flash_text')[0].innerHTML;
if (flash_text != "${flash_message}") {
    
    document.getElementsByClassName('flash_message')[0].style.display = "block";

    setTimeout(() => {
        document.getElementsByClassName('flash_message')[0].style.opacity = "1";
        document.getElementsByClassName('flash_message')[0].style.paddingTop = "23px";
        document.getElementsByClassName('flash_message')[0].style.paddingBottom = "23px";
    }, 100)
    
    setTimeout(() => {
        document.getElementsByClassName('flash_message')[0].style.paddingTop = "0px";
        document.getElementsByClassName('flash_message')[0].style.paddingBottom = "0px";
        document.getElementsByClassName('flash_text')[0].style.opacity = "0";
        document.getElementsByClassName('flash_message')[0].style.opacity = "0";
    }, 6000)
    
    setTimeout(() => {
        document.getElementsByClassName('flash_message')[0].style.opacity = "0";
    }, 6500);
    
    setTimeout(() => {
        document.getElementsByClassName('flash_message')[0].style.display = "none";
    }, 7000);
    
}

// document.getElementById('form').addEventListener("submit"