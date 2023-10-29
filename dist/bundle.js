/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/git_ops.js":
/*!***********************!*\
  !*** ./js/git_ops.js ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var isomorphic_git__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! isomorphic-git */ \"isomorphic-git\");\n/* harmony import */ var isomorphic_git__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(isomorphic_git__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var https_unpkg_com_isomorphic_git_beta_http_web_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! https://unpkg.com/isomorphic-git@beta/http/web/index.js */ \"https://unpkg.com/isomorphic-git@beta/http/web/index.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([https_unpkg_com_isomorphic_git_beta_http_web_index_js__WEBPACK_IMPORTED_MODULE_1__]);\nhttps_unpkg_com_isomorphic_git_beta_http_web_index_js__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\r\n\r\n\r\n// Initialize isomorphic-git with a file system\r\nwindow.fs = new LightningFS('fs')\r\n// I prefer using the Promisified version honestly\r\nwindow.pfs = window.fs.promises\r\nwindow.dir = '/tutorial'\r\nconsole.log(dir);\r\n// await pfs.mkdir(dir);\r\n// Behold - it is empty!\r\nawait pfs.readdir(dir);\r\n\r\n\r\nasync function clone_repo(repo_url, branch='main', depth=1) {\r\n    return await isomorphic_git__WEBPACK_IMPORTED_MODULE_0___default().clone({\r\n        fs: window.fs,\r\n        http: http,\r\n        dir: window.dir,\r\n        corsProxy: 'https://cors.isomorphic-git.org',\r\n        url: repo_url,\r\n        ref: branch,\r\n        singleBranch: true,\r\n        depth: depth,\r\n    })\r\n}\r\n\r\n\r\nconsole.log(\"working...\")\r\nawait isomorphic_git__WEBPACK_IMPORTED_MODULE_0___default().clone({\r\n    fs: window.fs,\r\n    http: http,\r\n    dir: window.dir,\r\n    corsProxy: 'https://cors.isomorphic-git.org',\r\n    url: 'https://github.com/isomorphic-git/isomorphic-git',\r\n    ref: 'main',\r\n    singleBranch: true,\r\n    depth: 1,\r\n});\r\nconsole.log(\"cloned.\")\r\nawait pfs.readdir(dir)\r\nawait isomorphic_git__WEBPACK_IMPORTED_MODULE_0___default().log({fs, dir})\r\nconsole.log(\"done.\")\r\n\r\nconsole.log(\"Status:\")\r\n// Check status of a file\r\nawait isomorphic_git__WEBPACK_IMPORTED_MODULE_0___default().status({fs: window.fs, dir: window.dir, filepath: 'README.md'})\r\n\r\n\r\n\r\nconsole.log(\"Modify:\")\r\n// Modify a file\r\nawait window.pfs.writeFile(`${dir}/README.md`, 'Very short README', 'utf8')\r\n\r\nconsole.log(\"Que Changes:\")\r\n// Add changes to git\r\nawait isomorphic_git__WEBPACK_IMPORTED_MODULE_0___default().add({fs: window.fs, dir: window.dir, filepath: 'README.md'})\r\n\r\n\r\nconsole.log(\"Commit Changes:\")\r\n// Commit changes\r\nlet sha = await isomorphic_git__WEBPACK_IMPORTED_MODULE_0___default().commit({\r\nfs: window.fs,\r\ndir: window.dir,\r\nmessage: 'Delete package.json and overwrite README.',\r\nauthor: {\r\n    name: 'Mr. Test',\r\n    email: 'mrtest@example.com'\r\n}\r\n})\r\nconsole.log(\"Done.\")\r\n\r\nlet commits = await isomorphic_git__WEBPACK_IMPORTED_MODULE_0___default().log({fs: window.fs, dir: window.dir, depth: 1})\r\nconsole.log(commits[0])\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } }, 1);\n\n//# sourceURL=webpack://codenomicon/./js/git_ops.js?");

/***/ }),

/***/ "https://unpkg.com/isomorphic-git@beta/http/web/index.js":
false,

/***/ "isomorphic-git":
/*!**************************************************************************!*\
  !*** external "https://unpkg.com/isomorphic-git@beta/http/web/index.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = https://unpkg.com/isomorphic-git@beta/http/web/index.js;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && queue.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && queue.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./js/git_ops.js");
/******/ 	
/******/ })()
;