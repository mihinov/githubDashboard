import { fromEvent, EMPTY } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, mergeMap, tap, catchError, filter } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { identity } from 'rxjs/index';
import './index.css';

const url = 'https://api.github.com/search/repositories?q=';

const search = document.getElementById('search');
const result = document.getElementById('result');
const backBtn = document.querySelector('.back.btn');
const forwardBtn = document.querySelector('.forward.btn');

let searchObj = {
    page: 1,
    value: ''
};
const per_page = 10;
const debounceTimeVaring = 1000;

const SearchPipe = (settings) => (obs) => obs.pipe(
    (settings === true) ? distinctUntilChanged() : identity,
    map(e => {
        return search.value;
    }),
    tap((v) => {
        console.clear();
        if (searchObj.value !== v) {
            searchObj.page = 1;
        }
        searchObj.value = v;
        backBtn.disabled = true;
        forwardBtn.disabled = true;
    }),
    debounceTime(debounceTimeVaring),
    filter(v => v.trim()),
    switchMap(
        v => ajax({
            url: url + v + '&per_page=' + per_page + '&page=' + searchObj.page,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .pipe(
            catchError(err => EMPTY)
        )
    ),
    tap((response) => {
        const total_count = response.response.total_count;
        const per_page_max = Math.ceil(total_count / per_page);
        if (searchObj.page > 1) {
            backBtn.disabled = false;
        }
        if (searchObj.page !== per_page_max && per_page_max !== 0) {
            forwardBtn.disabled = false;
        }
        
        console.log('total_count', total_count);
        console.log('per_page_max', per_page_max);
        console.log('searchObj.page', searchObj.page);
        localStorage.setItem('searchLocalStorage', JSON.stringify(searchObj));
    }),
    map(response => response.response.items),
    mergeMap(items => items)
);

const stream$ = fromEvent(search, 'input')
    .pipe(
        SearchPipe(true)
    );

stream$.subscribe(value => {
    subscribeStream(value);
});

function subscribeStream(value) {
    console.log(value);
}

const searchLocaleStorage = JSON.parse(localStorage.getItem('searchLocalStorage'));
if (localStorage.getItem('searchLocalStorage')) {
    searchObj.page = searchLocaleStorage.page;
}

if (localStorage.getItem('searchLocalStorage')) {
    const eventInput = new Event('input');
    search.value = searchLocaleStorage.value;
    search.dispatchEvent(eventInput);
}

fromEvent(forwardBtn, 'click')
    .pipe(
        tap(() => {
            searchObj.page++;
            forwardBtn.disabled = true;
        }),
        SearchPipe(false)
    ).subscribe(v => subscribeStream(v));

fromEvent(backBtn, 'click')
    .pipe(
        tap(() => {
            searchObj.page--;
            backBtn.disabled = true;
        }),
        SearchPipe(false)
    ).subscribe(v => subscribeStream(v));

// function formatDate(date) {

//     var dd = date.getDate();
//     if (dd < 10) dd = '0' + dd;
  
//     var mm = date.getMonth() + 1;
//     if (mm < 10) mm = '0' + mm;
  
//     var yy = date.getFullYear() % 100;
//     if (yy < 10) yy = '0' + yy;
  
//     return dd + '.' + mm + '.' + yy;
// }

// const stream$ = fromEvent(search, 'input')
//     .pipe(
//         map(e => e.target.value),
//         debounceTime(1000),
//         distinctUntilChanged(),
//         tap(() => result.innerHTML = ''),
//         filter(v => v.trim()),
//         switchMap(v => ajax.getJSON(url + v)
//             .pipe(
//                 catchError(err => EMPTY)
//             )    
//         ),
//         map(response => response.items),
//         mergeMap(items => items)
//     );

// stream$.subscribe(user => {
//     const html = `
//     <div class="card">
//         <div class="card-image">
//             <img src="${user.avatar_url}">
//             <span class="card-title">${user.login}</span>
//         </div>
//         <div class="card-action">
//             <a href="${user.html_url}" target="_blank">Открыть github</a>
//         </div>
//     </div>`;

//     result.insertAdjacentHTML('beforeend', html);
// });