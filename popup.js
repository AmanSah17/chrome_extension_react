const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const greetingElement = document.getElementById('greeting');

function updateTime() {
    const now = new Date();
    const currentTime = now.toLocaleTimeString();
    const currentDate = now.toDateString();
    const currentHour = now.getHours();

    let greeting = 'Hello!';
    if (currentHour < 12) {
        greeting = 'Good morning!';
    } else if (currentHour < 18) {
        greeting = 'Good afternoon!';
    } else {
        greeting = 'Good evening!';
    }

    timeElement.textContent = `Right now the time is: ${currentTime}`;
    dateElement.textContent = currentDate;
    greetingElement.textContent = greeting;
}

// Update the time immediately, and then every second
updateTime();
setInterval(updateTime, 1000);


chrome.action.setBadgeText({ text: 'TIMER' ,
    
 } ,()=> {
    console.log('Badge text set to "TIMER Extension"');
});
