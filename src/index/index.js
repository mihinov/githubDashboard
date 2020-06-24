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
const btn_paginator_numbers = document.querySelector('.btn-paginator_numbers');

let searchObj = {
    page: 1,
    value: ''
};
const per_page = 10;
const debounceTimeVaring = 2000;

const searchLocaleStorage = JSON.parse(localStorage.getItem('searchLocalStorage'));
if (localStorage.getItem('searchLocalStorage')) {
    searchObj.page = searchLocaleStorage.page;
    searchObj.value = searchLocaleStorage.value;
    search.value = searchLocaleStorage.value;
}

const SearchPipe = (settings) => (obs) => obs.pipe(
    (settings === true) ? distinctUntilChanged() : identity,
    map(e => {
        return {v: search.value, target: e.target};
    }),
    tap((objValAndTarget) => {
        const v = objValAndTarget.v;
        const target = objValAndTarget.target;
        console.clear();
        result.innerHTML = '';

        const btn_numbers = [...document.querySelectorAll('.btn.btn_number')];
        btn_numbers.forEach((item) => {
            item.disabled = true;
        });
        
        if (searchObj.value !== v) {
            searchObj.page = 1;
        }
        searchObj.startValue = searchObj.value;
        searchObj.value = v;
        if (searchObj.startValue !== searchObj.value) {
            btn_paginator_numbers.innerHTML = '';
        }
        backBtn.disabled = true;
        forwardBtn.disabled = true;

        searchObj.startPage = searchObj.page;
        const dataPage = target.getAttribute('data-page');
        if (dataPage) {
            searchObj.page = Number(dataPage);
        }
    }),
    map((objValAndTarget) => objValAndTarget.v),
    debounceTime(debounceTimeVaring),
    filter(v => v.trim()),
    switchMap(
        v => ajax({
            url: url + v + '&per_page=' + per_page + '&page=' + searchObj.page + '&sort=stars',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .pipe(
            catchError(err => {
                logicBtns({error: true});
                searchObj.page = searchObj.startPage;
                return EMPTY;
            })
        )
    ),
    tap((response) => {
        const total_count = response.response.total_count > 1000 ? 1000 : response.response.total_count;

        const per_page_max = Math.ceil(total_count / per_page);
        logicBtns(false, per_page_max);
        
        if (searchObj.startValue === searchObj.value) {
            btn_paginator_numbers.innerHTML = '';
            addPaginatorNumberBtns(per_page_max, total_count);
        }
        

        // console.log('total_count', total_count);
        // console.log('per_page_max', per_page_max);
        delete searchObj.startPage;
        delete searchObj.startValue;
        delete searchObj.wereAdedBtns;
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

fromEvent(forwardBtn, 'click')
    .pipe(
        SearchPipe(false)
    ).subscribe(v => subscribeStream(v));

fromEvent(backBtn, 'click')
    .pipe(
        SearchPipe(false)
    ).subscribe(v => subscribeStream(v));

if (localStorage.getItem('searchLocalStorage')) {
    const eventInput = new Event('input');
    search.value = searchLocaleStorage.value;
    search.dispatchEvent(eventInput);
}

function logicBtns(objError, per_page_max) {
    if (objError.error === true) {
        return false;
    }
    backBtn.setAttribute('data-page', searchObj.page - 1);
    forwardBtn.setAttribute('data-page', searchObj.page + 1);
    if (searchObj.page > 1) {
        backBtn.disabled = false;
    }
    if (searchObj.page !== per_page_max && per_page_max !== 0) {
        forwardBtn.disabled = false;
    }
}

import stargazersIcon from './../img/star.svg';

function subscribeStream(val) {
    const user = val.owner;
    const stargazers_count = val.stargazers_count;
    const pushed_at = Date.parse(val.pushed_at);
    const date_last_commit = formatDate(new Date(pushed_at));
    const cardHTML = `
        <div class="card">
            <div class="card-image">
                <img src="${user.avatar_url}">
                <span class="card-title">${val.name}</span>
            </div>
            <div class="card-action">
                <a href="${val.html_url}" target="_blank">Открыть github</a>
                <div class="card-action-info">
                    <div class="card-action-info__item">
                        <div class="card-action-info__item-left">
                            <img src="${stargazersIcon}">
                        </div>
                        <div class="card-action-info__item-count">
                            ${stargazers_count}
                        </div>
                    </div>
                    <div class="card-action-info__item">
                        <div class="card-action-info__item-left">
                            Last commit
                        </div>
                        <div class="card-action-info__item-count">
                            ${date_last_commit}
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    
    // console.log(val);
    result.insertAdjacentHTML('beforeend', cardHTML);
}


function formatDate(date) {

    let dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
  
    let mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
  
    let yy = date.getFullYear();
    if (yy < 10) yy = '0' + yy;
  
    return dd + '.' + mm + '.' + yy;
}

function addPaginatorNumberBtns(per_page_max, total_count) {

    function appendBtn(i) {
        const activeBtn = searchObj.page === i;
        const btnPaginatorHTML = document.createElement('button');
        btnPaginatorHTML.classList.add('btn', 'btn_number');
        if (activeBtn) {
            btnPaginatorHTML.classList.add('active');
        }
        btnPaginatorHTML.disabled = activeBtn === true ? 'disabled' : '';
        btnPaginatorHTML.setAttribute('data-page', i);
        btnPaginatorHTML.innerHTML = i;

        btn_paginator_numbers.append(btnPaginatorHTML);
        fromEvent(btnPaginatorHTML, 'click')
            .pipe(
                SearchPipe(false)
            )
            .subscribe((val) => subscribeStream(val));
    }

    if (per_page_max < 7 && per_page_max > 2) { //
        for (let i = 1; i < per_page_max + 1; i++) {
            appendBtn(i);
        }
    } else {
        console.log(1);
        for (let i = 1; i < per_page_max + 1; i++) {
            appendBtn(i);
        }
    }
}