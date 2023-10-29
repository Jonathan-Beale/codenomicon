import git from 'isomorphic-git';

import 'https://unpkg.com/isomorphic-git@beta/http/web/index.js';
// Initialize isomorphic-git with a file system
window.fs = new LightningFS('fs')
// I prefer using the Promisified version honestly
window.pfs = window.fs.promises
window.dir = '/tutorial'
console.log(dir);
// await pfs.mkdir(dir);
// Behold - it is empty!
await pfs.readdir(dir);


async function clone_repo(repo_url, branch='main', depth=1) {
    return await git.clone({
        fs: window.fs,
        http: http,
        dir: window.dir,
        corsProxy: 'https://cors.isomorphic-git.org',
        url: repo_url,
        ref: branch,
        singleBranch: true,
        depth: depth,
    })
}


console.log("working...")
await git.clone({
    fs: window.fs,
    http: http,
    dir: window.dir,
    corsProxy: 'https://cors.isomorphic-git.org',
    url: 'https://github.com/isomorphic-git/isomorphic-git',
    ref: 'main',
    singleBranch: true,
    depth: 1,
});
console.log("cloned.")
await pfs.readdir(dir)
await git.log({fs, dir})
console.log("done.")

console.log("Status:")
// Check status of a file
await git.status({fs: window.fs, dir: window.dir, filepath: 'README.md'})



console.log("Modify:")
// Modify a file
await window.pfs.writeFile(`${dir}/README.md`, 'Very short README', 'utf8')

console.log("Que Changes:")
// Add changes to git
await git.add({fs: window.fs, dir: window.dir, filepath: 'README.md'})


console.log("Commit Changes:")
// Commit changes
let sha = await git.commit({
fs: window.fs,
dir: window.dir,
message: 'Delete package.json and overwrite README.',
author: {
    name: 'Mr. Test',
    email: 'mrtest@example.com'
}
})
console.log("Done.")

let commits = await git.log({fs: window.fs, dir: window.dir, depth: 1})
console.log(commits[0])