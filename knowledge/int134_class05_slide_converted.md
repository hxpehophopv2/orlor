# INT134 SYSTEM DEPLOYMENT 2026
## Class 5
### Reverse Proxy and Integration
Wednesday, 2 September 2026
Olarn Rojanapornpun

---

## Flow
### Frontend

*   **Install package:**
    *   Install nginx from nginx.org
    *   [Start service]
    *   `$ systemctl start nginx`
*   **Install source:**
    *   `$ tar`
    *   `$ rsync`
*   **Configure the service:**
    *   `$ micro config.js`
    *   `$ micro /etc/nginx/conf.d/site.conf`
*   **Run the service:**
    *   `$ nginx -t`
    *   `$ systemctl reload nginx`

---

## Flow
### Database
*   **Install package:**
    *   Install mysql-server
    *   [Start service]
    *   `$ systemctl status mysql`
*   **Install source:**
    *   *N/A*
*   **Configure the service:**
    *   `$ sudo mysql < setup.sql`
*   **Run the service:**
    *   `$ ... < schema.sql`
    *   `$ ... < seed.sql`

### Backend
*   **Install package:**
    *   Install nodejs from nodesource
*   **Install source:**
    *   `$ npm ci`
*   **Configure the service:**
    *   `$ micro .env`
    *   `$ npx prisma generate`
    *   `$ micro /etc/systemd/system/api.service`
*   **Run the service:**
    *   `$ systemctl enable --now api`
    *   `$ ufw allow <port>/tcp`

---

## Problem with CORS

**(index):1**
Access to fetch at 'http://lvm68173.sit.kmutt.ac.th:3173/api/students' from origin 'http://lvm68173.sit.kmutt.ac.th:8173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

*(Screenshot of browser Developer Tools Network tab showing a failed request to `students` endpoint. The Origin header is `http://lvm68173.sit.kmutt.ac.th:8173` and the Host header is `lvm68173.sit.kmutt.ac.th:3173`)*

---

## Cross-Origin Resource Sharing (CORS)

> "Cross-Origin Resource Sharing (CORS) is an HTTP-header based mechanism that allows a server to indicate any origins (domain, scheme, or port) other than its own from which a browser should permit loading resources."
>
> -- [https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

> "CORS defines a way in which a browser and server can interact to determine whether it is safe to allow the cross-origin request. It allows for more freedom and functionality than purely same-origin requests, but is more secure than simply allowing all cross-origin requests."
>
> -- [https://en.wikipedia.org/wiki/Cross-origin_resource_sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)

---

## Reverse Proxy

*   A reverse proxy is a server that (transparently) forwards the client's requests to one or more web servers
*   A reverse proxy sits in front of an origin server and ensures that no client ever communicates directly with that origin server
*   Reverse proxies help increase scalability, performance, resilience, and security

https://en.wikipedia.org/wiki/Reverse_proxy
https://www.cloudflare.com/en-gb/learning/cdn/glossary/reverse-proxy/

---

## Reverse Proxy

*(Diagram showing multiple user devices connecting to a Reverse Proxy over the Internet. The Reverse Proxy then connects to one of multiple Origin Servers.)*

*   user's device (D) (example.com) -> Internet -> reverse proxy (E) -> origin server (F)
*   https://www.cloudflare.com/en-gb/learning/cdn/glossary/reverse-proxy/

---

## Without Reverse Proxy

*(Diagram showing two separate direct connections from outside the KMUTT Network to a VM (lvm68173).)*

*   **KMUTT Network -> lvm68173**
    *   `lvm68173.sit.kmutt.ac.th` connects directly to `:80` which goes to the **Front-end (NGINX)**
    *   `lvm68173.sit.kmutt.ac:3000/api/notices` connects directly to `:3000` which goes to the **Back-end (Node.js)**

---

## With Reverse Proxy

*(Diagram showing connections routed through a Reverse Proxy on the VM.)*

*   **KMUTT Network -> lvm68173**
    *   All external requests go to `:80` (the Reverse Proxy).
    *   `lvm68173.sit.kmutt.ac.th/` is routed by the Reverse Proxy to `/ (frontend)` going to the **Front-end (NGINX)**.
    *   `lvm68173.sit.kmutt.ac/api/notices` is routed by the Reverse Proxy to `localhost:3000/api/notices` going to the **Back-end (Node.js)** on `:3000`.

---

## With Reverse Proxy and Nested Path

*(Diagram showing connections routed through a Reverse Proxy on the VM with a nested path `/school/`.)*

*   **KMUTT Network -> lvm68173**
    *   All external requests go to `:80` (the Reverse Proxy).
    *   `lvm68173.sit.kmutt.ac.th/school/` is routed by the Reverse Proxy to `/school/` going to the **Front-end (NGINX)**.
    *   `lvm66173.sit.kmutt.ac/school/api/students` is routed by the Reverse Proxy to `localhost:3173/api/students` going to the **Back-end (Node.js)** on `:3000`.
