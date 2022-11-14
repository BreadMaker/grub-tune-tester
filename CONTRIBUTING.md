Thank you for taking the time to contribute to this project. Here's what you need to do to successfully submit your changes to the repository.

1. Create your local development environment by executing the `npm install` command in the repo's root folder.
2. Change the files under the [`src`](https://github.com/BreadMaker/grub-tune-tester/tree/master/src) folder.
3. Apply the changes by running the `npm run build` command (or `npm run build:watch` which will do the same but every time it detects files have changed).
4. Watch your changes locally by running `python -m http.server <port-number>` (or `python -m SimpleHTTPServer <port-number>` if using old Python2), and then browsing to `http://localhost:<port-number>`.

We can always review and improve the changes in the push request, so go for it. Happy coding!