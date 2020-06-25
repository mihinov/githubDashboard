let reposGithub;

if (localStorage.getItem('repos-in-user-github')) {
    reposGithub = JSON.parse(localStorage.getItem('repos-in-user-github'));
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

import stargazersIcon from './../img/star.svg';

function sendGetRequest(url) {
	return fetch(url).then(response => response.json());
}

let objGit = {
    languages: false,
    contributors: false
};

if (reposGithub) {
    sendGetRequest(reposGithub.languages_url)
    .then((res) => {
        objGit.languages = res;
        if (objGit.languages !== false && objGit.contributors !== false) {
            addCard(objGit);
        }     
    });
    sendGetRequest(reposGithub.contributors_url)
    .then((res) => {
        objGit.contributors = res;
        if (objGit.languages !== false && objGit.contributors !== false) {
            addCard(objGit);
        }     
    });
}

function addCard(objGit) {
    const languagesUrl = objGit.languages;
    const contributors = objGit.contributors.slice(0, 10);

    const result = document.getElementById('result');

    const val = reposGithub;
    const user = val.owner;
    const stargazers_count = val.stargazers_count;
    const pushed_at = Date.parse(val.pushed_at);
    const date_last_commit = !isNaN(pushed_at) ? formatDate(new Date(pushed_at)) : 'No';

    let languages_item_card = '';
    if (Object.keys(languagesUrl).length !== 0) {
        for (let key in languagesUrl) {
            languages_item_card += `
                <div class="card-action-info__item">
                    ${key}
                </div>
                `;
        }
    }

    const cardHTML = `
        <div class="card">
            <div class="card-image">
                <img src="${user.avatar_url}">
                <span class="card-title">${val.name}</span>
            </div>
            <div class="card-action">
                <a href="${val.html_url}" target="_blank">Репозиторий</a>
                <a href="${user.html_url}" target="_blank">Аккаунт</a>
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
                    ${languages_item_card}
                </div>
            </div>
        </div>`;

    result.insertAdjacentHTML('beforeend', cardHTML);


    if (contributors.length !== 0) {
        const contributorsNode = document.createElement('div');
        contributorsNode.classList.add('contributors');
        contributorsNode.innerHTML = '<div class="contributors__title">TOP contributors</div>';
        result.append(contributorsNode);

        let contributor = '';
        contributors.forEach((item) => {
            console.log(item);
            contributor += `
                <a href="${item.html_url}" class="contributor" target="_blank">
                    <img src="${item.avatar_url}">
                </a>
            `;
        });
        // console.log(contributor);
        contributorsNode.insertAdjacentHTML('beforeend', contributor);
    }
    

}