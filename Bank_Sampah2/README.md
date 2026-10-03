# CodeIgniter 4 Framework

## Bank Sampah API (Apps Script replacement)

The API is served by `app/Controllers/Api.php` at `/api` and uses JSON responses. It supports the frontend actions for operator and resident accounts, waste categories, collection groups, deposits, sales and stock, cash and reports, announcements, points redemption, and the catalog. Operator data is read from the existing `operator` table. Except for login, ping, public announcements/catalog reads, and logout, API actions require an active login session. Writes require an operator session, POST with a JSON body, and an allowed Origin. In production, session cookies are marked `Secure`.

### Local setup

1. Start MySQL/MariaDB with the existing `bank_sampah` database and verify its `operator` table has `id_operator`, `nama`, `username`, `no_hp`, `password`, `role`, and `status` columns. Do not run migrations against an existing database.
2. Set the local database connection in `.env` (copy `env` as a starting point if needed). The ignored local `.env` in this workspace is configured for Laragon's `127.0.0.1:3306` with database `bank_sampah` and root with no password.
3. From this folder, run `composer install` if dependencies are missing, then start the API with `php spark serve --host 0.0.0.0 --port 8080`. Check that it responds with `http://127.0.0.1:8080/api?action=ping`.
4. In the workspace root, start the Vue app with `npm run dev`. Vite proxies `/api` to `http://127.0.0.1:8080/api`; override the proxy target with `VITE_CI_API_PROXY` if needed.

For a deployed Vue frontend on Vercel and CodeIgniter API on another host, configure the Vercel **build environment variable** `VITE_API_BASE_URL` to the full public CodeIgniter API URL, including `/api` (for example, `https://your-backend.example/api`). Set it for the production environment and redeploy; Vite embeds this value during the build. Do not leave it unset in production: Vercel's SPA rewrite sends unknown paths such as `/api` to `index.html`, which can cause `405 Method Not Allowed`.

On the API host, set `CORS_ALLOWED_ORIGINS` in its private `.env` to the exact Vercel origin(s), comma-separated and without paths (for example, `https://your-app.vercel.app,https://your-custom-domain.example`). Include the Vercel preview origin only if previews should access the production API. The API must run in the `production` environment over HTTPS so its cross-site session cookie uses `SameSite=None; Secure`; browsers with third-party cookies disabled may still block cross-site sessions, in which case use frontend and API custom domains under the same site. Keep database credentials and other secrets in the API host's private `.env`, never in Vercel `VITE_*` variables or committed files. API session cookies are included with requests. There is no default operator account or CSV seeder; existing passwords in `operator.password` must be PHP password hashes.

> The legacy Apps Script API did not enforce operator authorization. This port preserves that endpoint contract for compatibility, so protect write endpoints with authentication/authorization before exposing the API publicly.

## What is CodeIgniter?

CodeIgniter is a PHP full-stack web framework that is light, fast, flexible and secure.
More information can be found at the [official site](https://codeigniter.com).

This repository holds the distributable version of the framework.
It has been built from the
[development repository](https://github.com/codeigniter4/CodeIgniter4).

More information about the plans for version 4 can be found in [CodeIgniter 4](https://forum.codeigniter.com/forumdisplay.php?fid=28) on the forums.

You can read the [user guide](https://codeigniter.com/user_guide/)
corresponding to the latest version of the framework.

## Important Change with index.php

`index.php` is no longer in the root of the project! It has been moved inside the *public* folder,
for better security and separation of components.

This means that you should configure your web server to "point" to your project's *public* folder, and
not to the project root. A better practice would be to configure a virtual host to point there. A poor practice would be to point your web server to the project root and expect to enter *public/...*, as the rest of your logic and the
framework are exposed.

**Please** read the user guide for a better explanation of how CI4 works!

## Repository Management

We use GitHub issues, in our main repository, to track **BUGS** and to track approved **DEVELOPMENT** work packages.
We use our [forum](http://forum.codeigniter.com) to provide SUPPORT and to discuss
FEATURE REQUESTS.

This repository is a "distribution" one, built by our release preparation script.
Problems with it can be raised on our forum, or as issues in the main repository.

## Contributing

We welcome contributions from the community.

Please read the [*Contributing to CodeIgniter*](https://github.com/codeigniter4/CodeIgniter4/blob/develop/CONTRIBUTING.md) section in the development repository.

## Server Requirements

PHP version 8.2 or higher is required, with the following extensions installed:

- [intl](http://php.net/manual/en/intl.requirements.php)
- [mbstring](http://php.net/manual/en/mbstring.installation.php)

> [!WARNING]
> - The end of life date for PHP 7.4 was November 28, 2022.
> - The end of life date for PHP 8.0 was November 26, 2023.
> - The end of life date for PHP 8.1 was December 31, 2025.
> - If you are still using below PHP 8.2, you should upgrade immediately.
> - The end of life date for PHP 8.2 will be December 31, 2026.

Additionally, make sure that the following extensions are enabled in your PHP:

- json (enabled by default - don't turn it off)
- [mysqlnd](http://php.net/manual/en/mysqlnd.install.php) if you plan to use MySQL
- [libcurl](http://php.net/manual/en/curl.requirements.php) if you plan to use the HTTP\CURLRequest library
