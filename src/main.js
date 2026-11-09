import {PREP_TIME} from './js/menu.js';

const form = document.querySelector('.form');
const orderLog = document.querySelector('.order-log');

function makeOrder(delay, shouldResolve) {
    const promise = new Promise((res, rej) => {
        setTimeout(() => {
            if(shouldResolve === true) {
                res(delay);
            } 
            else {
                rej(delay);
            }
        }, delay)
    })
    return promise;
}
function addOrderRow(drink) {
    const li = document.createElement('li');
    li.classList.add('row-pending');
    li.textContent = `⏳ ${drink} · у роботі…`;
    orderLog.appendChild(li);
    return li;
}
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const drink = formData.get('drink');
    const state = formData.get('state');
    const shouldResolve = state === "fulfilled";
    const delay = PREP_TIME[drink];
    
    const row = addOrderRow(drink);
    makeOrder(delay, shouldResolve)
    .then((resDelay) => {
        row.classList.replace("row-pending", "row-ok");
        row.textContent = `✅ ${drink} · готове · ${resDelay} ms`;
    })
    .catch((rejDelay) => {
        row.classList.replace("row-pending", "row-err");
        row.textContent = `❌ ${drink} · скасовано · ${rejDelay} ms`;
    })
    .finally(() => {
        const timeString = new Date().toLocaleTimeString("uk-UA");
        row.textContent += ` · ${timeString}`;
    });
})
