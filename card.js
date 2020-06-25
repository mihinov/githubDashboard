/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./card/card.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./card/card.js":
/*!**********************!*\
  !*** ./card/card.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _img_star_svg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../img/star.svg */ \"./img/star.svg\");\nlet reposGithub;\r\n\r\nif (localStorage.getItem('repos-in-user-github')) {\r\n    reposGithub = JSON.parse(localStorage.getItem('repos-in-user-github'));\r\n}\r\n\r\nfunction formatDate(date) {\r\n\r\n    let dd = date.getDate();\r\n    if (dd < 10) dd = '0' + dd;\r\n  \r\n    let mm = date.getMonth() + 1;\r\n    if (mm < 10) mm = '0' + mm;\r\n  \r\n    let yy = date.getFullYear();\r\n    if (yy < 10) yy = '0' + yy;\r\n  \r\n    return dd + '.' + mm + '.' + yy;\r\n}\r\n\r\n\r\n\r\nfunction sendGetRequest(url) {\r\n\treturn fetch(url).then(response => response.json());\r\n}\r\n\r\nlet objGit = {\r\n    languages: false,\r\n    contributors: false\r\n};\r\n\r\nif (reposGithub) {\r\n    sendGetRequest(reposGithub.languages_url)\r\n    .then((res) => {\r\n        objGit.languages = res;\r\n        if (objGit.languages !== false && objGit.contributors !== false) {\r\n            addCard(objGit);\r\n        }     \r\n    });\r\n    sendGetRequest(reposGithub.contributors_url)\r\n    .then((res) => {\r\n        objGit.contributors = res;\r\n        if (objGit.languages !== false && objGit.contributors !== false) {\r\n            addCard(objGit);\r\n        }     \r\n    });\r\n}\r\n\r\nfunction addCard(objGit) {\r\n    const languagesUrl = objGit.languages;\r\n    const contributors = objGit.contributors.slice(0, 10);\r\n\r\n    const result = document.getElementById('result');\r\n\r\n    const val = reposGithub;\r\n    const user = val.owner;\r\n    const stargazers_count = val.stargazers_count;\r\n    const pushed_at = Date.parse(val.pushed_at);\r\n    const date_last_commit = !isNaN(pushed_at) ? formatDate(new Date(pushed_at)) : 'No';\r\n\r\n    let languages_item_card = '';\r\n    if (Object.keys(languagesUrl).length !== 0) {\r\n        for (let key in languagesUrl) {\r\n            languages_item_card += `\r\n                <div class=\"card-action-info__item\">\r\n                    ${key}\r\n                </div>\r\n                `;\r\n        }\r\n    }\r\n\r\n    const cardHTML = `\r\n        <div class=\"card\">\r\n            <div class=\"card-image\">\r\n                <img src=\"${user.avatar_url}\">\r\n                <span class=\"card-title\">${val.name}</span>\r\n            </div>\r\n            <div class=\"card-action\">\r\n                <a href=\"${val.html_url}\" target=\"_blank\">Репозиторий</a>\r\n                <a href=\"${user.html_url}\" target=\"_blank\">Аккаунт</a>\r\n                <div class=\"card-action-info\">\r\n                    <div class=\"card-action-info__item\">\r\n                        <div class=\"card-action-info__item-left\">\r\n                            <img src=\"${_img_star_svg__WEBPACK_IMPORTED_MODULE_0__[\"default\"]}\">\r\n                        </div>\r\n                        <div class=\"card-action-info__item-count\">\r\n                            ${stargazers_count}\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"card-action-info__item\">\r\n                        <div class=\"card-action-info__item-left\">\r\n                            Last commit\r\n                        </div>\r\n                        <div class=\"card-action-info__item-count\">\r\n                            ${date_last_commit}\r\n                        </div>\r\n                    </div>\r\n                    ${languages_item_card}\r\n                </div>\r\n            </div>\r\n        </div>`;\r\n\r\n    result.insertAdjacentHTML('beforeend', cardHTML);\r\n\r\n\r\n    if (contributors.length !== 0) {\r\n        const contributorsNode = document.createElement('div');\r\n        contributorsNode.classList.add('contributors');\r\n        contributorsNode.innerHTML = '<div class=\"contributors__title\">TOP contributors</div>';\r\n        result.append(contributorsNode);\r\n\r\n        let contributor = '';\r\n        contributors.forEach((item) => {\r\n            console.log(item);\r\n            contributor += `\r\n                <a href=\"${item.html_url}\" class=\"contributor\" target=\"_blank\">\r\n                    <img src=\"${item.avatar_url}\">\r\n                </a>\r\n            `;\r\n        });\r\n        // console.log(contributor);\r\n        contributorsNode.insertAdjacentHTML('beforeend', contributor);\r\n    }\r\n    \r\n\r\n}\n\n//# sourceURL=webpack:///./card/card.js?");

/***/ }),

/***/ "./img/star.svg":
/*!**********************!*\
  !*** ./img/star.svg ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (__webpack_require__.p + \"ccf2607d87ba9c1c96c6b910f58ffd22.svg\");\n\n//# sourceURL=webpack:///./img/star.svg?");

/***/ })

/******/ });